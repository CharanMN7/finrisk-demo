'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertBadge, StatusBadge } from '@/components/infracomply/alert-badge';
import { FilterSidebar } from '@/components/infracomply/filter-sidebar';
import { getAlerts, getAlertCounts, acknowledgeAlert, type AlertWithProject } from '@/app/actions/alerts';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import Link from 'next/link';

type AlertCounts = {
  open: number;
  acknowledged: number;
  resolved: number;
  dismissed: number;
  total: number;
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertWithProject[]>([]);
  const [alertCounts, setAlertCounts] = useState<AlertCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedAlert, setSelectedAlert] = useState<AlertWithProject | null>(null);
  const [acknowledgeNote, setAcknowledgeNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    severity: [],
    status: [],
  });
  
  const limit = 20;

  useEffect(() => {
    loadData();
  }, [page, selectedFilters]);

  const loadData = async () => {
    setLoading(true);
    
    const [alertsResult, countsResult] = await Promise.all([
      getAlerts(
        {
          severity: selectedFilters.severity,
          status: selectedFilters.status,
        },
        page,
        limit
      ),
      getAlertCounts(),
    ]);
    
    if (alertsResult.data) {
      setAlerts(alertsResult.data);
      setTotalCount(alertsResult.count);
    }
    
    if (countsResult.data) {
      setAlertCounts(countsResult.data);
    }
    
    setLoading(false);
  };

  const handleAcknowledge = async () => {
    if (!selectedAlert) return;
    
    setIsSubmitting(true);
    const result = await acknowledgeAlert(selectedAlert.id, acknowledgeNote);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Alert acknowledged successfully');
      setSelectedAlert(null);
      setAcknowledgeNote('');
      loadData();
    }
    
    setIsSubmitting(false);
  };

  const filterGroups = [
    {
      id: 'severity',
      label: 'Severity',
      options: [
        { value: 'Critical', label: 'Critical' },
        { value: 'High', label: 'High' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Low', label: 'Low' },
      ],
    },
    {
      id: 'status',
      label: 'Status',
      options: [
        { value: 'Open', label: 'Open', count: alertCounts?.open },
        { value: 'Acknowledged', label: 'Acknowledged', count: alertCounts?.acknowledged },
        { value: 'Resolved', label: 'Resolved', count: alertCounts?.resolved },
        { value: 'Dismissed', label: 'Dismissed', count: alertCounts?.dismissed },
      ],
    },
  ];

  const handleFilterChange = (groupId: string, values: string[]) => {
    setSelectedFilters((prev) => ({ ...prev, [groupId]: values }));
    setPage(1);
  };

  const handleClearAll = () => {
    setSelectedFilters({
      severity: [],
      status: [],
    });
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Alerts Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage credit events and risk notifications
        </p>
      </div>

      {/* Alert Counts Summary */}
      {alertCounts && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Open</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{alertCounts.open}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Acknowledged</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{alertCounts.acknowledged}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Resolved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{alertCounts.resolved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{alertCounts.total}</div>
            </CardContent>
          </Card>
        </div>
      )}

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

        {/* Alerts Table */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>All Alerts</CardTitle>
              <CardDescription>
                {totalCount} alerts found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading alerts...</p>
                </div>
              ) : alerts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Alert Type</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>
                          <Link
                            href={`/projects/${alert.project_id}`}
                            className="hover:underline"
                          >
                            <div className="font-medium">{alert.projects.borrower_name}</div>
                            <div className="text-sm text-muted-foreground">
                              {alert.projects.loan_id}
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div>{alert.alert_type}</div>
                          <div className="text-sm text-muted-foreground">{alert.description}</div>
                        </TableCell>
                        <TableCell>
                          <AlertBadge severity={alert.severity} />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={alert.status} />
                        </TableCell>
                        <TableCell>
                          {format(parseISO(alert.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          {alert.status === 'Open' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedAlert(alert)}
                            >
                              Acknowledge
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No alerts found matching your criteria
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Acknowledge Alert Dialog */}
      <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Acknowledge Alert</DialogTitle>
            <DialogDescription>
              Add a note about this alert and change its status to Acknowledged
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedAlert && (
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertBadge severity={selectedAlert.severity} />
                  <span className="font-semibold">{selectedAlert.alert_type}</span>
                </div>
                <p className="text-sm text-muted-foreground">{selectedAlert.description}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="note">Review Note (Optional)</Label>
              <Textarea
                id="note"
                placeholder="Add any notes or comments about this alert..."
                value={acknowledgeNote}
                onChange={(e) => setAcknowledgeNote(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAlert(null)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAcknowledge} disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Acknowledge Alert'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

