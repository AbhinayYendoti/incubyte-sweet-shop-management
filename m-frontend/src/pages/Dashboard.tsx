import { useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSweets } from '@/contexts/SweetsContext';
import { Category } from '@/types';
import { DEFAULT_CATEGORY } from '@/lib/constants';
import Header from '@/components/Header';
import SweetCard from '@/components/SweetCard';
import SearchFilter from '@/components/SearchFilter';
import { Package } from 'lucide-react';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { sweets, loading: sweetsLoading, error } = useSweets();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  const filteredSweets = useMemo(() => {
    return sweets.filter(sweet => {
      // Safety check: ensure sweet has required fields
      if (!sweet.name) return false;
      
      const matchesSearch = sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (sweet.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesCategory = selectedCategory === 'all' || (sweet.category ?? DEFAULT_CATEGORY) === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [sweets, searchTerm, selectedCategory]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background bg-pattern-mandala flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background bg-pattern-mandala">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            नमस्ते, {user.name}! 🙏
          </h1>
          <p className="text-muted-foreground">
            Explore our collection of authentic Indian sweets
          </p>
        </div>
        
        <div className="mb-8">
          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
            <p className="font-medium">Error loading sweets</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {sweetsLoading ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4 animate-pulse" />
            <p className="text-muted-foreground">Loading sweets...</p>
          </div>
        ) : filteredSweets.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSweets.map(sweet => (
              <SweetCard key={sweet.id} sweet={sweet} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No sweets found
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No sweets available at the moment'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
