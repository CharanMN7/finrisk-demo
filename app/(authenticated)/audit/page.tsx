'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExportButton } from '@/components/infracomply/export-button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getAuditLogs, getAuditActionTypes, exportAuditLogsExcel, logAuditTrailView } from '@/app/actions/audit';
import { getDefaultAuditDateRange } from '@/lib/date-utils';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { type AuditLog } from '@/app/actions/audit';

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [actionTypes, setActionTypes] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  
  const defaultRange = getDefaultAuditDateRange();
  const [startDate, setStartDate] = useState(defaultRange.from.split('T')[0]);
  const [endDate, setEndDate] = useState(defaultRange.to.split('T')[0]);
  const [selectedAction, setSelectedAction] = useState<string>('all');
  
  const limit = 50;

  useEffect(() => {
    loadData();
    // Log this audit trail view
    logAuditTrailView();
  }, []);

  useEffect(() => {
    loadLogs();
  }, [page, startDate, endDate, selectedAction]);

  const loadData = async () => {
    const typesResult = await getAuditActionTypes();
    if (typesResult.data) {
      setActionTypes(typesResult.data);
    }
  };

  const loadLogs = async () => {
    setLoading(true);
    
    const result = await getAuditLogs(
      {
        dateRange: {
          from: new Date(startDate).toISOString(),
          to: new Date(endDate + 'T23:59:59').toISOString(),
        },
        action: selectedAction !== 'all' ? selectedAction : undefined,
      },
      page,
      limit
    );
    
    if (result.data) {
      setLogs(result.data);
      setTotalCount(result.count);
    }
    
    setLoading(false);
  };

  const handleExport = async () => {
    const result = await exportAuditLogsExcel({
      dateRange: {
        from: new Date(startDate).toISOString(),
        to: new Date(endDate + 'T23:59:59').toISOString(),
      },
      action: selectedAction !== 'all' ? selectedAction : undefined,
    });
    
    if (result.error || !result.data) {
      toast.error(result.error || 'Failed to export audit logs');
      return;
    }
    
    return result.data;
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audit Log</h1>
          <p className="text-muted-foreground">
            Complete activity trail for regulatory compliance
          </p>
        </div>
        <ExportButton onExport={handleExport} label="Export Audit Trail (CSV)" />
      </div>

      {/* Compliance Banner */}
      <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <strong>RBI Compliance:</strong> All data changes are automatically logged for 5-year regulatory retention. 
          This audit trail cannot be modified or deleted, ensuring complete transparency for regulatory audits.
        </AlertDescription>
      </Alert>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Audit Logs</CardTitle>
          <CardDescription>Customize the audit trail view</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="action-type">Action Type</Label>
              <Select value={selectedAction} onValueChange={(value) => {
                setSelectedAction(value);
                setPage(1);
              }}>
                <SelectTrigger id="action-type">
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {actionTypes.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={loadLogs} disabled={loading} className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            Showing {logs.length} of {totalCount} audit entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading audit logs...</p>
            </div>
          ) : logs.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Field Changed</TableHead>
                    <TableHead>Old Value</TableHead>
                    <TableHead>New Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">
                        {format(parseISO(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.user_email || 'System'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.action}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.project_loan_id || '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.field_changed || '-'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                        {log.old_value || '-'}
                      </TableCell>
                      <TableCell className="text-sm font-medium max-w-[150px] truncate">
                        {log.new_value || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalCount)} of {totalCount} entries
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
                No audit entries found for the selected filters
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

