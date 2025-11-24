'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FilterSidebar } from '@/components/infracomply/filter-sidebar';
import { RiskBadge } from '@/components/infracomply/risk-badge';
import { SectorIcon } from '@/components/infracomply/sector-icon';
import { getProjects } from '@/app/actions/projects';
import { Search, ChevronLeft, ChevronRight, Upload, Plus } from 'lucide-react';
import { type Project } from '@/app/actions/projects';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    sector: [],
    risk_tier: [],
    status: [],
  });
  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  const limit = 10;

  useEffect(() => {
    loadProjects();
  }, [page, search, selectedFilters]);

  const loadProjects = async () => {
    setLoading(true);
    const result = await getProjects(
      {
        sector: selectedFilters.sector,
        risk_tier: selectedFilters.risk_tier,
        status: selectedFilters.status,
        search: search || undefined,
      },
      page,
      limit
    );

    if (result.data) {
      setProjects(result.data);
      setTotalCount(result.count);
    }
    setLoading(false);
  };

  const filterGroups = [
    {
      id: 'sector',
      label: 'Sector',
      options: [
        { value: 'Highway', label: 'Highway' },
        { value: 'Power', label: 'Power' },
        { value: 'Residential', label: 'Residential' },
        { value: 'CRE', label: 'CRE' },
        { value: 'Other', label: 'Other' },
      ],
    },
    {
      id: 'risk_tier',
      label: 'Risk Tier',
      options: [
        { value: 'Red', label: 'Red (High Risk)' },
        { value: 'Yellow', label: 'Yellow (Medium Risk)' },
        { value: 'Green', label: 'Green (Low Risk)' },
      ],
    },
    {
      id: 'status',
      label: 'Status',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Completed', label: 'Completed' },
        { value: 'NPA', label: 'NPA' },
        { value: 'Closed', label: 'Closed' },
      ],
    },
  ];

  const handleFilterChange = (groupId: string, values: string[]) => {
    setSelectedFilters((prev) => ({ ...prev, [groupId]: values }));
    setPage(1); // Reset to first page when filters change
  };

  const handleClearAll = () => {
    setSelectedFilters({
      sector: [],
      risk_tier: [],
      status: [],
    });
    setSearch('');
    setPage(1);
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage and monitor your infrastructure and CRE project portfolio
          </p>
        </div>
        <Dialog open={createProjectOpen} onOpenChange={setCreateProjectOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Upload project data in bulk or enter project details manually
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Placeholder Bulk Upload Component */}
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Bulk Upload Projects</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Upload a CSV or Excel file with your project data to quickly import multiple projects at once.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" disabled>
                      <Upload className="mr-2 h-4 w-4" />
                      Choose File
                    </Button>
                    <Button variant="outline" disabled>
                      Download Template
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: CSV, XLSX (Max 10MB)
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>
              <div className="flex justify-center">
                <Button variant="outline" disabled className="w-full">
                  Enter Project Details Manually
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <div className="w-64 flex-shrink-0">
          <FilterSidebar
            filterGroups={filterGroups}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
          />
        </div>

        {/* Projects Table */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Projects</CardTitle>
                  <CardDescription>
                    {totalCount} projects found
                  </CardDescription>
                </div>
                <div className="w-72">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by borrower or loan ID..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading projects...</p>
                </div>
              ) : projects.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Loan ID</TableHead>
                        <TableHead>Borrower</TableHead>
                        <TableHead>Sector</TableHead>
                        <TableHead className="text-right">Sanction Amount</TableHead>
                        <TableHead>Risk Score</TableHead>
                        <TableHead>DCCO Status</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.map((project) => (
                        <TableRow
                          key={project.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => router.push(`/projects/${project.id}`)}
                        >
                          <TableCell className="font-medium">{project.loan_id}</TableCell>
                          <TableCell>{project.borrower_name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <SectorIcon sector={project.sector} size={16} />
                              <span>{project.sector}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{(Number(project.sanction_amount) / 100).toFixed(0)} Cr
                          </TableCell>
                          <TableCell>
                            <RiskBadge
                              riskScore={project.risk_score}
                              riskTier={project.risk_tier}
                              showScore={false}
                            />
                          </TableCell>
                          <TableCell>
                            {project.dcco_status > 0 ? (
                              <span className="text-red-600 dark:text-red-400">
                                +{project.dcco_status} days
                              </span>
                            ) : project.dcco_status < 0 ? (
                              <span className="text-green-600 dark:text-green-400">
                                {project.dcco_status} days
                              </span>
                            ) : (
                              <span className="text-muted-foreground">On time</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{project.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalCount)} of {totalCount} projects
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No projects found matching your criteria
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

