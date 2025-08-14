// File: components/layout/header.tsx
"use client"

import Link from 'next/link'
import { ShoppingCart, User, Menu, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect, useRef } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useRouter, useSearchParams } from 'next/navigation'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()
  const router = useRouter()
  const searchParams = useSearchParams()
  const menuRef = useRef<HTMLDivElement>(null)

  // Chiudi menu quando clicchi fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    // Mantieni i filtri esistenti dall'URL corrente
    const currentParams = new URLSearchParams(searchParams.toString())
    
    // Aggiungi o aggiorna il parametro di ricerca
    currentParams.set('search', searchQuery.trim())
    
    // Vai alla pagina prodotti con i parametri
    router.push(`/prodotti?${currentParams.toString()}`)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" ref={menuRef}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">M</span>
            </div>
            <span className="font-bold text-xl">ModernShop</span>
          </Link>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between flex-1">
            {/* Navigation Centered */}
            <div className="flex-1 flex justify-center">
              <nav className="flex items-center space-x-6">
                <Link href="/" className="text-foreground hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href="/prodotti" className="text-foreground hover:text-primary transition-colors">
                  Prodotti
                </Link>
                <Link href="/categorie" className="text-foreground hover:text-primary transition-colors">
                  Categorie
                </Link>
                <Link href="/contatti" className="text-foreground hover:text-primary transition-colors">
                  Contatti
                </Link>
              </nav>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cerca"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <User className="h-4 w-4" />
            </Button>
            <Link href="/carrello">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] text-[10px] font-medium">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Button>
            </Link>
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden pb-4">
          {/* Mobile Search Bar */}
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cerca"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              )}
            </div>
          </form>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="border-t pt-4">
              <div className="flex flex-col space-y-2">
                <Link 
                  href="/" 
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/prodotti" 
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Prodotti
                </Link>
                <Link 
                  href="/categorie" 
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Categorie
                </Link>
                <Link 
                  href="/contatti" 
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contatti
                </Link>
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}