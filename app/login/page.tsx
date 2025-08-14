"use client"

import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { Mail, Lock, AlertCircle, Loader2, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Redirect se già loggato
  useEffect(() => {
    if (user) {
      const redirect = searchParams.get('redirect') || '/'
      router.push(redirect)
    }
  }, [user, router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      // Redirect alla pagina di origine o homepage
      const redirect = searchParams.get('redirect') || '/'
      router.push(redirect)
    } else {
      setError(result.error || 'Errore durante il login')
    }
    
    setIsLoading(false)
  }

  // Funzione per pre-compilare credenziali demo
  const fillDemoCredentials = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('demo123')
    setError('')
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Reindirizzamento in corso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna al sito
            </Link>
            
            <h1 className="text-3xl font-bold tracking-tight">Accedi al tuo account</h1>
            <p className="mt-2 text-muted-foreground">
              Benvenuto! Inserisci le tue credenziali per continuare
            </p>
          </div>

          {/* Demo Accounts */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2 mb-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-900">Account Demo Disponibili</h3>
                <p className="text-sm text-blue-700 mt-1">Clicca su un account per auto-compilare le credenziali</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('mario.rossi@email.com')}
                className="w-full text-left p-2 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <div className="font-medium text-blue-900">Mario Rossi</div>
                <div className="text-xs text-blue-700">mario.rossi@email.com</div>
              </button>
              
              <button
                type="button"
                onClick={() => fillDemoCredentials('giulia.verdi@email.com')}
                className="w-full text-left p-2 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <div className="font-medium text-blue-900">Giulia Verdi</div>
                <div className="text-xs text-blue-700">giulia.verdi@email.com</div>
              </button>
              
              <button
                type="button"
                onClick={() => fillDemoCredentials('luca.bianchi@email.com')}
                className="w-full text-left p-2 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <div className="font-medium text-blue-900">Luca Bianchi</div>
                <div className="text-xs text-blue-700">luca.bianchi@email.com</div>
              </button>
            </div>
            
            <p className="text-xs text-blue-600 mt-3 text-center">
              Password per tutti gli account: <strong>demo123</strong>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="La tua email"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="La tua password"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-sm text-red-800">{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3 text-base"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Accedendo...
                </>
              ) : (
                'Accedi'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Questa è una demo del sistema di login.</p>
            <p>In produzione useresti credenziali reali.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-muted">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-8">
            <div className="h-24 w-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-bold text-3xl">M</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Benvenuto in ModernShop</h2>
          <p className="text-muted-foreground mb-6">
            Scopri migliaia di prodotti selezionati, spedizione veloce e 
            un'esperienza d'acquisto senza pari.
          </p>
          
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Spedizione gratuita oltre €50</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Garanzia soddisfatti o rimborsati</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Assistenza clienti 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}