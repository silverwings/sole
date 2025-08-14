import { Product, Category, ProductFilters, ProductSort } from './types'

// Simulazione di delay per API realistiche
const API_DELAY = 300

// Funzione di delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Funzione per fetch con error handling
async function fetchData<T>(url: string): Promise<T> {
  await delay(API_DELAY)
  
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Fetch error:', error)
    throw new Error('Errore nel caricamento dei dati')
  }
}

// ==================== PRODOTTI ====================

// Ottieni tutti i prodotti
export async function getAllProducts(): Promise<Product[]> {
  const data = await fetchData<{ products: Product[] }>('/data/products.json')
  return data.products
}

// Ottieni un prodotto per ID
export async function getProductById(id: string): Promise<Product | null> {
  const products = await getAllProducts()
  return products.find(p => p.id === id) || null
}

// Ottieni prodotti con filtri e ordinamento
export async function getProducts(
  filters: ProductFilters = {},
  sort: ProductSort = 'relevance',
  page: number = 1,
  limit: number = 12
): Promise<{
  products: Product[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}> {
  let products = await getAllProducts()
  
  // Applica filtri
  if (filters.category) {
    // Compatibilità con URL singola categoria
    products = products.filter(p => p.category === filters.category)
  } else if (filters.categories && filters.categories.length > 0) {
    // Selezione multipla categorie
    products = products.filter(p => filters.categories!.includes(p.category))
  }
  
  if (filters.brand && filters.brand.length > 0) {
    products = products.filter(p => filters.brand!.includes(p.brand))
  }
  
  if (filters.priceRange) {
    products = products.filter(p => 
      p.price >= filters.priceRange!.min && 
      p.price <= filters.priceRange!.max
    )
  }
  
  if (filters.rating) {
    products = products.filter(p => p.rating >= filters.rating!)
  }
  
  if (filters.inStock !== undefined) {
    products = products.filter(p => p.inStock === filters.inStock)
  }
  
  if (filters.isOnSale) {
    products = products.filter(p => p.isOnSale)
  }
  
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    products = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.brand.toLowerCase().includes(searchTerm) ||
      p.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }
  
  // Applica ordinamento
  switch (sort) {
    case 'price-asc':
      products.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      products.sort((a, b) => b.price - a.price)
      break
    case 'newest':
      products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
      break
    case 'bestselling':
      products.sort((a, b) => b.reviews - a.reviews)
      break
    case 'rating':
      products.sort((a, b) => b.rating - a.rating)
      break
    case 'relevance':
    default:
      // Ordinamento per rilevanza (prodotti in offerta prima, poi nuovi, poi rating)
      products.sort((a, b) => {
        if (a.isOnSale !== b.isOnSale) return (b.isOnSale ? 1 : 0) - (a.isOnSale ? 1 : 0)
        if (a.isNew !== b.isNew) return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
        return b.rating - a.rating
      })
  }
  
  // Paginazione
  const total = products.length
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedProducts = products.slice(startIndex, endIndex)
  const hasMore = endIndex < total
  
  return {
    products: paginatedProducts,
    total,
    page,
    limit,
    hasMore
  }
}

// Ottieni prodotti correlati (stessa categoria, escluso il prodotto corrente)
export async function getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
  const currentProduct = await getProductById(productId)
  if (!currentProduct) return []
  
  const products = await getAllProducts()
  const related = products
    .filter(p => p.id !== productId && p.category === currentProduct.category)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
  
  return related
}

// Ottieni prodotti in evidenza
export async function getFeaturedProducts(limit: number = 6): Promise<Product[]> {
  const products = await getAllProducts()
  return products
    .filter(p => p.isOnSale || p.isNew || p.rating >= 4.5)
    .sort((a, b) => {
      if (a.isOnSale !== b.isOnSale) return (b.isOnSale ? 1 : 0) - (a.isOnSale ? 1 : 0)
      return b.rating - a.rating
    })
    .slice(0, limit)
}

// ==================== CATEGORIE ====================

// Ottieni tutte le categorie
export async function getAllCategories(): Promise<Category[]> {
  const data = await fetchData<{ categories: Category[] }>('/data/categories.json')
  return data.categories
}

// Ottieni una categoria per slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getAllCategories()
  return categories.find(c => c.slug === slug) || null
}