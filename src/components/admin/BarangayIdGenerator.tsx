import { useState, useEffect } from 'react';
import { Key, Copy, Trash2, Check, Search, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

interface BarangayId {
  id: string;
  barangay_id: string;
  is_used: boolean;
  assigned_to: string | null;
  created_at: string;
}

export const BarangayIdGenerator = () => {
  const [barangayIds, setBarangayIds] = useState<BarangayId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [barangayIdCount, setBarangayIdCount] = useState(1);
  const [generatedIds, setGeneratedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'used'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchBarangayIds();
  }, []);

  const fetchBarangayIds = async () => {
    try {
      const { data, error } = await supabase
        .from('barangay_ids')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBarangayIds(data || []);
    } catch (error) {
      console.error('Error fetching barangay IDs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load Barangay IDs',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateBarangayId = () => {
    const prefix = 'BRGY';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const handleGenerateIds = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newIds = Array.from({ length: barangayIdCount }, () => generateBarangayId());
      
      const { error } = await supabase
        .from('barangay_ids')
        .insert(newIds.map(id => ({
          barangay_id: id,
          generated_by: user.id,
          is_used: false,
        })));

      if (error) throw error;

      setGeneratedIds(newIds);
      toast({
        title: 'Success!',
        description: `Generated ${barangayIdCount} new Barangay ID${barangayIdCount > 1 ? 's' : ''}`,
      });
      fetchBarangayIds();
    } catch (error) {
      console.error('Error generating IDs:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate Barangay IDs',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Barangay ID copied to clipboard',
    });
  };

  const copyAllToClipboard = () => {
    const availableIds = barangayIds
      .filter(id => !id.is_used)
      .map(id => id.barangay_id)
      .join('\n');
    navigator.clipboard.writeText(availableIds);
    toast({
      title: 'Copied!',
      description: 'All available IDs copied to clipboard',
    });
  };

  const deleteBarangayId = async (id: string) => {
    try {
      const { error } = await supabase
        .from('barangay_ids')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBarangayIds(prev => prev.filter(item => item.id !== id));
      toast({
        title: 'Deleted',
        description: 'Barangay ID removed',
      });
    } catch (error) {
      console.error('Error deleting ID:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete Barangay ID',
        variant: 'destructive',
      });
    }
  };

  const filteredIds = barangayIds.filter(item => {
    const matchesSearch = item.barangay_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'available' && !item.is_used) ||
      (filterStatus === 'used' && item.is_used);
    return matchesSearch && matchesFilter;
  });

  const availableCount = barangayIds.filter(id => !id.is_used).length;
  const usedCount = barangayIds.filter(id => id.is_used).length;

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Loading Barangay IDs...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="glass">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{barangayIds.length}</div>
            <p className="text-xs text-muted-foreground">Total Generated</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-500">{availableCount}</div>
            <p className="text-xs text-muted-foreground">Available</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-muted-foreground">{usedCount}</div>
            <p className="text-xs text-muted-foreground">Used</p>
          </CardContent>
        </Card>
      </div>

      {/* Generator */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Generate New IDs
          </CardTitle>
          <CardDescription>
            Create new Barangay IDs for user registration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="number"
              min="1"
              max="50"
              value={barangayIdCount}
              onChange={(e) => setBarangayIdCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
              placeholder="Number of IDs"
              className="flex-1"
            />
            <Button onClick={handleGenerateIds} className="shrink-0">
              Generate
            </Button>
          </div>

          {generatedIds.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">
                Recently Generated:
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {generatedIds.map((id, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <code className="text-sm font-mono">{id}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(id)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ID List */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>All Barangay IDs</CardTitle>
          <CardDescription>View and manage generated IDs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search IDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={filterStatus === 'available' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('available')}
              >
                Available
              </Button>
              <Button
                size="sm"
                variant={filterStatus === 'used' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('used')}
              >
                Used
              </Button>
            </div>
          </div>

          {availableCount > 0 && (
            <Button variant="outline" size="sm" onClick={copyAllToClipboard}>
              <Download className="w-4 h-4 mr-2" />
              Copy All Available ({availableCount})
            </Button>
          )}

          {filteredIds.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'No IDs match your search' : 'No Barangay IDs generated yet'}
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Barangay ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIds.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <code className="text-sm font-mono">{item.barangay_id}</code>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.is_used ? 'secondary' : 'default'}>
                          {item.is_used ? (
                            <><Check className="w-3 h-3 mr-1" /> Used</>
                          ) : (
                            'Available'
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                        {format(new Date(item.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(item.barangay_id)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          {!item.is_used && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => deleteBarangayId(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
