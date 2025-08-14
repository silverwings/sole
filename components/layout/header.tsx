// File: components/layout/header.tsx
"use client"

import Link from 'next/link'
import { ShoppingCart, User, Menu, Search, LogOut, Package, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect, useRef } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { getTotalItems } = useCart()
  const { user, logout } = useAuth()
  const totalItems = getTotalItems()
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Chiudi menu quando clicchi fuori (solo menu mobile, non user menu)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
      // RIMUOVIAMO il click outside per user menu - lo gestiremo diversamente
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen]) // Rimuovi isUserMenuOpen dalle dipendenze

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

  const handleUserClick = () => {
    if (user) {
      setIsUserMenuOpen(!isUserMenuOpen)
    } else {
      // Vai alla pagina login con redirect alla pagina corrente
      const currentPath = pathname
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
    }
  }

  const handleUserMenuItemClick = () => {
    // Chiudi menu solo per i link, non per logout
    setIsUserMenuOpen(false)
  }

  const handleLogout = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    // Chiudi il menu prima per evitare conflitti
    setIsUserMenuOpen(false)
    
    // Delay piccolo per permettere al menu di chiudersi
    setTimeout(() => {
      logout()
    }, 100)
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
            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden sm:flex"
                onClick={handleUserClick}
              >
                <User className="h-4 w-4" />
              </Button>
              
              {/* User Dropdown */}
              {user && isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-background border rounded-md shadow-lg z-[99999] pointer-events-auto">
                  <div className="p-3 border-b">
                    <p className="font-medium text-sm">Ciao, {user.firstName}!</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  
                  <div className="py-1">
                    <Link 
                      href="/profilo" 
                      className="flex items-center px-3 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={handleUserMenuItemClick}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Il mio Profilo
                    </Link>
                    
                    <Link 
                      href="/ordini" 
                      className="flex items-center px-3 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={handleUserMenuItemClick}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      I miei Ordini
                    </Link>
                    
                    <hr className="my-1" />
                    
                    <button 
                      onClick={handleLogout}
                      type="button"
                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted transition-colors text-red-600 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Esci
                    </button>
                  </div>
                </div>
              )}
            </div>

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