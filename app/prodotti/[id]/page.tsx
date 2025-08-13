"use client"

import { Button } from '@/components/ui/button'
import { useState, use, useCallback, useEffect } from 'react'
import { Minus, Plus, Heart, Share2, Star, ShoppingCart, Loader2 } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { Product } from '@/lib/types'
import { getProductById, getRelatedProducts } from '@/lib/api'
import Link from 'next/link'

interface ProductDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [isAdding, setIsAdding] = useState(false)
  
  const { addItem } = useCart()

  // Carica prodotto e prodotti correlati
  useEffect(() => {
    loadData()
  }, [resolvedParams.id])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Prima prova a caricare come prodotto
      const productData = await getProductById(resolvedParams.id)
      
      if (productData) {
        // È un prodotto
        const relatedData = await getRelatedProducts(resolvedParams.id, 4)
        setProduct(productData)
        setRelatedProducts(relatedData)
      } else {
        // Potrebbe essere una categoria, reindirizza
        window.location.href = `/prodotti?categoria=${resolvedParams.id}`
        return
      }
      
    } catch (err) {
      setError('Errore nel caricamento del prodotto')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change))
  }

  const handleAddToCart = useCallback(() => {
    if (!product) return
    
    setIsAdding(true)
    
    const itemToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: product.colors[selectedColor],
      inStock: product.inStock
    }
    
    // Aggiungi al carrello immediatamente
    addItem(itemToAdd, quantity)
    
    // Delay solo per l'effetto visivo
    setTimeout(() => {
      setIsAdding(false)
      // Reset della quantità dopo l'aggiunta
      setQuantity(1)
    }, 300)
    
  }, [product, selectedColor, quantity, addItem])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Caricamento prodotto...</span>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-600 mb-4">{error || 'Prodotto non trovato'}</p>
        <Link href="/prodotti">
          <Button>Torna ai Prodotti</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/prodotti" className="hover:text-foreground">Prodotti</Link>
        <span className="mx-2">/</span>
        <Link href={`/prodotti?categoria=${product.category}`} className="hover:text-foreground capitalize">
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground">Immagine Prodotto</span>
          </div>
          
          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square bg-muted rounded-md flex items-center justify-center text-xs transition-colors ${
                  selectedImage === index ? 'ring-2 ring-primary' : 'hover:bg-muted/80'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-primary font-medium capitalize">{product.brand}</span>
              {product.isNew && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Nuovo</span>
              )}
              {product.isOnSale && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">In Offerta</span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} recensioni)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl font-bold">€{product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    €{product.originalPrice.toFixed(2)}
                  </span>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                    -{product.discount}%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Descrizione</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-2">Caratteristiche Principali</h3>
            <ul className="space-y-1">
              {product.features.map((feature, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Specifications */}
          {product.specifications && (
            <div>
              <h3 className="font-semibold mb-2">Specifiche Tecniche</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Colore</h3>
              <div className="flex space-x-2">
                {product.colors.map((color, index) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(index)}
                    className={`px-3 py-2 border rounded-md text-sm transition-colors ${
                      selectedColor === index 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'hover:border-primary'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Quantità</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity === 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button 
                className="flex-1" 
                size="lg"
                onClick={handleAddToCart}
                disabled={isAdding || !product.inStock}
              >
                {isAdding ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Aggiungendo...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Aggiungi al Carrello
                  </>
                )}
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
              {product.inStock ? 'Disponibile' : 'Non disponibile'}
            </span>
          </div>

          {/* Shipping Info */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Informazioni Spedizione</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Spedizione gratuita per ordini oltre €50</li>
              <li>• Consegna in 24-48 ore lavorative</li>
              <li>• Reso gratuito entro 30 giorni</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reviews Section - Placeholder */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Recensioni Clienti ({product.reviews})</h2>
        <div className="bg-muted/50 p-8 rounded-lg text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= product.rating ? 'fill-yellow-400' : ''
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-semibold">{product.rating}/5</span>
          </div>
          <p className="text-muted-foreground">Sistema recensioni in sviluppo</p>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Prodotti Correlati</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link key={relatedProduct.id} href={`/prodotti/${relatedProduct.id}`}>
                <div className="group cursor-pointer">
                  <div className="bg-muted rounded-lg aspect-square mb-4 flex items-center justify-center group-hover:bg-muted/80 transition-colors relative overflow-hidden">
                    <span className="text-muted-foreground text-center px-2">
                      {relatedProduct.name}
                    </span>
                    
                    {relatedProduct.isOnSale && relatedProduct.discount && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        -{relatedProduct.discount}%
                      </div>
                    )}
                    
                    {relatedProduct.isNew && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Nuovo
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    
                    <div className="flex items-center space-x-1">
                      <div className="flex text-yellow-400 text-sm">
                        {'★'.repeat(Math.floor(relatedProduct.rating))}
                        {'☆'.repeat(5 - Math.floor(relatedProduct.rating))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({relatedProduct.reviews})
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">
                        €{relatedProduct.price.toFixed(2)}
                      </span>
                      {relatedProduct.originalPrice && relatedProduct.originalPrice > relatedProduct.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          €{relatedProduct.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}