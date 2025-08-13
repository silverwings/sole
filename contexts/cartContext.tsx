"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  color?: string
  inStock: boolean
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, quantity: number) => void
  removeItem: (itemKey: string) => void
  updateQuantity: (itemKey: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Carica il carrello dal localStorage al mount (solo client-side)
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Errore nel caricamento del carrello:', error)
      }
    }
  }, [])

  // Salva il carrello nel localStorage quando cambia
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (newItem: Omit<CartItem, 'quantity'>, quantity: number) => {
    console.log('🛒 Context addItem ricevuto:', { newItem: newItem.name, quantity })
    
    setItems(currentItems => {
      // Crea una chiave unica per l'item (id + colore)
      const itemKey = `${newItem.id}-${newItem.color || 'default'}`
      
      // Controlla se l'item esiste già (stesso id e colore)
      const existingItemIndex = currentItems.findIndex(
        item => `${item.id}-${item.color || 'default'}` === itemKey
      )

      if (existingItemIndex >= 0) {
        // Se esiste, aumenta la quantità
        const updatedItems = [...currentItems]
        const oldQty = updatedItems[existingItemIndex].quantity
        updatedItems[existingItemIndex].quantity += quantity
        console.log(`➕ Aggiornato item esistente: ${oldQty} + ${quantity} = ${updatedItems[existingItemIndex].quantity}`)
        return updatedItems
      } else {
        // Se non esiste, aggiungi nuovo item con la quantità specificata
        console.log(`✨ Creato nuovo item con quantità: ${quantity}`)
        return [...currentItems, { ...newItem, quantity: quantity }]
      }
    })
  }

  const removeItem = (itemKey: string) => {
    setItems(currentItems => currentItems.filter(item => 
      `${item.id}-${item.color || 'default'}` !== itemKey
    ))
  }

  const updateQuantity = (itemKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemKey)
      return
    }

    setItems(currentItems =>
      currentItems.map(item =>
        `${item.id}-${item.color || 'default'}` === itemKey 
          ? { ...item, quantity } 
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart deve essere usato all\'interno di un CartProvider')
  }
  return context
}