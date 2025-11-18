'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ExportButton } from '@/components/infracomply/export-button';
import { getAllProjects, type Project } from '@/app/actions/projects';
import { getProjectProvision, getPortfolioProvisions, exportProvisionsExcel, logProvisionExport, type ProvisionCalculation } from '@/app/actions/provisions';
import { toast } from 'sonner';

type PortfolioProvisions = {
  calculations: ProvisionCalculation[];
  totalProvision: number;
  sectorBreakdown: Record<string, number>;
  projectCount: number;
};

export default function ProvisionsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [calculation, setCalculation] = useState<ProvisionCalculation | null>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioProvisions | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [projectsResult, portfolioResult] = await Promise.all([
      getAllProjects(),
      getPortfolioProvisions(),
    ]);
    
    if (projectsResult.data) {
      setProjects(projectsResult.data);
    }
    
    if (portfolioResult.data) {
      setPortfolioData(portfolioResult.data);
    }
  };

  const handleProjectSelect = async (projectId: string) => {
    setSelectedProjectId(projectId);
    
    if (projectId) {
      const result = await getProjectProvision(projectId);
      if (result.data) {
        setCalculation(result.data);
      }
    } else {
      setCalculation(null);
    }
  };

  const handleExport = async () => {
    const result = await exportProvisionsExcel();
    
    if (result.error || !result.data) {
      toast.error(result.error || 'Failed to export provisions');
      return;
    }
    
    // Log the export
    await logProvisionExport();
    
    return result.data;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Provision Calculator</h1>
          <p className="text-muted-foreground">
            Calculate RBI-mandated provisions for infrastructure and CRE projects
          </p>
        </div>
        <ExportButton onExport={handleExport} label="Export Portfolio to CSV" />
      </div>

      {/* Project Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Calculate Provision for a Project</CardTitle>
          <CardDescription>Select a project to calculate its required provision</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="project">Select Project</Label>
            <Select value={selectedProjectId} onValueChange={handleProjectSelect}>
              <SelectTrigger id="project">
                <SelectValue placeholder="Choose a project..." />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.loan_id} - {project.borrower_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {calculation && (
            <div className="space-y-6 pt-6 border-t">
              {/* Project Info */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Loan ID</div>
                  <div className="font-semibold">{calculation.loan_id}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Borrower</div>
                  <div className="font-semibold">{calculation.borrower_name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Sector</div>
                  <div className="font-semibold">{calculation.sector}</div>
                </div>
              </div>

              {/* Calculation Breakdown */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Provision Calculation</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Input Parameters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sanction Amount</span>
                        <span className="font-semibold">₹{calculation.sanction_amount.toFixed(2)} Cr</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">DCCO Deferment</span>
                        <span className="font-semibold">{calculation.dcco_deferment_days} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">DCCO Deferment (Quarters)</span>
                        <span className="font-semibold">{calculation.dcco_deferment_quarters} quarters</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Base Provision</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rate</span>
                        <span className="font-semibold">
                          {(calculation.base_provision_rate * 100).toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-semibold text-lg">
                          ₹{calculation.base_provision_amount.toFixed(2)} Cr
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {calculation.sector === 'Highway' || calculation.sector === 'Power' || calculation.sector === 'Other'
                          ? 'Infrastructure: 1.0% base provision'
                          : 'CRE/Residential: 1.25% base provision'}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Additional Provision (Deferment)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rate</span>
                        <span className="font-semibold">
                          {(calculation.additional_provision_rate * 100).toFixed(3)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-semibold text-lg">
                          ₹{calculation.additional_provision_amount.toFixed(2)} Cr
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        0.375% per quarter deferred × {calculation.dcco_deferment_quarters} quarters
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-primary/5 border-primary">
                    <CardHeader>
                      <CardTitle className="text-base">Total Provision Required</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-primary">
                        ₹{calculation.total_provision.toFixed(2)} Cr
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Base + Additional Provision
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Portfolio Summary */}
      {portfolioData && (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Provision Summary</CardTitle>
            <CardDescription>
              Total provisions required across {portfolioData.projectCount} active projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-muted rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground">Total Provision Required</div>
                <div className="text-4xl font-bold">
                  ₹{(portfolioData.totalProvision / 100).toFixed(2)} Cr
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Active Projects</div>
                <div className="text-2xl font-semibold">{portfolioData.projectCount}</div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4">Sector Breakdown</h4>
              <div className="space-y-3">
                {Object.entries(portfolioData.sectorBreakdown).map(([sector, amount]: [string, number]) => {
                  const percentage = ((amount / portfolioData.totalProvision) * 100).toFixed(1);
                  return (
                    <div key={sector} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{sector}</span>
                        <span className="font-medium">
                          ₹{(amount / 100).toFixed(2)} Cr ({percentage}%)
                        </span>
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
      )}
    </div>
  );
}

