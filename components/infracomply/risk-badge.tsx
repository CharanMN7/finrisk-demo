import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type RiskBadgeProps = {
  riskScore: number;
  riskTier?: 'Green' | 'Yellow' | 'Red';
  showScore?: boolean;
  className?: string;
};

export function RiskBadge({ riskScore, riskTier, showScore = true, className }: RiskBadgeProps) {
  // Determine risk tier if not provided
  const tier = riskTier || (riskScore >= 75 ? 'Red' : riskScore >= 40 ? 'Yellow' : 'Green');
  
  const variants = {
    Green: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    Yellow: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
    Red: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
  };

  const icons = {
    Green: '●',
    Yellow: '●',
    Red: '●',
  };

  return (
    <Badge
      variant="outline"
      className={cn(variants[tier], className)}
    >
      <span className="mr-1">{icons[tier]}</span>
      {tier}
      {showScore && ` (${riskScore})`}
    </Badge>
  );
}

