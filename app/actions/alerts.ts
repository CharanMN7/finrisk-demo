'use server';

import { createClient } from '@/utils/supabase/server';

export type Alert = {
  id: string;
  project_id: string;
  alert_type: 'DCCO Deferment' | 'Cost Overrun' | 'Milestone Delay' | 'Document Expiry' | 'Other';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Acknowledged' | 'Resolved' | 'Dismissed';
  description: string;
  resolution_plan: string | null;
  created_at: string;
  acknowledged_at: string | null;
  acknowledged_by: string | null;
  acknowledged_note: string | null;
  resolved_at: string | null;
};

export type AlertWithProject = Alert & {
  projects: {
    loan_id: string;
    borrower_name: string;
    sector: string;
  };
};

export type AlertFilters = {
  severity?: string[];
  status?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
  project_id?: string;
};

/**
 * Get all alerts with optional filters
 */
export async function getAlerts(filters?: AlertFilters, page: number = 1, limit: number = 50) {
  try {
    const supabase = await createClient();
    
    let query = supabase
      .from('alerts')
      .select('*, projects(loan_id, borrower_name, sector)', { count: 'exact' });

    // Apply filters
    if (filters?.severity && filters.severity.length > 0) {
      query = query.in('severity', filters.severity);
    }

    if (filters?.status && filters.status.length > 0) {
      query = query.in('status', filters.status);
    }

    if (filters?.dateRange) {
      query = query
        .gte('created_at', filters.dateRange.from)
        .lte('created_at', filters.dateRange.to);
    }

    if (filters?.project_id) {
      query = query.eq('project_id', filters.project_id);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching alerts:', error);
      return { error: 'Failed to fetch alerts', data: null, count: 0 };
    }

    return { data, count: count || 0, error: null };
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return { error: 'An unexpected error occurred', data: null, count: 0 };
  }
}

/**
 * Get alert counts by status
 */
export async function getAlertCounts() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('alerts')
      .select('status');

    if (error) {
      console.error('Error fetching alert counts:', error);
      return { error: 'Failed to fetch alert counts', data: null };
    }

    const counts = data.reduce((acc: Record<string, number>, alert) => {
      acc[alert.status] = (acc[alert.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      data: {
        open: counts.Open || 0,
        acknowledged: counts.Acknowledged || 0,
        resolved: counts.Resolved || 0,
        dismissed: counts.Dismissed || 0,
        total: data.length,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error fetching alert counts:', error);
    return { error: 'An unexpected error occurred', data: null };
  }
}

/**
 * Acknowledge an alert
 */
export async function acknowledgeAlert(alertId: string, note?: string) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'User not authenticated' };
    }

    // Get alert details before update for audit log
    const { data: oldAlert } = await supabase
      .from('alerts')
      .select('*, projects(loan_id)')
      .eq('id', alertId)
      .single();

    // Update alert
    const { data, error } = await supabase
      .from('alerts')
      .update({
        status: 'Acknowledged',
        acknowledged_at: new Date().toISOString(),
        acknowledged_by: user.id,
        acknowledged_note: note || null,
      })
      .eq('id', alertId)
      .select()
      .single();

    if (error) {
      console.error('Error acknowledging alert:', error);
      return { error: 'Failed to acknowledge alert' };
    }

    // Log to audit trail
    if (oldAlert && data) {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        user_email: user.email,
        action: 'Acknowledged Alert',
        project_id: data.project_id,
        project_loan_id: (oldAlert.projects as { loan_id: string })?.loan_id,
        entity_type: 'alert',
        entity_id: alertId,
        field_changed: 'status',
        old_value: 'Open',
        new_value: 'Acknowledged',
      });
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error acknowledging alert:', error);
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Dismiss an alert
 */
export async function dismissAlert(alertId: string, note?: string) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'User not authenticated' };
    }

    // Get alert details before update for audit log
    const { data: oldAlert } = await supabase
      .from('alerts')
      .select('*, projects(loan_id)')
      .eq('id', alertId)
      .single();

    // Update alert
    const { data, error } = await supabase
      .from('alerts')
      .update({
        status: 'Dismissed',
        acknowledged_at: new Date().toISOString(),
        acknowledged_by: user.id,
        acknowledged_note: note || null,
      })
      .eq('id', alertId)
      .select()
      .single();

    if (error) {
      console.error('Error dismissing alert:', error);
      return { error: 'Failed to dismiss alert' };
    }

    // Log to audit trail
    if (oldAlert && data) {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        user_email: user.email,
        action: 'Dismissed Alert',
        project_id: data.project_id,
        project_loan_id: (oldAlert.projects as { loan_id: string })?.loan_id,
        entity_type: 'alert',
        entity_id: alertId,
        field_changed: 'status',
        old_value: oldAlert.status,
        new_value: 'Dismissed',
      });
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error dismissing alert:', error);
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Resolve an alert
 */
