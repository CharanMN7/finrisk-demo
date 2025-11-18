'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExportButton } from '@/components/infracomply/export-button';
import { Badge } from '@/components/ui/badge';
import { generateCRILCReport, exportCRILCExcel, logCRILCReportGeneration, type CRILCReportEntry } from '@/app/actions/reports';
import { getCurrentWeekRange } from '@/lib/date-utils';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';

export default function ReportsPage() {
  const [reportData, setReportData] = useState<CRILCReportEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [generationTime, setGenerationTime] = useState<number | null>(null);
  
  const currentWeek = getCurrentWeekRange();
  const [startDate, setStartDate] = useState(currentWeek.startDate);
  const [endDate, setEndDate] = useState(currentWeek.endDate);

  useEffect(() => {
    // Auto-generate report for current week on load
    handleGenerate();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    const startTime = Date.now();
    
    const result = await generateCRILCReport(startDate, endDate);
    
    const endTime = Date.now();
    setGenerationTime((endTime - startTime) / 1000);
    
    if (result.error) {
      toast.error(result.error);
    } else if (result.data) {
      setReportData(result.data);
      toast.success(`Report generated successfully with ${result.count} entries`);
    }
    
    setLoading(false);
  };

  const handleExport = async () => {
    const result = await exportCRILCExcel(startDate, endDate);
    
    if (result.error || !result.data) {
      toast.error(result.error || 'Failed to export report');
      return;
    }
    
    // Log the export
    await logCRILCReportGeneration(startDate, endDate);
    
    return result.data;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CRILC Report Generator</h1>
          <p className="text-muted-foreground">
            Generate weekly Credit Event registers for RBI compliance
          </p>
        </div>
      </div>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Report Parameters</CardTitle>
          <CardDescription>
            Configure date range for Credit Event Register (weekly submission)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {loading ? 'Generating...' : 'Generate Report'}
                </Button>
              </div>
            </div>

            {generationTime !== null && (
              <div className="text-sm text-muted-foreground">
                Report generated in {generationTime.toFixed(2)} seconds
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Credit Event Register</CardTitle>
              <CardDescription>
                Period: {format(parseISO(startDate), 'MMM dd, yyyy')} to{' '}
                {format(parseISO(endDate), 'MMM dd, yyyy')}
              </CardDescription>
            </div>
            {reportData.length > 0 && (
              <ExportButton onExport={handleExport} label="Download CSV (CRILC Format)" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Generating report...</p>
            </div>
          ) : reportData.length > 0 ? (
            <>
              <div className="mb-4 p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Total Events</div>
                    <div className="text-2xl font-bold">{reportData.length}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Critical Events</div>
                    <div className="text-2xl font-bold text-red-600">
                      {reportData.filter((e) => e.event_type.includes('DCCO') || e.event_type.includes('Overrun')).length}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Total Exposure</div>
                    <div className="text-2xl font-bold">
                      ₹{(reportData.reduce((sum, e) => sum + Number(e.sanction_amount), 0) / 100).toFixed(0)} Cr
                    </div>
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loan ID</TableHead>
                    <TableHead>Borrower</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Event Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Sanction Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{entry.loan_id}</TableCell>
                      <TableCell>{entry.borrower_name}</TableCell>
                      <TableCell>{entry.sector}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{entry.event_type}</Badge>
                      </TableCell>
                      <TableCell>{entry.event_date}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            entry.status === 'Open'
                              ? 'destructive'
                              : entry.status === 'Acknowledged'
                              ? 'secondary'
                              : 'default'
                          }
                        >
                          {entry.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{(Number(entry.sanction_amount) / 100).toFixed(0)} Cr
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No credit events found for the selected date range
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your date range or generate a report for a different period
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* RBI Compliance Info */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100">
            RBI Reporting Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
          <p>
            • <strong>Weekly Submission:</strong> Credit Event registers must be submitted to CRILC every week
          </p>
          <p>
            • <strong>Format Requirements:</strong> Must include loan ID, borrower details, event type, date, status, and resolution plan
          </p>
          <p>
            • <strong>Completeness:</strong> All material credit events must be reported within 15 days of occurrence
          </p>
          <p>
            • <strong>Audit Trail:</strong> Maintain complete documentation for 5-year regulatory retention period
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

