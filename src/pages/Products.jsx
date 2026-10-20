import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, Grid, List } from 'lucide-react';
import { products, categories, searchProducts } from '../data/mockData';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/utils';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'new', label: 'New Arrivals' },
  { value: 'bestselling', label: 'Best Selling' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const priceRanges = [
  { value: '', label: 'All Prices' },
  { value: '0-1000', label: 'Under ₹1,000' },
  { value: '1000-3000', label: '₹1,000 - ₹3,000' },
  { value: '3000-5000', label: '₹3,000 - ₹5,000' },
  { value: '5000-10000', label: '₹5,000 - ₹10,000' },
  { value: '10000-20000', label: '₹10,000 - ₹20,000' },
  { value: '20000-50000', label: '₹20,000 - ₹50,000' },
  { value: '50000-', label: 'Above ₹50,000' },
];

const fabricOptions = [
  'Pure Uppada Silk', 
  'Silk · Zari Border', 
  'Handloom Cotton Silk', 
  'Traditional Silk', 
  'Pure Mulberry Silk', 
  'Pure Organza Silk', 
  'Chanderi Silk Cotton', 
  'Silk Velvet & Brocade', 
  'Pure Raw Silk'
];
const occasionOptions = ['Wedding Celebrations', 'Festive Elegance', 'Traditional Gatherings', 'Everyday Sophistication'];

export function Products() {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const occasionParam = searchParams.get('occasion') || '';
  const fabricParam = searchParams.get('fabric') || '';
  const priceParam = searchParams.get('price') || '';
  const sortParam = searchParams.get('sort') || '';

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
    if (occasionParam) {
      setSelectedOccasions([occasionParam]);
    }
    if (fabricParam) {
      setSelectedFabrics([fabricParam]);
    }
    if (priceParam) {
      setPriceRange(priceParam);
    }
    if (sortParam) {
      setSortBy(sortParam);
    }
  }, [categoryParam, occasionParam, fabricParam, priceParam, sortParam]);

  useEffect(() => {
    let result = [...products];

    if (searchQuery) {
      result = searchProducts(searchQuery);
    }

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    if (selectedFabrics.length > 0) {
      result = result.filter(p => p.fabric && selectedFabrics.includes(p.fabric));
    }

    if (selectedOccasions.length > 0) {
      result = result.filter(p => p.occasion && selectedOccasions.includes(p.occasion));
    }

    if (priceRange) {
      const [min, max] = priceRange.split('-').map(v => v === '' ? Infinity : parseInt(v));
      result = result.filter(p => {
        const price = p.price;
        return price >= (min || 0) && (max === undefined || price <= max);
      });
    }

    result = result.filter(p => p.isActive);

    switch (sortBy) {
      case 'new':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'bestselling':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedCategories, selectedFabrics, selectedOccasions, priceRange, sortBy]);

  const activeFilterCount = selectedCategories.length + selectedFabrics.length + selectedOccasions.length + (priceRange ? 1 : 0);

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedFabrics([]);
    setSelectedOccasions([]);
    setPriceRange('');
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
  };

  const toggleFabric = (fabric) => {
    setSelectedFabrics(prev => prev.includes(fabric) ? prev.filter(f => f !== fabric) : [...prev, fabric]);
  };

  const toggleOccasion = (occasion) => {
    setSelectedOccasions(prev => prev.includes(occasion) ? prev.filter(o => o !== occasion) : [...prev, occasion]);
  };

  const getCategoryCount = (categoryName) => {
    return products.filter(p => p.category === categoryName && p.isActive).length;
  };

  const getFabricCount = (fabric) => {
    return products.filter(p => p.fabric === fabric && p.isActive).length;
  };

  const getOccasionCount = (occasion) => {
    return products.filter(p => p.occasion === occasion && p.isActive).length;
  };

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Page Header */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059]">
                Sri Lakshmi Saree House · Catalog
              </span>
              <h1 className="font-serif text-3xl font-normal text-stone-900 mt-1">
                {searchQuery ? `Search results for "${searchQuery}"` : categoryParam ? categoryParam : 'Authentic Handloom Sarees'}
              </h1>
              <p className="text-stone-600 text-xs mt-1">
                {filteredProducts.length} weave{filteredProducts.length !== 1 ? 's' : ''} available • Silk Mark SMOI Certified
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setMobileFiltersOpen(true)} className="sm:hidden text-xs">
                <Filter className="w-4 h-4 mr-2" />
                Filters {activeFilterCount > 0 && <Badge variant="info" className="ml-1">{activeFilterCount}</Badge>}
              </Button>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">Sort by:</span>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  options={sortOptions}
                  className="w-48 text-xs"
                />
              </div>
              <div className="flex items-center gap-1 border border-stone-300 rounded-xs bg-white">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn('p-2 rounded-xs transition-colors', viewMode === 'grid' ? 'bg-[#721224] text-white' : 'text-stone-500 hover:text-stone-900')}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn('p-2 rounded-xs transition-colors', viewMode === 'list' ? 'bg-[#721224] text-white' : 'text-stone-500 hover:text-stone-900')}
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-72 flex-shrink-0 lg:block hidden">
            <div className="sticky top-24 space-y-6 bg-white p-5 border border-stone-200 rounded-xs shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h3 className="font-serif text-base font-bold text-stone-900">Refine Catalog</h3>
                {activeFilterCount > 0 && (
                  <button onClick={handleClearFilters} className="text-[11px] text-[#721224] font-semibold hover:underline">
                    Clear All
                  </button>
                )}
              </div>

              {/* Categories */}
              <FilterSection title="Category" count={categories.length}>
                {categories.map((category) => (
                  <FilterCheckbox
                    key={category.id}
                    label={category.name}
                    count={getCategoryCount(category.name)}
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => toggleCategory(category.name)}
                  />
                ))}
              </FilterSection>

              {/* Price Range */}
              <FilterSection title="Price Range">
                {priceRanges.map((range) => (
                  <FilterCheckbox
                    key={range.value}
                    label={range.label}
                    checked={priceRange === range.value}
                    onChange={() => setPriceRange(range.value)}
                  />
                ))}
              </FilterSection>

              {/* Fabric */}
              <FilterSection title="Fabric & Weave">
                {fabricOptions.map((fabric) => (
                  <FilterCheckbox
                    key={fabric}
                    label={fabric}
                    count={getFabricCount(fabric)}
                    checked={selectedFabrics.includes(fabric)}
                    onChange={() => toggleFabric(fabric)}
                  />
                ))}
              </FilterSection>

              {/* Occasion */}
              <FilterSection title="Occasion">
                {occasionOptions.map((occasion) => (
                  <FilterCheckbox
                    key={occasion}
                    label={occasion}
                    count={getOccasionCount(occasion)}
                    checked={selectedOccasions.includes(occasion)}
                    onChange={() => toggleOccasion(occasion)}
                  />
                ))}
              </FilterSection>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            {activeFilterCount > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {selectedCategories.map(cat => (
                  <FilterTag key={cat} label={cat} onRemove={() => toggleCategory(cat)} />
                ))}
                {selectedFabrics.map(fab => (
                  <FilterTag key={fab} label={fab} onRemove={() => toggleFabric(fab)} />
                ))}
                {selectedOccasions.map(occ => (
                  <FilterTag key={occ} label={occ} onRemove={() => toggleOccasion(occ)} />
                ))}
                {priceRange && (
                  <FilterTag key="price" label={priceRanges.find(r => r.value === priceRange)?.label || priceRange} onRemove={() => setPriceRange('')} />
                )}
                {activeFilterCount > 0 && (
                  <button onClick={handleClearFilters} className="text-xs text-stone-500 hover:text-stone-900 ml-2">
                    Clear all
                  </button>
                )}
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white border border-stone-200 rounded-xs p-8 shadow-xs">
                <div className="w-16 h-16 mx-auto mb-4 bg-stone-100 rounded-full flex items-center justify-center">
                  <Filter className="w-8 h-8 text-stone-400" />
                </div>
                <h3 className="font-serif text-2xl font-normal text-stone-900 mb-2">No matching sarees found</h3>
                <p className="text-stone-500 text-xs mb-6">Try relaxing your filter criteria or searching for another fabric.</p>
                <Button variant="outline" onClick={handleClearFilters} className="text-xs">
                  <X className="w-4 h-4 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <>
                <div className={cn(
                  'gap-6',
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'flex flex-col'
                )}>
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      variant={viewMode === 'list' ? 'compact' : 'default'}
                    />
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <MobileFiltersModal
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
        selectedFabrics={selectedFabrics}
        onToggleFabric={toggleFabric}
        selectedOccasions={selectedOccasions}
        onToggleOccasion={toggleOccasion}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        onClearAll={handleClearFilters}
        activeFilterCount={activeFilterCount}
        categories={categories}
        getCategoryCount={getCategoryCount}
        fabricOptions={fabricOptions}
        getFabricCount={getFabricCount}
        occasionOptions={occasionOptions}
        getOccasionCount={getOccasionCount}
      />
    </div>
  );
}

