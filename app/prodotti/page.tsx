"use client"

import { Button } from '@/components/ui/button'
import { QuickAddButton } from '@/components/ui/quick-add-button'
import Link from 'next/link'
import { Filter, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Product, Category, ProductFilters, ProductSort } from '@/lib/types'
import { getProducts, getAllCategories, getAllProducts } from '@/lib/api'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  
  // Stati per filtri
  const [filters, setFilters] = useState<ProductFilters>({})
  const [sort, setSort] = useState<ProductSort>('relevance')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 })

  // Carica prodotti quando cambiano filtri, sort o pagina
  useEffect(() => {
    loadData()
  }, [filters, sort, currentPage])

  // Leggi parametro categoria dall'URL al mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const categoryParam = urlParams.get('categoria')
    
    if (categoryParam) {
      setSelectedCategories([categoryParam])
      setFilters(prev => ({ ...prev, categories: [categoryParam] }))
    }
  }, []) // Solo al mount iniziale

  // Carica categorie al mount
  useEffect(() => {
    loadCategories()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const result = await getProducts(filters, sort, currentPage, 12)
      setProducts(result.products)
      setTotal(result.total)
      setHasMore(result.hasMore)
    } catch (err) {
      setError('Errore nel caricamento dei prodotti')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      // Carica categorie e prodotti
      const [categoriesData, allProducts] = await Promise.all([
        getAllCategories(),
        getAllProducts()
      ])

      // Calcola conteggio prodotti per categoria
      const productCounts = allProducts.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      // Aggiungi conteggio alle categorie
      const categoriesWithCount = categoriesData.map(category => ({
        ...category,
        productCount: productCounts[category.id] || 0
      }))

      setCategories(categoriesWithCount)
    } catch (err) {
      console.error('Errore nel caricamento delle categorie:', err)
    }
  }

  const handleCategoryFilter = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(c => c !== categoryId)
      : [...selectedCategories, categoryId]
    
    setSelectedCategories(newCategories)
    setFilters(prev => ({
      ...prev,
      categories: newCategories.length > 0 ? newCategories : undefined
    }))
    setCurrentPage(1)
  }

  const handleBrandFilter = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand]
    
    setSelectedBrands(newBrands)
    setFilters(prev => ({
      ...prev,
      brand: newBrands.length > 0 ? newBrands : undefined
    }))
    setCurrentPage(1)
  }

  const handlePriceFilter = (min: number, max: number) => {
    setPriceRange({ min, max })
    setFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({})
    setSelectedBrands([])
    setSelectedCategories([])
    setPriceRange({ min: 0, max: 2000 })
    setCurrentPage(1)
    
    // Pulisci anche l'URL dai parametri
    window.history.pushState({}, '', '/prodotti')
  }

  const handleSortChange = (newSort: ProductSort) => {
    setSort(newSort)
    setCurrentPage(1)
  }

  // Brand unici dai prodotti
  const availableBrands = ['Apple', 'Samsung', 'TechPro', 'SoundMax', 'GameGear', 'FitTech']

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadData}>Riprova</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tutti i Prodotti</h1>
          <p className="text-muted-foreground">
            {total > 0 ? `${total} prodotti trovati` : 'Scopri la nostra collezione'}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filtri */}
        <aside className="lg:w-64">
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filtri</h3>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Cancella
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* Categorie */}
              <div>
                <h4 className="font-medium mb-2">Categorie</h4>
                <div className="space-y-2 text-sm">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        className="rounded"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategoryFilter(category.id)}
                      />
                      <span>{category.name} ({category.productCount})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Prezzo */}
              <div>
                <h4 className="font-medium mb-2">Prezzo</h4>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="price" 
                      className="rounded"
                      checked={priceRange.min === 0 && priceRange.max === 50}
                      onChange={() => handlePriceFilter(0, 50)}
                    />
                    <span>Sotto €50</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="price" 
                      className="rounded"
                      checked={priceRange.min === 50 && priceRange.max === 100}
                      onChange={() => handlePriceFilter(50, 100)}
                    />
                    <span>€50 - €100</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="price" 
                      className="rounded"
                      checked={priceRange.min === 100 && priceRange.max === 500}
                      onChange={() => handlePriceFilter(100, 500)}
                    />
                    <span>€100 - €500</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="price" 
                      className="rounded"
                      checked={priceRange.min === 500 && priceRange.max === 2000}
                      onChange={() => handlePriceFilter(500, 2000)}
                    />
                    <span>Oltre €500</span>
                  </label>
                </div>
              </div>

              {/* Brand */}
              <div>
                <h4 className="font-medium mb-2">Brand</h4>
                <div className="space-y-2 text-sm">
                  {availableBrands.map((brand) => (
                    <label key={brand} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        className="rounded"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandFilter(brand)}
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Altri filtri */}
              <div>
                <h4 className="font-medium mb-2">Altri</h4>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={filters.inStock === true}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        inStock: e.target.checked ? true : undefined
                      }))}
                    />
                    <span>Disponibile subito</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={filters.isOnSale === true}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        isOnSale: e.target.checked ? true : undefined
                      }))}
                    />
                    <span>In offerta</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {loading ? 'Caricamento...' : `Mostrando ${products.length} di ${total} prodotti`}
            </p>
            <select 
              className="border rounded-md px-3 py-2 text-sm bg-background"
              value={sort}
              onChange={(e) => handleSortChange(e.target.value as ProductSort)}
            >
              <option value="relevance">Ordina per: Rilevanza</option>
              <option value="price-asc">Prezzo: Dal più basso</option>
              <option value="price-desc">Prezzo: Dal più alto</option>
              <option value="newest">Più recenti</option>
              <option value="bestselling">Più venduti</option>
              <option value="rating">Migliori recensioni</option>
            </select>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Caricamento prodotti...</span>
            </div>
          )}

          {/* Products Grid */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="group">
                  <Link href={`/prodotti/${product.id}`}>
                    <div className="cursor-pointer">
                      <div className="bg-muted rounded-lg aspect-square mb-4 flex items-center justify-center group-hover:bg-muted/80 transition-colors relative overflow-hidden">
                        <span className="text-muted-foreground">{product.name}</span>
                        
                        {/* Badge offerta */}
                        {product.isOnSale && product.discount && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            -{product.discount}%
                          </div>
                        )}
                        
                        {/* Badge nuovo */}
                        {product.isNew && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            Nuovo
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium mb-1 group-hover:text-primary transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.shortDescription || product.description.slice(0, 100) + '...'}
                        </p>
                        
                        {/* Rating */}
                        <div className="flex items-center space-x-1">
                          <div className="flex text-yellow-400 text-sm">
                            {'★'.repeat(Math.floor(product.rating))}
                            {'☆'.repeat(5 - Math.floor(product.rating))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({product.reviews})
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">
                        €{product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          €{product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <QuickAddButton 
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.images[0]
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">Nessun prodotto trovato con i filtri selezionati</p>
              <Button onClick={clearFilters}>Cancella tutti i filtri</Button>
            </div>
          )}

          {/* Pagination */}
          {!loading && products.length > 0 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Precedente
                </Button>
                <span className="px-4 py-2 text-sm">
                  Pagina {currentPage}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={!hasMore}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Successivo
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}