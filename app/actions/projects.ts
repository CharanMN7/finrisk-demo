'use server';

import { createClient } from '@/utils/supabase/server';

export type Project = {
  id: string;
  loan_id: string;
  borrower_name: string;
  sector: 'Highway' | 'Power' | 'Residential' | 'CRE' | 'Other';
  sanction_amount: number;
  disbursed_amount: number;
  actual_cost: number | null;
  dcco_planned: string;
  dcco_actual: string | null;
  dcco_status: number;
  status: 'Active' | 'Completed' | 'NPA' | 'Closed';
  risk_score: number;
  risk_tier: 'Green' | 'Yellow' | 'Red';
  created_at: string;
  updated_at: string;
};

type Alert = {
  id: string;
  alert_type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Acknowledged' | 'Resolved' | 'Dismissed';
  description: string;
  created_at: string;
  acknowledged_at: string | null;
  acknowledged_note: string | null;
  resolution_plan: string | null;
};

type Milestone = {
  id: string;
  name: string;
  planned_date: string;
  actual_date: string | null;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delayed';
  delay_days: number;
};

type Financial = {
  id: string;
  burn_rate: number;
  cash_buffer_months: number;
  cost_overrun_percentage: number;
  provision_required: number;
  recorded_at: string;
};

type Document = {
  id: string;
  file_name: string;
  file_size: number;
  uploaded_at: string;
  document_type: string | null;
};

export type ProjectWithRelations = Project & {
  alerts?: Alert[];
  milestones?: Milestone[];
  financials?: Financial[];
  documents?: Document[];
};

export type ProjectFilters = {
  sector?: string[];
  risk_tier?: string[];
  status?: string[];
  search?: string;
};

/**
 * Get all projects with optional filters
 */
export async function getProjects(filters?: ProjectFilters, page: number = 1, limit: number = 10) {
  try {
    const supabase = await createClient();
    
    let query = supabase
      .from('projects')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters?.sector && filters.sector.length > 0) {
      query = query.in('sector', filters.sector);
    }

    if (filters?.risk_tier && filters.risk_tier.length > 0) {
      query = query.in('risk_tier', filters.risk_tier);
    }

    if (filters?.status && filters.status.length > 0) {
      query = query.in('status', filters.status);
    }

    if (filters?.search) {
      query = query.or(`borrower_name.ilike.%${filters.search}%,loan_id.ilike.%${filters.search}%`);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order('risk_score', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching projects:', error);
      return { error: 'Failed to fetch projects', data: null, count: 0 };
    }

    return { data, count: count || 0, error: null };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { error: 'An unexpected error occurred', data: null, count: 0 };
  }
}

/**
 * Get all projects without pagination (for dropdowns, exports, etc.)
 */
export async function getAllProjects() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('borrower_name', { ascending: true });

    if (error) {
      console.error('Error fetching all projects:', error);
      return { error: 'Failed to fetch projects', data: null };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching all projects:', error);
    return { error: 'An unexpected error occurred', data: null };
  }
}

/**
 * Get a single project by ID with all relations
 */
export async function getProjectById(id: string): Promise<{ data: ProjectWithRelations | null; error: string | null }> {
  try {
    const supabase = await createClient();
    
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (projectError || !project) {
      console.error('Error fetching project:', projectError);
      return { error: 'Project not found', data: null };
    }

    // Fetch related data
    const [alertsRes, milestonesRes, financialsRes, documentsRes] = await Promise.all([
      supabase.from('alerts').select('*').eq('project_id', id).order('created_at', { ascending: false }),
      supabase.from('milestones').select('*').eq('project_id', id).order('planned_date', { ascending: true }),
      supabase.from('financials').select('*').eq('project_id', id).order('recorded_at', { ascending: false }).limit(1),
      supabase.from('documents').select('*').eq('project_id', id).order('uploaded_at', { ascending: false }),
    ]);

    const projectWithRelations: ProjectWithRelations = {
      ...project,
      alerts: alertsRes.data || [],
      milestones: milestonesRes.data || [],
      financials: financialsRes.data || [],
      documents: documentsRes.data || [],
    };

    return { data: projectWithRelations, error: null };
  } catch (error) {
    console.error('Error fetching project:', error);
    return { error: 'An unexpected error occurred', data: null };
  }
}

/**
 * Update a project and log the changes
 */
