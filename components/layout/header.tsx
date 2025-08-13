"use client"

import Link from 'next/link'
import { ShoppingCart, Search, User, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">M</span>
            </div>
            <span className="font-bold text-xl">ModernShop</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
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

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <Link href="/" className="text-foreground hover:text-primary transition-colors py-2">
                Home
              </Link>
              <Link href="/prodotti" className="text-foreground hover:text-primary transition-colors py-2">
                Prodotti
              </Link>
              <Link href="/categorie" className="text-foreground hover:text-primary transition-colors py-2">
                Categorie
              </Link>
              <Link href="/contatti" className="text-foreground hover:text-primary transition-colors py-2">
                Contatti
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}