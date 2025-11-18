import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getRiskDistribution, getTopRiskProjects, getCreditEventsTimeline, getPortfolioExposure } from '@/app/actions/projects';
import { RiskDistributionChart } from '@/components/infracomply/risk-distribution-chart';
import { CreditEventsChart } from '@/components/infracomply/credit-events-chart';
import { RiskBadge } from '@/components/infracomply/risk-badge';
import { SectorIcon } from '@/components/infracomply/sector-icon';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default async function DashboardPage() {
  const [
    riskDistribution,
    topRiskProjects,
    creditEventsTimeline,
    portfolioExposure,
  ] = await Promise.all([
    getRiskDistribution(),
    getTopRiskProjects(5),
    getCreditEventsTimeline(),
    getPortfolioExposure(),
  ]);

  const riskData = riskDistribution.data || [];
  const topProjects = topRiskProjects.data || [];
  const timelineData = creditEventsTimeline.data || [];
  const exposure = portfolioExposure.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Portfolio Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your infrastructure and CRE portfolio risk profile
        </p>
      </div>

      {/* Risk Distribution & Exposure Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Risk Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Portfolio breakdown by risk tier</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskDistributionChart data={riskData} />
          </CardContent>
        </Card>

        {/* Total Exposure Card */}
        <Card>
          <CardHeader>
            <CardTitle>Total Portfolio Exposure</CardTitle>
            <CardDescription>Active project financing across sectors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="text-4xl font-bold">
                  ₹{exposure ? (exposure.totalExposure / 100).toFixed(0) : 0} Cr
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Across {exposure?.totalProjects || 0} active projects
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Sector Breakdown</h4>
                {exposure && Object.entries(exposure.sectorBreakdown).map(([sector, amount]: [string, number]) => {
                  const percentage = ((amount / exposure.totalExposure) * 100).toFixed(1);
                  return (
                    <div key={sector} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <SectorIcon sector={sector as 'Highway' | 'Power' | 'Residential' | 'CRE' | 'Other'} size={16} />
                          <span>{sector}</span>
                        </div>
                        <span className="font-medium">₹{(amount / 100).toFixed(0)}Cr ({percentage}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top At-Risk Projects */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Top 5 At-Risk Projects</CardTitle>
              <CardDescription>Highest risk scores requiring immediate attention</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/projects">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProjects.length > 0 ? (
              topProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <SectorIcon sector={project.sector} size={24} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{project.borrower_name}</h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {project.loan_id} • {project.sector}
                      </p>
                    </div>
                    <div className="text-right">
                      <RiskBadge riskScore={project.risk_score} riskTier={project.risk_tier} />
                      <p className="text-sm text-muted-foreground mt-1">
                        ₹{(Number(project.sanction_amount) / 100).toFixed(0)}Cr
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 text-sm text-muted-foreground max-w-xs">
                    {project.key_issue}
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No at-risk projects found</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Credit Events Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Events (Last 30 Days)</CardTitle>
          <CardDescription>Trend of newly detected credit events over time</CardDescription>
        </CardHeader>
        <CardContent>
          <CreditEventsChart data={timelineData} />
        </CardContent>
      </Card>
    </div>
  );
}
