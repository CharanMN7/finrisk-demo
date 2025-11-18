'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertCircle,
  Clock,
  FileText,
  Shield,
  Database,
  Bell,
  Calculator,
  FileSpreadsheet,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { CountdownTimer } from '@/components/infracomply/countdown-timer';

export default function LandingPage() {
  const [leadMagnetOpen, setLeadMagnetOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    jobTitle: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleLeadMagnetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, just show success message
    setFormSubmitted(true);
    setTimeout(() => {
      setLeadMagnetOpen(false);
      setFormSubmitted(false);
      setFormData({ name: '', email: '', company: '', jobTitle: '' });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Button
        asChild
        className="absolute top-4 right-4 z-[100]"
        variant="outline"
      >
        <Link href="/login">
          Login
        </Link>
      </Button>
      {/* Hero Section */}
      <section className="relative border-b bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-full text-sm font-medium">
              RBI Deadline: October 1, 2025
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Is Your Project Finance Database Ready?
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Automate Credit Event detection, provision calculations, and CRILC reporting in 90 days.
              Purpose-built for RBI Project Finance Directions 2025.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" asChild className="text-lg px-8">
                <Link href="/login">Schedule Discovery Call</Link>
              </Button>
              <Dialog open={leadMagnetOpen} onOpenChange={setLeadMagnetOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Download RBI Compliance Checklist
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Download Your Free RBI Compliance Checklist</DialogTitle>
                    <DialogDescription>
                      Get the complete 45-point compliance checklist and 90-day implementation roadmap
                    </DialogDescription>
                  </DialogHeader>
                  {!formSubmitted ? (
                    <form onSubmit={handleLeadMagnetSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company Name *</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="jobTitle">Job Title *</Label>
                        <Input
                          id="jobTitle"
                          value={formData.jobTitle}
                          onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">Download Checklist</Button>
                    </form>
                  ) : (
                    <div className="py-8 text-center">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <p className="text-lg font-semibold">Thank you! Check your email.</p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
            <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-2xl p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero.png"
                alt="InfraCOMPLY Dashboard Preview"
                className="rounded-md w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Manual Excel Tracking Puts Your Bank at Risk</h2>
            <p className="text-xl text-center text-muted-foreground mb-12">
              ₹60,000-100,000 crore infrastructure/CRE NPAs across banking system
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
                  <CardTitle>Compliance Gaps</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    70% of lenders lack digital project databases; RBI audit findings inevitable
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Clock className="h-10 w-10 text-orange-500 mb-4" />
                  <CardTitle>Operational Inefficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    20+ hours/week compiling data; 2-3 FTEs cost ₹30-45 lakh annually
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Bell className="h-10 w-10 text-yellow-500 mb-4" />
                  <CardTitle>Late Risk Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Monthly reviews miss deterioration; projects slip to NPA without early warning
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 border-b bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Compliance Automation in 90 Days, Not 12 Months</h2>
            <p className="text-xl text-center text-muted-foreground mb-12">
              Purpose-built for RBI Project Finance Directions 2025
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <Database className="h-10 w-10 text-blue-600 mb-4" />
                  <CardTitle>Digital Project Database</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-muted-foreground">
                    • Bulk CSV upload: 100 projects digitized in minutes
                  </p>
                  <p className="text-muted-foreground">
                    • Structured data capture: Loan details, milestones, covenants, documents centralized
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Bell className="h-10 w-10 text-red-600 mb-4" />
                  <CardTitle>Automated Credit Event Detection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-muted-foreground">
                    • RBI rule-based alerts: DCCO &gt;90 days, cost overrun &gt;10%, milestone delays
                  </p>
                  <p className="text-muted-foreground">
                    • Email notifications: Instant alerts when risks emerge; no more monthly surprises
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Calculator className="h-10 w-10 text-green-600 mb-4" />
                  <CardTitle>Provision Calculator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-muted-foreground">
                    • RBI formula automation: 1% infrastructure, 1.25% CRE + quarterly increments
                  </p>
                  <p className="text-muted-foreground">
                    • One-click exports: Excel for GL teams; eliminate manual calculation errors
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <FileSpreadsheet className="h-10 w-10 text-purple-600 mb-4" />
                  <CardTitle>Audit-Ready Reports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-muted-foreground">
                    • CRILC templates: Weekly Credit Event registers generated in 30 seconds
                  </p>
                  <p className="text-muted-foreground">
                    • Complete audit trail: Every data change logged for 5-year regulatory retention
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Transparent Pricing Aligned to Your Portfolio Size</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Starter</CardTitle>
                  <CardDescription>For smaller portfolios</CardDescription>
                  <div className="text-4xl font-bold mt-4">₹18L/year</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">10-25 projects</p>
                  <p className="text-sm">• Basic compliance</p>
                  <p className="text-sm">• CSV upload only</p>
                  <p className="text-sm">• Standard support</p>
                  <Button className="w-full mt-6" variant="outline">Get Started</Button>
                </CardContent>
              </Card>
              <Card className="border-2 border-primary">
                <CardHeader>
                  <div className="text-xs font-semibold text-primary uppercase mb-2">Most Popular</div>
                  <CardTitle className="text-2xl">Professional</CardTitle>
                  <CardDescription>For growing institutions</CardDescription>
                  <div className="text-4xl font-bold mt-4">₹35L/year</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">25-75 projects</p>
                  <p className="text-sm">• Everything in Starter</p>
                  <p className="text-sm">• Engineer portal</p>
                  <p className="text-sm">• API integration</p>
                  <p className="text-sm">• Priority support</p>
                  <Button className="w-full mt-6">Get Started</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Enterprise</CardTitle>
                  <CardDescription>For large portfolios</CardDescription>
                  <div className="text-4xl font-bold mt-4">₹60L/year</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">75-150 projects</p>
                  <p className="text-sm">• Everything in Professional</p>
                  <p className="text-sm">• Custom reports</p>
                  <p className="text-sm">• Dedicated success manager</p>
                  <p className="text-sm">• On-premise deployment option</p>
                  <Button className="w-full mt-6" variant="outline">Contact Sales</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* RBI Mandate Explainer */}
      <section className="py-20 border-b bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">What RBI Project Finance Directions 2025 Require</h2>
            <p className="text-xl text-center text-muted-foreground mb-12">Key mandates every lender must comply with</p>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span>Digital Databases</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Electronic project data maintained &quot;on an ongoing basis&quot; with real-time updates for all material changes
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span>15-Day Updates</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Material changes must be captured within 15 days of occurrence, including cost variations, timeline shifts, and milestone delays
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-blue-600" />
                    <span>Credit Event Detection</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Automatic flagging of DCCO deferments, cost overruns, delays, and other credit events as defined by RBI guidelines
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>Weekly CRILC Reporting</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Submit Credit Event registers every week (not monthly), with complete project details and resolution plans
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Independent Validation</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Track certified engineer/architect progress confirmations and maintain documentation for regulatory audits
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA with Countdown */}
      <section className="py-20 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">
              Don&apos;t Wait Until September. Start Your 90-Day Compliance Journey Today.
            </h2>
            <div className="mb-8">
              <CountdownTimer />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8">
                <Link href="/login">
                  Schedule 30-Minute Discovery Call
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link href="/register">Request Pilot Proposal</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-lg mb-4">InfraCOMPLY Pro</h3>
                <p className="text-sm text-muted-foreground">
                  RBI-Compliant Credit Risk Monitoring for Infrastructure & CRE Finance
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Security</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Documentation</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">RBI Guidelines</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t pt-8 text-center text-sm text-muted-foreground">
              <p>© 2024 InfraCOMPLY Pro. All rights reserved.</p>
              <p className="mt-2">Bangalore, India | contact@infracomply.pro</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
