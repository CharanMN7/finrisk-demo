'use server';

import { createClient } from '@/utils/supabase/server';

/**
 * Convert array of objects to CSV string
 */
function arrayToCSV(data: Record<string, string | number>[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Escape commas, quotes, and newlines
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

export type ProvisionCalculation = {
  project_id: string;
  loan_id: string;
  borrower_name: string;
  sector: string;
  sanction_amount: number;
  dcco_deferment_days: number;
  dcco_deferment_quarters: number;
  base_provision_rate: number;
  base_provision_amount: number;
  additional_provision_rate: number;
  additional_provision_amount: number;
  total_provision: number;
};

/**
 * Calculate provision for a single project using RBI formula
 */
export async function calculateProjectProvision(
  sanctionAmount: number,
  sector: 'Highway' | 'Power' | 'Residential' | 'CRE' | 'Other',
  dccoDefermentDays: number,
): Promise<{
  baseProvisionRate: number;
  baseProvisionAmount: number;
  additionalProvisionRate: number;
  additionalProvisionAmount: number;
  totalProvision: number;
  dccoDefermentQuarters: number;
}> {
  // Base provision rates
  // Infrastructure (Highway, Power, Other): 1%
  // CRE (Residential, CRE): 1.25%
  const isInfrastructure = ['Highway', 'Power', 'Other'].includes(sector);
  const baseProvisionRate = isInfrastructure ? 0.01 : 0.0125;

  // Calculate base provision
  const baseProvisionAmount = sanctionAmount * baseProvisionRate;

  // Calculate additional provision for DCCO deferment
  // 0.375% per quarter deferred (beyond initial deferment)
  const dccoDefermentQuarters = dccoDefermentDays > 0 ? Math.ceil(dccoDefermentDays / 90) : 0;
  const additionalProvisionRate = dccoDefermentQuarters * 0.00375;
  const additionalProvisionAmount = sanctionAmount * additionalProvisionRate;

  // Total provision
  const totalProvision = baseProvisionAmount + additionalProvisionAmount;

  return {
    baseProvisionRate,
    baseProvisionAmount,
    additionalProvisionRate,
    additionalProvisionAmount,
    totalProvision,
    dccoDefermentQuarters,
  };
}

/**
 * Get provision calculation for a specific project
 */
export async function getProjectProvision(projectId: string) {
  try {
    const supabase = await createClient();

    const { data: project, error } = await supabase.from('projects').select('*').eq('id', projectId).single();

    if (error || !project) {
      console.error('Error fetching project for provision:', error);
      return { error: 'Project not found', data: null };
    }

    const provision = await calculateProjectProvision(
      Number(project.sanction_amount),
      project.sector,
      project.dcco_status || 0,
    );

    const calculation: ProvisionCalculation = {
      project_id: project.id,
      loan_id: project.loan_id,
      borrower_name: project.borrower_name,
      sector: project.sector,
      sanction_amount: Number(project.sanction_amount),
      dcco_deferment_days: project.dcco_status || 0,
      dcco_deferment_quarters: provision.dccoDefermentQuarters,
      base_provision_rate: provision.baseProvisionRate,
      base_provision_amount: provision.baseProvisionAmount,
      additional_provision_rate: provision.additionalProvisionRate,
      additional_provision_amount: provision.additionalProvisionAmount,
      total_provision: provision.totalProvision,
    };

    return { data: calculation, error: null };
  } catch (error) {
    console.error('Error calculating provision:', error);
    return { error: 'An unexpected error occurred', data: null };
  }
}

/**
 * Get portfolio-wide provision calculations
 */
export async function getPortfolioProvisions() {
  try {
    const supabase = await createClient();

    const { data: projects, error } = await supabase.from('projects').select('*').eq('status', 'Active');

    if (error || !projects) {
      console.error('Error fetching projects for provisions:', error);
      return { error: 'Failed to fetch projects', data: null };
    }

    // Calculate provision for each project
    const calculations: ProvisionCalculation[] = await Promise.all(
      projects.map(async (project) => {
        const provision = await calculateProjectProvision(
          Number(project.sanction_amount),
          project.sector,
          project.dcco_status || 0,
        );

        return {
          project_id: project.id,
          loan_id: project.loan_id,
          borrower_name: project.borrower_name,
          sector: project.sector,
          sanction_amount: Number(project.sanction_amount),
          dcco_deferment_days: project.dcco_status || 0,
          dcco_deferment_quarters: provision.dccoDefermentQuarters,
          base_provision_rate: provision.baseProvisionRate,
          base_provision_amount: provision.baseProvisionAmount,
          additional_provision_rate: provision.additionalProvisionRate,
          additional_provision_amount: provision.additionalProvisionAmount,
          total_provision: provision.totalProvision,
        };
      }),
    );

    // Calculate totals
    const totalProvision = calculations.reduce((sum, calc) => sum + calc.total_provision, 0);

    // Calculate sector breakdown
    const sectorBreakdown = calculations.reduce(
      (acc: Record<string, number>, calc) => {
        if (!acc[calc.sector]) {
          acc[calc.sector] = 0;
        }
        acc[calc.sector] += calc.total_provision;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      data: {
        calculations,
        totalProvision,
        sectorBreakdown,
        projectCount: calculations.length,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error calculating portfolio provisions:', error);
    return { error: 'An unexpected error occurred', data: null };
  }
}

/**
 * Export provisions to Excel in GL format
 */
export async function exportProvisionsExcel() {
  try {
    const result = await getPortfolioProvisions();

    if (result.error || !result.data) {
      return { error: result.error || 'Failed to fetch data', data: null };
    }

    const { calculations, totalProvision } = result.data;

    // Prepare data for CSV
    type CSVRow = {
      'Loan ID': string;
      'Borrower Name': string;
      Sector: string;
      'Sanction Amount (₹ Crores)': string;
      'DCCO Deferment (Days)': string;
      'DCCO Deferment (Quarters)': string;
      'Base Provision Rate (%)': string;
      'Base Provision (₹ Crores)': string;
      'Additional Provision Rate (%)': string;
      'Additional Provision (₹ Crores)': string;
      'Total Provision (₹ Crores)': string;
    };

    const csvData: CSVRow[] = calculations.map((calc) => ({
      'Loan ID': calc.loan_id,
      'Borrower Name': calc.borrower_name,
      Sector: calc.sector,
      'Sanction Amount (₹ Crores)': calc.sanction_amount.toFixed(2),
      'DCCO Deferment (Days)': calc.dcco_deferment_days.toString(),
      'DCCO Deferment (Quarters)': calc.dcco_deferment_quarters.toString(),
      'Base Provision Rate (%)': (calc.base_provision_rate * 100).toFixed(2),
      'Base Provision (₹ Crores)': calc.base_provision_amount.toFixed(2),
      'Additional Provision Rate (%)': (calc.additional_provision_rate * 100).toFixed(3),
      'Additional Provision (₹ Crores)': calc.additional_provision_amount.toFixed(2),
      'Total Provision (₹ Crores)': calc.total_provision.toFixed(2),
    }));

    // Add summary row
    csvData.push({
      'Loan ID': '',
      'Borrower Name': '',
      Sector: '',
      'Sanction Amount (₹ Crores)': '',
      'DCCO Deferment (Days)': '',
      'DCCO Deferment (Quarters)': '',
      'Base Provision Rate (%)': '',
      'Base Provision (₹ Crores)': '',
      'Additional Provision Rate (%)': '',
      'Additional Provision (₹ Crores)': 'TOTAL:',
      'Total Provision (₹ Crores)': totalProvision.toFixed(2),
    });

    // Generate CSV
    const csv = arrayToCSV(csvData);

    // Convert to base64 for sending to client
    const base64 = Buffer.from(csv, 'utf-8').toString('base64');

    return {
      data: {
        base64,
        filename: `Provision_Calculator_${new Date().toISOString().split('T')[0]}.csv`,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error exporting provisions to CSV:', error);
    return { error: 'Failed to generate CSV file', data: null };
  }
}

/**
 * Log provision calculation export to audit trail
 */
export async function logProvisionExport() {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'User not authenticated' };
    }

    // Log to audit trail
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      user_email: user.email,
      action: 'Exported Provision Calculator',
      entity_type: 'export',
    });

    return { success: true };
  } catch (error) {
    console.error('Error logging provision export:', error);
    return { error: 'Failed to log export' };
  }
}