function FilterSection({ title, count, children }) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center justify-between">
        <span>{title}</span>
        {count && <span className="text-[10px] text-stone-400 font-normal">({count})</span>}
      </h4>
      <div className="space-y-1.5 pt-1">{children}</div>
    </div>
  );
}

function FilterCheckbox({ label, count, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-700 hover:text-stone-900">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-3.5 h-3.5 text-[#721224] border-stone-300 rounded-xs focus:ring-[#721224]"
      />
      <span>{label}</span>
      {count !== undefined && (
        <span className="ml-auto text-[10px] text-stone-400">({count})</span>
      )}
    </label>
  );
}

function FilterTag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 border border-stone-300 text-stone-800 text-xs rounded-xs">
      {label}
      <button onClick={onRemove} className="text-stone-500 hover:text-[#721224]" aria-label={`Remove ${label} filter`}>
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

function MobileFiltersModal({
  isOpen,
  onClose,
  selectedCategories,
  onToggleCategory,
  selectedFabrics,
  onToggleFabric,
  selectedOccasions,
  onToggleOccasion,
  priceRange,
  onPriceRangeChange,
  onClearAll,
  activeFilterCount,
  categories,
  getCategoryCount,
  fabricOptions,
  getFabricCount,
  occasionOptions,
  getOccasionCount,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-stone-200 p-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-stone-900">Refine Catalog</h2>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearAll} className="text-xs text-[#721224]">
                Clear All
              </Button>
            )}
            <button onClick={onClose} className="p-2 text-stone-500 hover:text-stone-900">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-4 space-y-6">
          <FilterSection title="Category" count={categories.length}>
            {categories.map((category) => (
              <FilterCheckbox
                key={category.id}
                label={category.name}
                count={getCategoryCount(category.name)}
                checked={selectedCategories.includes(category.name)}
                onChange={() => onToggleCategory(category.name)}
              />
            ))}
          </FilterSection>

          <FilterSection title="Price Range">
            {priceRanges.map((range) => (
              <FilterCheckbox
                key={range.value}
                label={range.label}
                checked={priceRange === range.value}
                onChange={() => onPriceRangeChange(range.value)}
              />
            ))}
          </FilterSection>

          <FilterSection title="Fabric">
            {fabricOptions.map((fabric) => (
              <FilterCheckbox
                key={fabric}
                label={fabric}
                count={getFabricCount(fabric)}
                checked={selectedFabrics.includes(fabric)}
                onChange={() => onToggleFabric(fabric)}
              />
            ))}
          </FilterSection>

          <FilterSection title="Occasion">
            {occasionOptions.map((occasion) => (
              <FilterCheckbox
                key={occasion}
                label={occasion}
                count={getOccasionCount(occasion)}
                checked={selectedOccasions.includes(occasion)}
                onChange={() => onToggleOccasion(occasion)}
              />
            ))}
          </FilterSection>

          <Button className="w-full bg-[#721224] text-white text-xs uppercase tracking-wider" onClick={onClose}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
