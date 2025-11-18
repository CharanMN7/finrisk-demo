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

export type CRILCReportEntry = {
  loan_id: string;
  borrower_name: string;
  sector: string;
  event_type: string;
  event_date: string;
  status: string;
  resolution_plan: string | null;
  sanction_amount: number;
  disbursed_amount: number;
};

/**
 * Generate CRILC (Credit Event) Report for a date range
 */
export async function generateCRILCReport(startDate: string, endDate: string) {
  try {
    const supabase = await createClient();
    
    // Get all alerts (credit events) created within the date range
    const { data: alerts, error } = await supabase
      .from('alerts')
      .select(`
        *,
        projects (
          loan_id,
          borrower_name,
          sector,
          sanction_amount,
          disbursed_amount
        )
      `)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error generating CRILC report:', error);
      return { error: 'Failed to generate report', data: null };
    }

    // Format data for report
    const reportData: CRILCReportEntry[] = alerts.map((alert) => ({
      loan_id: alert.projects?.loan_id || 'N/A',
      borrower_name: alert.projects?.borrower_name || 'N/A',
      sector: alert.projects?.sector || 'N/A',
      event_type: alert.alert_type,
      event_date: new Date(alert.created_at).toISOString().split('T')[0],
      status: alert.status,
      resolution_plan: alert.resolution_plan || 'Under review',
      sanction_amount: alert.projects?.sanction_amount || 0,
      disbursed_amount: alert.projects?.disbursed_amount || 0,
    }));

    return {
      data: reportData,
      count: reportData.length,
      error: null,
    };
  } catch (error) {
    console.error('Error generating CRILC report:', error);
    return { error: 'An unexpected error occurred', data: null, count: 0 };
  }
}

/**
 * Export CRILC report to Excel format
 */
export async function exportCRILCExcel(startDate: string, endDate: string) {
  try {
    const result = await generateCRILCReport(startDate, endDate);
    
    if (result.error || !result.data) {
      return { error: result.error || 'Failed to fetch data', data: null };
    }

    const reportData = result.data;

    // Prepare data for CSV
    const csvData = reportData.map((entry) => ({
      'Loan ID': entry.loan_id,
      'Borrower Name': entry.borrower_name,
      'Sector': entry.sector,
      'Credit Event Type': entry.event_type,
      'Event Date': entry.event_date,
      'Status': entry.status,
      'Sanction Amount (₹ Crores)': Number(entry.sanction_amount).toFixed(2),
      'Disbursed Amount (₹ Crores)': Number(entry.disbursed_amount).toFixed(2),
      'Resolution Plan': entry.resolution_plan || 'Under review',
    }));

    // Generate CSV
    const csv = arrayToCSV(csvData);
    
    // Convert to base64 for sending to client
    const base64 = Buffer.from(csv, 'utf-8').toString('base64');

    return {
      data: {
        base64,
        filename: `CRILC_Report_${startDate}_to_${endDate}.csv`,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error exporting CRILC report to CSV:', error);
    return { error: 'Failed to generate CSV file', data: null };
  }
}

/**
 * Log CRILC report generation to audit trail
 */
export async function logCRILCReportGeneration(startDate: string, endDate: string) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'User not authenticated' };
    }

    // Log to audit trail
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      user_email: user.email,
      action: 'Generated CRILC Report',
      entity_type: 'report',
      field_changed: 'date_range',
      new_value: `${startDate} to ${endDate}`,
    });

    return { success: true };
  } catch (error) {
    console.error('Error logging CRILC report generation:', error);
    return { error: 'Failed to log report generation' };
  }
}

