"use client"

import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { User, Package, Mail, Phone, MapPin, Calendar, Edit, Eye, Truck, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Order {
  id: string
  orderNumber: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  orderDate: string
  total: number
  items: Array<{
    productName: string
    quantity: number
    unitPrice: number
  }>
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  // Redirect se non loggato
  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/profilo')
      return
    }
    loadUserOrders()
  }, [user, router])

  const loadUserOrders = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const response = await fetch('/data/orders.json')
      const data = await response.json()
      
      // Filtra ordini dell'utente corrente
      const userOrders = data.orders.filter((order: any) => order.userId === user.id)
      setOrders(userOrders)
    } catch (error) {
      console.error('Errore nel caricamento ordini:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />
      case 'processing':
        return <Package className="h-4 w-4 text-blue-500" />
      case 'shipped':
        return <Truck className="h-4 w-4 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'In Attesa'
      case 'processing':
        return 'In Lavorazione'
      case 'shipped':
        return 'Spedito'
      case 'delivered':
        return 'Consegnato'
      case 'cancelled':
        return 'Cancellato'
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Loading state mentre si verifica l'utente
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Reindirizzamento...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Il mio Profilo</h1>
        <p className="text-muted-foreground">Gestisci il tuo account e visualizza i tuoi ordini</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'profile'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
            }`}
          >
            <User className="h-4 w-4 inline mr-2" />
            Dati Personali
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'orders'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
            }`}
          >
            <Package className="h-4 w-4 inline mr-2" />
            I miei Ordini
            {orders.length > 0 && (
              <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                {orders.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Info */}
            <div className="bg-card p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Informazioni Personali</h2>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifica
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-muted-foreground">Nome completo</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-muted-foreground">Email</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{user.phone}</p>
                    <p className="text-sm text-muted-foreground">Telefono</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{formatDate(user.dateOfBirth)}</p>
                    <p className="text-sm text-muted-foreground">Data di nascita</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Addresses */}
            <div className="bg-card p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Indirizzi</h2>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Gestisci
                </Button>
              </div>
              
              <div className="space-y-4">
                {user.addresses.map((address) => (
                  <div key={address.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium capitalize">{address.type}</span>
                        {address.isDefault && (
                          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded">
                            Predefinito
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground ml-6">
                      <p>{address.firstName} {address.lastName}</p>
                      {address.company && <p>{address.company}</p>}
                      <p>{address.address}</p>
                      <p>{address.zipCode} {address.city} ({address.province})</p>
                      <p>{address.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-card p-6 rounded-lg border lg:col-span-2">
              <h2 className="text-xl font-semibold mb-6">Informazioni Account</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Membro dal</p>
                  <p className="font-medium">{formatDate(user.registrationDate)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ultimo accesso</p>
                  <p className="font-medium">{formatDate(user.lastLogin)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Newsletter</p>
                  <p className="font-medium">{user.preferences.newsletter ? 'Attiva' : 'Disattiva'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">SMS</p>
                  <p className="font-medium">{user.preferences.sms ? 'Attivo' : 'Disattivo'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">I miei Ordini</h2>
              <p className="text-sm text-muted-foreground">
                {orders.length} ordini totali
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Caricamento ordini...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nessun ordine</h3>
                <p className="text-muted-foreground mb-6">Non hai ancora effettuato nessun ordine</p>
                <Link href="/prodotti">
                  <Button>Inizia a fare Shopping</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-card border rounded-lg p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                        {getStatusIcon(order.status)}
                        <div>
                          <h3 className="font-semibold">Ordine #{order.orderNumber}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.orderDate)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold">€{order.total.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            {getStatusText(order.status)}
                          </p>
                        </div>
                        
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/profilo/ordini/${order.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Dettagli
                          </Link>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        {order.items.length} articoli
                      </p>
                      
                      <div className="space-y-1">
                        {order.items.slice(0, 2).map((item, index) => (
                          <p key={index} className="text-sm">
                            {item.quantity}x {item.productName}
                          </p>
                        ))}
                        
                        {order.items.length > 2 && (
                          <p className="text-sm text-muted-foreground">
                            +{order.items.length - 2} altri articoli
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}