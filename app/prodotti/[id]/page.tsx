"use client"

import { Button } from '@/components/ui/button'
import { useState, use, useCallback } from 'react'
import { Minus, Plus, Heart, Share2, Star, ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

interface ProductDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = use(params)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [isAdding, setIsAdding] = useState(false)
  
  const { addItem } = useCart()

  // Mock product data
  const product = {
    id: resolvedParams.id,
    name: "Smartphone Premium XYZ",
    price: 899.99,
    originalPrice: 999.99,
    rating: 4.5,
    reviews: 127,
    description: "Un smartphone all'avanguardia con caratteristiche premium per l'utente moderno. Display OLED da 6.7 pollici, processore octa-core, tripla fotocamera con AI e batteria a lunga durata.",
    features: [
      "Display OLED 6.7\" 120Hz",
      "Processore Octa-core 3.2GHz",
      "12GB RAM + 256GB Storage",
      "Tripla fotocamera 108MP",
      "Batteria 5000mAh",
      "Ricarica wireless 50W"
    ],
    images: [
      "/placeholder-image-1.jpg",
      "/placeholder-image-2.jpg", 
      "/placeholder-image-3.jpg",
      "/placeholder-image-4.jpg"
    ],
    colors: ["Nero", "Bianco", "Blu", "Rosso"],
    inStock: true
  }

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change))
  }

  const handleAddToCart = useCallback(() => {
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
    
  }, [product.id, product.name, product.price, product.images, selectedColor, product.inStock, quantity, addItem])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-8">
        <span>Home</span>
        <span className="mx-2">/</span>
        <span>Prodotti</span>
        <span className="mx-2">/</span>
        <span>Elettronica</span>
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
              <span className="text-3xl font-bold">€{product.price}</span>
              <span className="text-xl text-muted-foreground line-through">
                €{product.originalPrice}
              </span>
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                -10%
              </span>
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

          {/* Color Selection */}
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
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600">Disponibile</span>
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
        <h2 className="text-2xl font-bold mb-6">Recensioni Clienti</h2>
        <div className="bg-muted/50 p-8 rounded-lg text-center">
          <p className="text-muted-foreground">Sezione recensioni - In arrivo</p>
        </div>
      </div>

      {/* Related Products - Placeholder */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Prodotti Correlati</h2>
        <div className="bg-muted/50 p-8 rounded-lg text-center">
          <p className="text-muted-foreground">Prodotti correlati - In arrivo</p>
        </div>
      </div>
    </div>
  )
}