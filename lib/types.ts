// Prodotto completo
export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  shortDescription?: string
  rating: number
  reviews: number
  category: string
  brand: string
  images: string[]
  colors: string[]
  features: string[]
  inStock: boolean
  isNew?: boolean
  isOnSale?: boolean
  discount?: number
  tags?: string[]
  specifications?: Record<string, string>
}

// Categoria
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  productCount: number
}

// Prodotto in evidenza (homepage)
export interface FeaturedProduct {
  productId: string
  title?: string
  description?: string
  image?: string
  badge?: string
}

// Filtri per la ricerca prodotti
export interface ProductFilters {
  category?: string
  brand?: string[]
  priceRange?: {
    min: number
    max: number
  }
  rating?: number
  inStock?: boolean
  isOnSale?: boolean
  search?: string
}

// Ordinamento prodotti
export type ProductSort = 
  | 'relevance'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'bestselling'
  | 'rating'

// Response API (per il futuro)
export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}