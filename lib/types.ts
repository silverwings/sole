// File: lib/types.ts

// Variante prodotto
export interface ProductVariant {
  id: string
  name: string
  price: number
  originalPrice?: number
  color?: string
  size?: string
  storage?: string
  processor?: string
  ram?: string
  inStock: boolean
}

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
  variants?: ProductVariant[]
  hasVariants?: boolean
  features: string[]
  inStock: boolean
  isNew?: boolean
  isOnSale?: boolean
  discount?: number
  tags?: string[]
  specifications?: Record<string, string>
}

// Opzione di spedizione
export interface ShippingOption {
  id: string
  name: string
  price: number
  freeThreshold?: number | null
  description: string
  deliveryTime: string
  isDefault: boolean
}

// Metodo di pagamento
export interface PaymentMethod {
  id: string
  name: string
  description: string
  icon: string
  isDefault: boolean
  enabled: boolean
  provider: string
  processingTime: string
}

// Categoria
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  productCount?: number // Opzionale, calcolato dinamicamente
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
  category?: string // Per compatibilità con URL singola categoria
  categories?: string[] // Per selezione multipla
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