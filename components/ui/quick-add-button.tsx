"use client"

import { Button } from '@/components/ui/button'
import { Plus, Check } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'

interface QuickAddButtonProps {
  product: {
    id: string
    name: string
    price: number
    image?: string
  }
  className?: string
}

export function QuickAddButton({ product, className }: QuickAddButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem } = useCart()

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault() // Previeni la navigazione al prodotto
    e.stopPropagation()
    
    setIsAdding(true)
    
    // Simula un piccolo delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || '/placeholder-image.jpg',
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
      onClick={handleQuickAdd}
      disabled={isAdding}
    >
      {isAdding ? (
        <>
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
          ...
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