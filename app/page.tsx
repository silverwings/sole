"use client"

import { Button } from '@/components/ui/button'
import { QuickAddButton } from '@/components/ui/quick-add-button'
import Link from 'next/link'
import { ArrowRight, Loader2, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Product } from '@/lib/types'
import { getFeaturedProducts } from '@/lib/api'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadFeaturedProducts()
  }, [])

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true)
      const products = await getFeaturedProducts(6)
      setFeaturedProducts(products)
    } catch (err) {
      setError('Errore nel caricamento dei prodotti in evidenza')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Benvenuto in{' '}
            <span className="text-primary">ModernShop</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Scopri la nostra collezione di prodotti selezionati con cura. 
            Design moderno, qualità superiore, esperienza d'acquisto senza pari.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/prodotti">
              <Button size="lg" className="w-full sm:w-auto">
                Esplora Prodotti
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Scopri di più
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Prodotti in Evidenza</h2>
            <p className="text-muted-foreground mb-8">
              I nostri prodotti più venduti e apprezzati
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Caricamento prodotti...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={loadFeaturedProducts}>Riprova</Button>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group">
                  <Link href={`/prodotti/${product.id}`}>
                    <div className="cursor-pointer">
                      <div className="bg-card rounded-lg aspect-square mb-4 flex items-center justify-center group-hover:bg-muted/80 transition-colors relative overflow-hidden border">
                        <span className="text-muted-foreground text-center px-4">
                          {product.name}
                        </span>
                        
                        {/* Badge offerta */}
                        {product.isOnSale && product.discount && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                            -{product.discount}%
                          </div>
                        )}
                        
                        {/* Badge nuovo */}
                        {product.isNew && (
                          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded">
                            Nuovo
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div className="text-xs text-primary font-medium uppercase tracking-wide">
                          {product.brand}
                        </div>
                        
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        
                        <p className="text-muted-foreground line-clamp-2 text-sm">
                          {product.shortDescription || product.description.slice(0, 120) + '...'}
                        </p>
                        
                        {/* Rating */}
                        <div className="flex items-center space-x-2">
                          <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= product.rating ? 'fill-yellow-400' : ''
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {product.rating} ({product.reviews})
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold">
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

          {/* Call to Action */}
          {!loading && !error && featuredProducts.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/prodotti">
                <Button size="lg" variant="outline">
                  Vedi Tutti i Prodotti
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Perché Scegliere ModernShop</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="space-y-4">
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center mx-auto">
                <span className="text-primary-foreground text-xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold">Spedizione Veloce</h3>
              <p className="text-muted-foreground">
                Consegna in 24-48h su tutto il territorio nazionale
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center mx-auto">
                <span className="text-primary-foreground text-xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold">Garanzia Qualità</h3>
              <p className="text-muted-foreground">
                Tutti i prodotti sono selezionati e garantiti
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center mx-auto">
                <span className="text-primary-foreground text-xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold">Assistenza 24/7</h3>
              <p className="text-muted-foreground">
                Il nostro team è sempre a tua disposizione
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}