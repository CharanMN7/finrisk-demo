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

export type AuditLog = {
  id: string;
  user_id: string | null;
  user_email: string | null;
  action: string;
  project_id: string | null;
  project_loan_id: string | null;
  entity_type: string | null;
  entity_id: string | null;
  field_changed: string | null;
  old_value: string | null;
  new_value: string | null;
  ip_address: string | null;
  user_agent: string | null;
  timestamp: string;
};

export type AuditLogFilters = {
  dateRange?: {
    from: string;
    to: string;
  };
  user_id?: string;
  action?: string;
  entity_type?: string;
};

/**
 * Get audit logs with optional filters
 */
export async function getAuditLogs(filters?: AuditLogFilters, page: number = 1, limit: number = 100) {
  try {
    const supabase = await createClient();
    
    let query = supabase
      .from('audit_logs')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters?.dateRange) {
      query = query
        .gte('timestamp', filters.dateRange.from)
        .lte('timestamp', filters.dateRange.to);
    }

    if (filters?.user_id) {
      query = query.eq('user_id', filters.user_id);
    }

    if (filters?.action) {
      query = query.eq('action', filters.action);
    }

    if (filters?.entity_type) {
      query = query.eq('entity_type', filters.entity_type);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order('timestamp', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching audit logs:', error);
      return { error: 'Failed to fetch audit logs', data: null, count: 0 };
    }

    return { data, count: count || 0, error: null };
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return { error: 'An unexpected error occurred', data: null, count: 0 };
  }
}

/**
 * Get unique action types from audit logs
 */
export async function getAuditActionTypes() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('audit_logs')
      .select('action');

    if (error) {
      console.error('Error fetching action types:', error);
      return { error: 'Failed to fetch action types', data: null };
    }

    // Get unique action types
    const uniqueActions = [...new Set(data.map((log) => log.action))].filter(Boolean);

    return { data: uniqueActions, error: null };
  } catch (error) {
    console.error('Error fetching action types:', error);
    return { error: 'An unexpected error occurred', data: null };
  }
}

/**
 * Export audit logs to Excel
 */
export async function exportAuditLogsExcel(filters?: AuditLogFilters) {
  try {
    // Fetch all matching logs (no pagination for export)
    const result = await getAuditLogs(filters, 1, 10000);
    
    if (result.error || !result.data) {
      return { error: result.error || 'Failed to fetch data', data: null };
    }

    const logs = result.data;

    // Prepare data for CSV
    const csvData = logs.map((log: AuditLog) => ({
      'Timestamp (IST)': new Date(log.timestamp).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      'User Email': log.user_email || 'System',
      'Action': log.action,
      'Project Loan ID': log.project_loan_id || '',
      'Entity Type': log.entity_type || '',
      'Field Changed': log.field_changed || '',
      'Old Value': log.old_value || '',
      'New Value': log.new_value || '',
      'IP Address': log.ip_address || '',
    }));

    // Generate CSV
    const csv = arrayToCSV(csvData);
    
    // Convert to base64 for sending to client
    const base64 = Buffer.from(csv, 'utf-8').toString('base64');

    return {
      data: {
        base64,
        filename: `Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error exporting audit logs to CSV:', error);
    return { error: 'Failed to generate CSV file', data: null };
  }
}

/**
 * Log audit trail view to audit logs (meta-logging)
 */
export async function logAuditTrailView() {
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
      action: 'Viewed Audit Trail',
      entity_type: 'audit_log',
    });

    return { success: true };
  } catch (error) {
    console.error('Error logging audit trail view:', error);
    return { error: 'Failed to log view' };
  }
}

/**
 * Create an audit log entry
 */
export async function logAuditEntry(
  action: string,
  entityType?: string,
  entityId?: string,
  projectId?: string,
  fieldChanged?: string,
  oldValue?: string,
  newValue?: string
) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'User not authenticated' };
    }

    // Get project loan ID if project ID provided
    let projectLoanId = null;
    if (projectId) {
      const { data: project } = await supabase
        .from('projects')
        .select('loan_id')
        .eq('id', projectId)
        .single();
      projectLoanId = project?.loan_id;
    }

    // Log to audit trail
    const { error } = await supabase.from('audit_logs').insert({
      user_id: user.id,
      user_email: user.email,
      action,
      entity_type: entityType,
      entity_id: entityId,
      project_id: projectId,
      project_loan_id: projectLoanId,
      field_changed: fieldChanged,
      old_value: oldValue,
      new_value: newValue,
    });

    if (error) {
      console.error('Error creating audit log entry:', error);
      return { error: 'Failed to create audit log' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating audit log entry:', error);
    return { error: 'An unexpected error occurred' };
  }
}