export async function updateProject(id: string, updates: Partial<Project>) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'User not authenticated' };
    }

    // Get old project data for audit log
    const { data: oldProject } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    // Update project
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      return { error: 'Failed to update project' };
    }

    // Log changes to audit_logs
    if (oldProject && data) {
      const changes: Array<{
        user_id: string;
        user_email: string | undefined;
        action: string;
        project_id: string;
        project_loan_id: string;
        entity_type: string;
        entity_id: string;
        field_changed: string;
        old_value: string;
        new_value: string;
      }> = [];
      Object.keys(updates).forEach((key) => {
        const oldValue = (oldProject as Record<string, unknown>)[key];
        const newValue = (data as Record<string, unknown>)[key];
        if (oldValue !== newValue) {
          changes.push({
            user_id: user.id,
            user_email: user.email,
            action: 'Updated Project',
            project_id: id,
            project_loan_id: data.loan_id,
            entity_type: 'project',
            entity_id: id,
            field_changed: key,
            old_value: String(oldValue),
            new_value: String(newValue),
          });
        }
      });

      if (changes.length > 0) {
        await supabase.from('audit_logs').insert(changes);
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating project:', error);
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Get risk distribution across portfolio
 */
export async function getRiskDistribution() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('projects')
      .select('risk_tier, sanction_amount')
      .eq('status', 'Active');

    if (error) {
      console.error('Error fetching risk distribution:', error);
      return { error: 'Failed to fetch risk distribution', data: null };
    }

    // Aggregate by risk tier
    const distribution = data.reduce((acc: Record<string, { count: number; exposure: number }>, project) => {
      const tier = project.risk_tier;
      if (!acc[tier]) {
        acc[tier] = { count: 0, exposure: 0 };
      }
      acc[tier].count += 1;
      acc[tier].exposure += Number(project.sanction_amount);
      return acc;
    }, {});

    // Format for pie chart
    const chartData = [
      { name: 'Green', value: distribution.Green?.count || 0, exposure: distribution.Green?.exposure || 0, fill: '#10B981' },
      { name: 'Yellow', value: distribution.Yellow?.count || 0, exposure: distribution.Yellow?.exposure || 0, fill: '#F59E0B' },
      { name: 'Red', value: distribution.Red?.count || 0, exposure: distribution.Red?.exposure || 0, fill: '#DC2626' },
    ];

    return { data: chartData, error: null };
  } catch (error) {
    console.error('Error fetching risk distribution:', error);
    return { error: 'An unexpected error occurred', data: null };
  }
}

/**
 * Get top at-risk projects
 */
export async function getTopRiskProjects(limit: number = 5) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('projects')
      .select('*, alerts(id, severity, status)')
      .eq('status', 'Active')
      .order('risk_score', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching top risk projects:', error);
      return { error: 'Failed to fetch projects', data: null };
    }

    // Add key issue for each project
    const projectsWithIssues = data.map((project) => {
      let keyIssue = '';
      if (project.dcco_status > 90) {
        keyIssue = `DCCO deferred ${project.dcco_status} days`;
      }
      if (project.actual_cost && project.actual_cost > project.sanction_amount * 1.1) {
        const overrun = ((project.actual_cost - project.sanction_amount) / project.sanction_amount * 100).toFixed(1);
        keyIssue += (keyIssue ? ', ' : '') + `Cost overrun ${overrun}%`;
      }
      if (!keyIssue) {
        keyIssue = 'Multiple risk factors';
      }
      return { ...project, key_issue: keyIssue };
    });

    return { data: projectsWithIssues, error: null };
  } catch (error) {
    console.error('Error fetching top risk projects:', error);
    return { error: 'An unexpected error occurred', data: null };
  }
}

/**
 * Get credit events over time (last 30 days)
 */
export async function getCreditEventsTimeline() {
  try {
    const supabase = await createClient();
    
    // Get alerts created in last 30 days, grouped by week
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from('alerts')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching credit events timeline:', error);
      return { error: 'Failed to fetch timeline', data: null };
    }

    // Group by week
    const weeklyData: { [key: string]: number } = {};
    data.forEach((alert) => {
      const date = new Date(alert.created_at);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split('T')[0];
      weeklyData[weekKey] = (weeklyData[weekKey] || 0) + 1;
    });

    // Convert to array format for chart
    const chartData = Object.entries(weeklyData)
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return { data: chartData, error: null };
  } catch (error) {
    console.error('Error fetching credit events timeline:', error);
    return { error: 'An unexpected error occurred', data: null };
  }
}

/**
 * Get total portfolio exposure with sector breakdown
 */
export async function getPortfolioExposure() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('projects')
      .select('sector, sanction_amount')
      .eq('status', 'Active');

    if (error) {
      console.error('Error fetching portfolio exposure:', error);
      return { error: 'Failed to fetch exposure', data: null };
    }

    // Calculate totals
    let totalExposure = 0;
    const sectorBreakdown: { [key: string]: number } = {};
    const totalProjects = data.length;

    data.forEach((project) => {
      const amount = Number(project.sanction_amount);
      totalExposure += amount;
      sectorBreakdown[project.sector] = (sectorBreakdown[project.sector] || 0) + amount;
    });

    return {
      data: {
        totalExposure,
        totalProjects,
        sectorBreakdown,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error fetching portfolio exposure:', error);
    return { error: 'An unexpected error occurred', data: null };
  }
}

/**
 * Calculate risk score for a project based on various factors
 */
export async function calculateRiskScore(project: {
  dcco_status: number;
  sanction_amount: number;
  actual_cost: number | null;
  critical_alerts_count?: number;
}): Promise<number> {
  let score = 0;

  // DCCO delay (weighted 40%)
  if (project.dcco_status > 0) {
    const delayScore = Math.min((project.dcco_status / 90) * 40, 40);
    score += delayScore;
  }

  // Cost overrun (weighted 35%)
  if (project.actual_cost && project.actual_cost > project.sanction_amount) {
    const overrunPercentage = ((project.actual_cost - project.sanction_amount) / project.sanction_amount) * 100;
    const overrunScore = Math.min((overrunPercentage / 10) * 35, 35);
    score += overrunScore;
  }

  // Critical alerts (weighted 25%)
  if (project.critical_alerts_count) {
    const alertScore = Math.min(project.critical_alerts_count * 10, 25);
    score += alertScore;
  }

  return Math.min(Math.round(score), 100);
}

