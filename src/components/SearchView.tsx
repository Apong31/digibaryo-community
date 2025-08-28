import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useReports } from '@/contexts/ReportsContext';
import { ReportCard } from './ReportCard';

export const SearchView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { searchReports } = useReports();

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    const results = searchReports(searchQuery);
    setSearchResults(results);
    setHasSearched(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const recentSearches = [
    'street light',
    'pothole',
    'stray dogs',
    'garbage collection',
    'health center',
  ];

  return (
    <div className="mobile-container mobile-padding pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Search Reports</h1>
        <p className="text-muted-foreground">
          Find community reports by keywords, location, or category
        </p>
      </div>

      {/* Search Input */}
      <div className="glass rounded-2xl p-4 mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for reports, locations, or issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 pr-10 rounded-xl border-glass-border/50 bg-glass/30 backdrop-blur-sm"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <Button 
            onClick={handleSearch}
            disabled={!searchQuery.trim()}
            variant="default"
            className="rounded-xl px-6"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Recent Searches or Results */}
      {!hasSearched ? (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Searches</h2>
          <div className="glass rounded-2xl p-4">
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery(term);
                    const results = searchReports(term);
                    setSearchResults(results);
                    setHasSearched(true);
                  }}
                  className="rounded-full bg-muted/20 hover:bg-muted/40 text-sm"
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>

          {/* Search Tips */}
          <div className="glass rounded-2xl p-4 mt-4">
            <h3 className="font-semibold text-foreground mb-2">Search Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Search by keywords like "street light" or "pothole"</li>
              <li>• Use location names like "Main Road" or "Purok 3"</li>
              <li>• Try category names like "infrastructure" or "safety"</li>
              <li>• Search for reporter names or specific issues</li>
            </ul>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Search Results
            </h2>
            <span className="text-sm text-muted-foreground">
              {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "{searchQuery}"
            </span>
          </div>

          {searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any reports matching "{searchQuery}". Try different keywords or check your spelling.
              </p>
              <Button variant="outline" onClick={clearSearch}>
                New Search
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};