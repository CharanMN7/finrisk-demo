'use client';

import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type FilterOption = {
  value: string;
  label: string;
  count?: number;
};

type FilterGroup = {
  id: string;
  label: string;
  options: FilterOption[];
};

type FilterSidebarProps = {
  filterGroups: FilterGroup[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (groupId: string, values: string[]) => void;
  onClearAll?: () => void;
};

export function FilterSidebar({
  filterGroups,
  selectedFilters,
  onFilterChange,
  onClearAll,
}: FilterSidebarProps) {
  const totalSelected = Object.values(selectedFilters).reduce(
    (sum, vals) => sum + vals.length,
    0
  );

  const handleCheckboxChange = (groupId: string, value: string, checked: boolean) => {
    const currentValues = selectedFilters[groupId] || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);
    onFilterChange(groupId, newValues);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Filters</h3>
        {totalSelected > 0 && onClearAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-8 px-2 text-xs"
          >
            <X className="mr-1 h-3 w-3" />
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {filterGroups.map((group) => (
          <div key={group.id} className="space-y-2">
            <Label className="text-sm font-medium">{group.label}</Label>
            <div className="space-y-2">
              {group.options.map((option) => {
                const isChecked = (selectedFilters[group.id] || []).includes(option.value);
                
                return (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${group.id}-${option.value}`}
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(group.id, option.value, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`${group.id}-${option.value}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                    >
                      {option.label}
                      {option.count !== undefined && (
                        <span className="text-muted-foreground ml-1">({option.count})</span>
                      )}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

