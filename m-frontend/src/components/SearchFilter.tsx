import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { categories } from '@/lib/categories';
import { Category } from '@/types';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
}

const SearchFilter = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange
}: SearchFilterProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search for your favorite sweets..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10 h-12 text-base bg-card border-border/50 focus:border-primary"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange(category.id as Category)}
            className={`gap-2 transition-all ${
              selectedCategory === category.id 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'hover:bg-secondary'
            }`}
          >
            <span>{category.emoji}</span>
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SearchFilter;
