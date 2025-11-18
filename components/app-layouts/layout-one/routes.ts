import {
  LayoutDashboard,
  FolderKanban,
  Bell,
  Calculator,
  FileText,
  ScrollText,
  LucideIcon,
} from 'lucide-react';

export type Route = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
};

export const ROUTES: Route[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Projects',
    url: '/projects',
    icon: FolderKanban,
  },
  {
    title: 'Alerts',
    url: '/alerts',
    icon: Bell,
  },
  {
    title: 'Provisions',
    url: '/provisions',
    icon: Calculator,
  },
  {
    title: 'Reports',
    url: '/reports',
    icon: FileText,
  },
  {
    title: 'Audit Log',
    url: '/audit',
    icon: ScrollText,
  },
];
