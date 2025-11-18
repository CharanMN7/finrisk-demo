import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getProjectById } from '@/app/actions/projects';
import { RiskBadge } from '@/components/infracomply/risk-badge';
import { AlertBadge, StatusBadge } from '@/components/infracomply/alert-badge';
import { GanttChart } from '@/components/infracomply/gantt-chart';
import { WaterfallChart } from '@/components/infracomply/waterfall-chart';
import { format, differenceInDays, parseISO } from 'date-fns';
import { FileText, Download } from 'lucide-react';
import Link from 'next/link';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { data: project, error } = await getProjectById(id);

  if (error || !project) {
    notFound();
  }

  const dccoPlanned = parseISO(project.dcco_planned);
  const dccoActual = project.dcco_actual ? parseISO(project.dcco_actual) : null;
  const dccoDelay = dccoActual ? differenceInDays(dccoActual, dccoPlanned) : project.dcco_status;

  const financials = project.financials && project.financials.length > 0 ? project.financials[0] : null;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        <Link href="/projects" className="hover:text-foreground">Projects</Link>
        {' / '}
        <span className="text-foreground">{project.loan_id}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{project.borrower_name}</h1>
          <p className="text-muted-foreground mt-1">
            {project.loan_id} • {project.sector}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Summary
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Risk Score</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskBadge
              riskScore={project.risk_score}
              riskTier={project.risk_tier}
              showScore={true}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Sanction Amount</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{(Number(project.sanction_amount) / 100).toFixed(0)} Cr
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Disbursed: ₹{(Number(project.disbursed_amount) / 100).toFixed(0)} Cr
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>DCCO Status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dccoActual ? (
                <span className={dccoDelay > 0 ? 'text-red-600' : 'text-green-600'}>
                  {dccoDelay > 0 ? '+' : ''}{dccoDelay} days
                </span>
              ) : project.dcco_status > 0 ? (
                <span className="text-red-600">+{project.dcco_status} days</span>
              ) : (
                <span className="text-muted-foreground">On track</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Planned: {format(dccoPlanned, 'MMM dd, yyyy')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Status</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-lg">
              {project.status}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="alerts">
            Alerts
            {project.alerts && project.alerts.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {project.alerts.filter((a) => a.status === 'Open').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="documents">
            Documents
            {project.documents && (
              <Badge variant="secondary" className="ml-2">
                {project.documents.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <GanttChart milestones={project.milestones || []} />
        </TabsContent>

        {/* Financials Tab */}
        <TabsContent value="financials" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <WaterfallChart
              sanctionAmount={Number(project.sanction_amount) / 100}
              actualCost={Number(project.actual_cost || project.disbursed_amount) / 100}
            />
            
            {financials && (
              <Card>
                <CardHeader>
                  <CardTitle>Financial Metrics</CardTitle>
                  <CardDescription>Current financial position</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Burn Rate</div>
                    <div className="text-2xl font-bold">
                      ₹{(Number(financials.burn_rate) / 100).toFixed(2)} Cr/month
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Cash Buffer</div>
                    <div className="text-2xl font-bold">
                      {financials.cash_buffer_months} months
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Cost Overrun</div>
                    <div className="text-2xl font-bold">
                      {Number(financials.cost_overrun_percentage).toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Provision Required</div>
                    <div className="text-2xl font-bold">
                      ₹{(Number(financials.provision_required) / 100).toFixed(2)} Cr
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Alerts</CardTitle>
              <CardDescription>Credit events and risk notifications</CardDescription>
            </CardHeader>
            <CardContent>
              {project.alerts && project.alerts.length > 0 ? (
                <div className="space-y-4">
                  {project.alerts.map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <AlertBadge severity={alert.severity} />
                            <StatusBadge status={alert.status} />
                          </div>
                          <h4 className="font-semibold">{alert.alert_type}</h4>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                          {alert.resolution_plan && (
                            <div className="mt-2 p-2 bg-muted rounded text-sm">
                              <strong>Resolution Plan:</strong> {alert.resolution_plan}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(parseISO(alert.created_at), 'MMM dd, yyyy')}
                        </div>
                      </div>
                      {alert.acknowledged_at && (
                        <div className="text-xs text-muted-foreground border-t pt-2">
                          Acknowledged on {format(parseISO(alert.acknowledged_at), 'MMM dd, yyyy')}
                          {alert.acknowledged_note && ` • ${alert.acknowledged_note}`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No alerts for this project</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Documents</CardTitle>
              <CardDescription>Uploaded files and reports</CardDescription>
            </CardHeader>
            <CardContent>
              {project.documents && project.documents.length > 0 ? (
                <div className="space-y-2">
                  {project.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.file_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(doc.file_size / 1024 / 1024).toFixed(2)} MB • 
                            Uploaded {format(parseISO(doc.uploaded_at), 'MMM dd, yyyy')}
                            {doc.document_type && ` • ${doc.document_type}`}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No documents uploaded</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