export async function resolveAlert(alertId: string, resolutionNote?: string) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'User not authenticated' };
    }

    // Get alert details before update for audit log
    const { data: oldAlert } = await supabase
      .from('alerts')
      .select('*, projects(loan_id)')
      .eq('id', alertId)
      .single();

    // Update alert
    const { data, error } = await supabase
      .from('alerts')
      .update({
        status: 'Resolved',
        resolved_at: new Date().toISOString(),
        resolution_plan: resolutionNote || null,
      })
      .eq('id', alertId)
      .select()
      .single();

    if (error) {
      console.error('Error resolving alert:', error);
      return { error: 'Failed to resolve alert' };
    }

    // Log to audit trail
    if (oldAlert && data) {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        user_email: user.email,
        action: 'Resolved Alert',
        project_id: data.project_id,
        project_loan_id: (oldAlert.projects as { loan_id: string })?.loan_id,
        entity_type: 'alert',
        entity_id: alertId,
        field_changed: 'status',
        old_value: oldAlert.status,
        new_value: 'Resolved',
      });
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error resolving alert:', error);
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Create a new alert
 */
export async function createAlert(
  projectId: string,
  alertType: Alert['alert_type'],
  severity: Alert['severity'],
  description: string,
  resolutionPlan?: string
) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'User not authenticated' };
    }

    // Get project details for audit log
    const { data: project } = await supabase
      .from('projects')
      .select('loan_id')
      .eq('id', projectId)
      .single();

    // Create alert
    const { data, error } = await supabase
      .from('alerts')
      .insert({
        project_id: projectId,
        alert_type: alertType,
        severity,
        description,
        resolution_plan: resolutionPlan || null,
        status: 'Open',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating alert:', error);
      return { error: 'Failed to create alert' };
    }

    // Log to audit trail
    if (project && data) {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        user_email: user.email,
        action: 'Created Alert',
        project_id: projectId,
        project_loan_id: project.loan_id,
        entity_type: 'alert',
        entity_id: data.id,
        field_changed: 'alert_type',
        old_value: null,
        new_value: alertType,
      });
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error creating alert:', error);
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Auto-generate alerts for projects based on thresholds
 * This should be run periodically (e.g., nightly)
 */
export async function autoGenerateAlerts() {
  try {
    const supabase = await createClient();
    
    // Get all active projects
    const { data: projects, error } = await supabase
      .from('projects')
      .select('id, loan_id, borrower_name, dcco_status, sanction_amount, actual_cost')
      .eq('status', 'Active');

    if (error || !projects) {
      console.error('Error fetching projects for alert generation:', error);
      return { error: 'Failed to fetch projects', data: null };
    }

    const newAlerts: Array<{
      project_id: string;
      alert_type: string;
      severity: string;
      description: string;
      status: string;
    }> = [];

    for (const project of projects) {
      // Check for DCCO deferment > 90 days
      if (project.dcco_status > 90) {
        // Check if alert already exists
        const { data: existingAlert } = await supabase
          .from('alerts')
          .select('id')
          .eq('project_id', project.id)
          .eq('alert_type', 'DCCO Deferment')
          .in('status', ['Open', 'Acknowledged'])
          .single();

        if (!existingAlert) {
          newAlerts.push({
            project_id: project.id,
            alert_type: 'DCCO Deferment',
            severity: project.dcco_status > 150 ? 'Critical' : 'High',
            description: `DCCO deferred ${project.dcco_status} days (breach threshold: 90 days)`,
            status: 'Open',
          });
        }
      }

      // Check for cost overrun > 10%
      if (project.actual_cost && project.actual_cost > project.sanction_amount * 1.1) {
        const overrunPercentage = ((project.actual_cost - project.sanction_amount) / project.sanction_amount * 100).toFixed(2);
        
        const { data: existingAlert } = await supabase
          .from('alerts')
          .select('id')
          .eq('project_id', project.id)
          .eq('alert_type', 'Cost Overrun')
          .in('status', ['Open', 'Acknowledged'])
          .single();

        if (!existingAlert) {
          newAlerts.push({
            project_id: project.id,
            alert_type: 'Cost Overrun',
            severity: Number(overrunPercentage) > 15 ? 'Critical' : 'High',
            description: `Cost overrun ${overrunPercentage}% (breach threshold: 10%)`,
            status: 'Open',
          });
        }
      }
    }

    // Insert new alerts
    if (newAlerts.length > 0) {
      const { error: insertError } = await supabase
        .from('alerts')
        .insert(newAlerts);

      if (insertError) {
        console.error('Error inserting auto-generated alerts:', insertError);
        return { error: 'Failed to create alerts', data: null };
      }
    }

    return { data: { created: newAlerts.length }, error: null };
  } catch (error) {
    console.error('Error auto-generating alerts:', error);
    return { error: 'An unexpected error occurred', data: null };
  }
}

