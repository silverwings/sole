"use client"

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Smartphone Premium XYZ',
      price: 899.99,
      quantity: 1,
      image: '/placeholder-image.jpg',
      color: 'Nero',
      inStock: true
    },
    {
      id: '2',
      name: 'Cuffie Wireless Pro',
      price: 299.99,
      quantity: 2,
      image: '/placeholder-image.jpg',
      color: 'Bianco',
      inStock: true
    },
    {
      id: '3',
      name: 'Smartwatch Elite',
      price: 399.99,
      quantity: 1,
      image: '/placeholder-image.jpg',
      color: 'Argento',
      inStock: false
    }
  ])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id)
      return
    }
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.22 // 22% IVA
  const total = subtotal + shipping + tax

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Il tuo carrello è vuoto</h1>
        <p className="text-muted-foreground mb-8">
          Non hai ancora aggiunto nessun prodotto al carrello
        </p>
        <Link href="/prodotti">
          <Button size="lg">
            Inizia a fare Shopping
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrello</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-card p-6 rounded-lg border">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-muted-foreground">IMG</span>
                </div>

                {/* Product Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Colore: {item.color}</p>
                      {!item.inStock && (
                        <p className="text-sm text-red-600">Non disponibile</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={!item.inStock}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={!item.inStock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-semibold">€{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">€{item.price.toFixed(2)} cad.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Continue Shopping */}
          <div className="flex justify-between items-center pt-4">
            <Link href="/prodotti">
              <Button variant="outline">
                Continua lo Shopping
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={() => setCartItems([])}
              className="text-red-600 hover:text-red-700"
            >
              Svuota Carrello
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card p-6 rounded-lg border sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Riepilogo Ordine</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotale</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Spedizione</span>
                <span className={shipping === 0 ? 'text-green-600' : ''}>
                  {shipping === 0 ? 'Gratuita' : `€${shipping.toFixed(2)}`}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>IVA (22%)</span>
                <span>€{tax.toFixed(2)}</span>
              </div>
              
              <hr />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Totale</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>

            {shipping > 0 && (
              <p className="text-sm text-muted-foreground mt-3">
                Aggiungi €{(50 - subtotal).toFixed(2)} per la spedizione gratuita
              </p>
            )}

            <div className="mt-6 space-y-3">
              <Link href="/checkout" className="block">
                <Button className="w-full" size="lg">
                  Procedi al Checkout
                </Button>
              </Link>
              
              <Button variant="outline" className="w-full">
                Salva per dopo
              </Button>
            </div>

            {/* Security Info */}
            <div className="mt-6 p-3 bg-muted/50 rounded-md">
              <p className="text-xs text-muted-foreground text-center">
                🔒 Pagamento sicuro e protetto
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}