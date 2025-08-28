import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Plus } from 'lucide-react';
import { useReports } from '@/contexts/ReportsContext';
import { ReportCard } from './ReportCard';

export const ReportsView = () => {
  const { reports, filterReports } = useReports();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const categories = [
    { id: 'infrastructure', label: 'Infrastructure', emoji: '🏗️' },
    { id: 'safety', label: 'Safety', emoji: '🛡️' },
    { id: 'environment', label: 'Environment', emoji: '🌱' },
    { id: 'health', label: 'Health', emoji: '🏥' },
    { id: 'education', label: 'Education', emoji: '📚' },
    { id: 'other', label: 'Other', emoji: '📋' },
  ];

  const statuses = [
    { id: 'pending', label: 'Pending', color: 'bg-warning/20 text-warning-foreground' },
    { id: 'in-progress', label: 'In Progress', color: 'bg-accent/20 text-accent-foreground' },
    { id: 'resolved', label: 'Resolved', color: 'bg-success/20 text-success-foreground' },
  ];

  const filteredReports = filterReports(selectedCategory || undefined, selectedStatus || undefined);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedStatus('');
  };

  return (
    <div className="mobile-container mobile-padding pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Community Reports</h1>
          <p className="text-muted-foreground">
            {filteredReports.length} {filteredReports.length === 1 ? 'report' : 'reports'} found
          </p>
        </div>
        <Button variant="glass" size="icon" className="rounded-full">
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Filter by Category</span>
          {(selectedCategory || selectedStatus) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-xs h-6 px-2"
            >
              Clear all
            </Button>
          )}
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {categories.map((category) => (
            <Badge
              key={category.id}
              className={`cursor-pointer whitespace-nowrap transition-smooth px-3 py-1.5 rounded-full ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-glass/60 text-foreground hover:bg-glass/80'
              }`}
              onClick={() => setSelectedCategory(
                selectedCategory === category.id ? '' : category.id
              )}
            >
              <span className="mr-1">{category.emoji}</span>
              {category.label}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-4 mb-2">
          <span className="text-sm font-medium text-foreground">Filter by Status</span>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {statuses.map((status) => (
            <Badge
              key={status.id}
              className={`cursor-pointer whitespace-nowrap transition-smooth px-3 py-1.5 rounded-full border ${
                selectedStatus === status.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : `${status.color} border-current hover:opacity-80`
              }`}
              onClick={() => setSelectedStatus(
                selectedStatus === status.id ? '' : status.id
              )}
            >
              {status.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))
        ) : (
          <div className="glass rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No reports found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or check back later for new reports.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};