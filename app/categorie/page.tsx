// File: app/categorie/page.tsx
"use client"

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Loader2, Package } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Category } from '@/lib/types'
import { getAllCategories, getAllProducts } from '@/lib/api'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      
      // Carica categorie e prodotti per calcolare i conteggi
      const [categoriesData, allProducts] = await Promise.all([
        getAllCategories(),
        getAllProducts()
      ])

      // Calcola il numero di prodotti per categoria
      const productCounts = allProducts.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      // Aggiungi il conteggio prodotti a ogni categoria
      const categoriesWithCount = categoriesData.map(category => ({
        ...category,
        productCount: productCounts[category.id] || 0
      }))

      // Ordina per numero di prodotti (decrescente) e poi per nome
      categoriesWithCount.sort((a, b) => {
        if (b.productCount !== a.productCount) {
          return b.productCount - a.productCount
        }
        return a.name.localeCompare(b.name)
      })

      setCategories(categoriesWithCount)
    } catch (err) {
      setError('Errore nel caricamento delle categorie')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Icone per le categorie (mapping semplice)
  const getCategoryIcon = (categoryId: string) => {
    const icons: Record<string, string> = {
      'elettronica': '📱',
      'audio': '🎧',
      'computer': '💻',
      'gaming': '🎮',
      'wearable': '⌚',
      'tablet': '📋',
      'fotografia': '📷',
      'accessori': '🔌'
    }
    return icons[categoryId] || '📦'
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadCategories}>Riprova</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Categorie Prodotti</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Esplora la nostra vasta selezione di prodotti organizzati per categoria. 
          Trova esattamente quello che stai cercando.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Caricamento categorie...</span>
        </div>
      )}

      {/* Categories Grid */}
      {!loading && categories.length > 0 && (
        <>


          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/prodotti?categoria=${category.id}`}
                className="group"
              >
                <div className="bg-card rounded-lg border p-6 h-full transition-all duration-200 hover:shadow-lg hover:border-primary/50 cursor-pointer">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg mb-4 mx-auto group-hover:bg-primary/20 transition-colors">
                    <span className="text-2xl">
                      {getCategoryIcon(category.id)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-3">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {category.description}
                    </p>

                    {/* Product Count */}
                    <div className="flex items-center justify-center space-x-2 text-sm">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {category.productCount} prodotti
                      </span>
                    </div>

                    {/* Call to Action */}
                    <div className="pt-2">
                      <div className="inline-flex items-center space-x-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                        <span>Esplora</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Popular Categories Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Categorie Più Popolari</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories
                .filter(cat => cat.productCount > 0)
                .slice(0, 4)
                .map((category) => (
                  <Link 
                    key={`popular-${category.id}`}
                    href={`/prodotti?categoria=${category.id}`}
                  >
                    <div className="bg-card rounded-lg border p-6 flex items-center space-x-4 hover:shadow-md transition-shadow cursor-pointer group">
                      <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <span className="text-xl">
                          {getCategoryIcon(category.id)}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {category.productCount} prodotti disponibili
                        </p>
                      </div>
                      
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
            </div>
          </div>

          {/* Browse All Products CTA */}
          <div className="mt-16 text-center bg-muted/50 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Non trovi quello che cerchi?</h2>
            <p className="text-muted-foreground mb-6">
              Esplora tutti i nostri prodotti o utilizza la ricerca per trovare esattamente quello che ti serve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/prodotti">
                <Button size="lg">
                  Tutti i Prodotti
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Contattaci per Aiuto
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && categories.length === 0 && (
        <div className="text-center py-16">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Nessuna categoria trovata</h2>
          <p className="text-muted-foreground mb-8">
            Le categorie non sono ancora disponibili. Riprova più tardi.
          </p>
          <Button onClick={loadCategories}>Ricarica</Button>
        </div>
      )}
    </div>
  )
}