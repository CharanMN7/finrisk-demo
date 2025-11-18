import {
  Construction,
  Zap,
  Home,
  Building2,
  Layers,
  type LucideIcon,
} from 'lucide-react';

type SectorIconProps = {
  sector: 'Highway' | 'Power' | 'Residential' | 'CRE' | 'Other';
  className?: string;
  size?: number;
};

const sectorIconMap: Record<string, LucideIcon> = {
  Highway: Construction,
  Power: Zap,
  Residential: Home,
  CRE: Building2,
  Other: Layers,
};

export function SectorIcon({ sector, className, size = 16 }: SectorIconProps) {
  const Icon = sectorIconMap[sector] || Layers;
  
  return <Icon className={className} size={size} />;
}

export function getSectorIcon(sector: string): LucideIcon {
  return sectorIconMap[sector] || Layers;
}

