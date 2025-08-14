// File: components/ui/quick-add-button.tsx
"use client"

import { Button } from '@/components/ui/button'
import { Plus, Check, Eye } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'

interface QuickAddButtonProps {
  product: {
    id: string
    name: string
    price: number
    image?: string
    colors?: string[]
  }
  className?: string
}

export function QuickAddButton({ product, className }: QuickAddButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem } = useCart()
  const router = useRouter()

  // Determina se il prodotto ha varianti (più di 1 colore)
  const hasVariants = product.colors && product.colors.length > 1

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault() // Previeni la navigazione al prodotto
    e.stopPropagation()
    
    if (hasVariants) {
      // Se ha varianti, vai al dettaglio prodotto
      router.push(`/prodotti/${product.id}`)
      return
    }

    // Se non ha varianti, aggiungi direttamente al carrello
    setIsAdding(true)
    
    // Simula un piccolo delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || '/placeholder-image.jpg',
      color: product.colors?.[0] || 'Default', // Usa il primo colore disponibile
      inStock: true
    }, 1)
    
    setIsAdding(false)
    setJustAdded(true)
    
    // Reset dello stato dopo 2 secondi
    setTimeout(() => setJustAdded(false), 2000)
  }

  if (justAdded) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className={`bg-green-50 text-green-600 border-green-200 ${className}`}
        disabled
      >
        <Check className="h-4 w-4 mr-1" />
        Aggiunto
      </Button>
    )
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className={className}
      onClick={handleClick}
      disabled={isAdding}
    >
      {isAdding ? (
        <>
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
          ...
        </>
      ) : hasVariants ? (
        <>
          <Eye className="h-4 w-4 mr-1" />
          Scegli
        </>
      ) : (
        <>
          <Plus className="h-4 w-4 mr-1" />
          Aggiungi
        </>
      )}
    </Button>
  )
}