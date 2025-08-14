"use client"

import { Button } from '@/components/ui/button'
import { useState, useEffect, use } from 'react'
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock, MapPin, CreditCard, Download, Phone } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface OrderDetail {
  id: string
  orderNumber: string
  userId: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  orderDate: string
  deliveryDate?: string
  shippedDate?: string
  estimatedDelivery?: string
  cancelledDate?: string
  cancelReason?: string
  items: Array<{
    productId: string
    productName: string
    variant: string
    quantity: number
    unitPrice: number
    totalPrice: number
    image: string
  }>
  subtotal: number
  shipping: {
    method: string
    name: string
    cost: number
    trackingNumber?: string
  }
  tax: number
  total: number
  paymentMethod: {
    type: string
    name: string
    last4?: string
    email?: string
    reference?: string
  }
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    zipCode: string
    province: string
    country: string
    phone: string
  }
  notes?: string
}

interface OrderDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const resolvedParams = use(params)
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/profilo')
      return
    }
    loadOrderDetail()
  }, [user, router, resolvedParams.id])

  const loadOrderDetail = async () => {
    try {
      setLoading(true)
      const response = await fetch('/data/orders.json')
      const data = await response.json()
      
      const foundOrder = data.orders.find((o: OrderDetail) => o.id === resolvedParams.id)
      
      if (!foundOrder) {
        setError('Ordine non trovato')
        return
      }
      
      // Verifica che l'ordine appartenga all'utente corrente
      if (foundOrder.userId !== user?.id) {
        setError('Non autorizzato a visualizzare questo ordine')
        return
      }
      
      setOrder(foundOrder)
    } catch (err) {
      setError('Errore nel caricamento del dettaglio ordine')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-orange-500" />
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Reindirizzamento...</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Caricamento dettaglio ordine...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Errore</h1>
          <p className="text-muted-foreground mb-6">{error || 'Ordine non trovato'}</p>
          <Link href="/profilo?tab=orders">
            <Button>Torna agli Ordini</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link href="/profilo?tab=orders" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Ordine #{order.orderNumber}</h1>
          <p className="text-muted-foreground">Effettuato il {formatDate(order.orderDate)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status */}
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center space-x-3 mb-4">
              {getStatusIcon(order.status)}
              <div>
                <h2 className="text-xl font-semibold">{getStatusText(order.status)}</h2>
                <p className="text-sm text-muted-foreground">
                  Stato dell'ordine aggiornato il {formatDate(order.orderDate)}
                </p>
              </div>
            </div>

            {/* Status Details */}
            {order.status === 'shipped' && order.shippedDate && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 font-medium">Spedito il {formatDate(order.shippedDate)}</p>
                {order.shipping.trackingNumber && (
                  <p className="text-blue-600 text-sm">
                    Codice di tracking: <span className="font-mono">{order.shipping.trackingNumber}</span>
                  </p>
                )}
                {order.estimatedDelivery && (
                  <p className="text-blue-600 text-sm">
                    Consegna prevista: {formatDate(order.estimatedDelivery)}
                  </p>
                )}
              </div>
            )}

            {order.status === 'delivered' && order.deliveryDate && (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800 font-medium">Consegnato il {formatDate(order.deliveryDate)}</p>
              </div>
            )}

            {order.status === 'cancelled' && order.cancelledDate && (
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-800 font-medium">Cancellato il {formatDate(order.cancelledDate)}</p>
                {order.cancelReason && (
                  <p className="text-red-600 text-sm">Motivo: {order.cancelReason}</p>
                )}
              </div>
            )}
          </div>

          {/* Items */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Articoli Ordinati</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-muted-foreground">IMG</span>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium">{item.productName}</h4>
                    {item.variant && (
                      <p className="text-sm text-muted-foreground">{item.variant}</p>
                    )}
                    <p className="text-sm text-muted-foreground">Quantità: {item.quantity}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">€{item.totalPrice.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">€{item.unitPrice.toFixed(2)} cad.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Indirizzo di Spedizione</h3>
            </div>
            
            <div className="text-sm">
              <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.zipCode} {order.shippingAddress.city} ({order.shippingAddress.province})</p>
              <p>{order.shippingAddress.country}</p>
              <p className="flex items-center mt-2">
                <Phone className="h-4 w-4 mr-1" />
                {order.shippingAddress.phone}
              </p>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Note</h3>
              <p className="text-muted-foreground">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Riepilogo Ordine</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotale</span>
                <span>€{order.subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Spedizione</span>
                <span>{order.shipping.cost === 0 ? 'Gratuita' : `€${order.shipping.cost.toFixed(2)}`}</span>
              </div>
              
              <div className="flex justify-between">
                <span>IVA</span>
                <span>€{order.tax.toFixed(2)}</span>
              </div>
              
              <hr />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Totale</span>
                <span>€{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Metodo di Pagamento</h3>
            </div>
            
            <div className="text-sm">
              <p className="font-medium">{order.paymentMethod.name}</p>
              {order.paymentMethod.last4 && (
                <p className="text-muted-foreground">**** **** **** {order.paymentMethod.last4}</p>
              )}
              {order.paymentMethod.email && (
                <p className="text-muted-foreground">{order.paymentMethod.email}</p>
              )}
              {order.paymentMethod.reference && (
                <p className="text-muted-foreground">Ref: {order.paymentMethod.reference}</p>
              )}
            </div>
          </div>

          {/* Shipping Method */}
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center space-x-2 mb-4">
              <Truck className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Spedizione</h3>
            </div>
            
            <div className="text-sm">
              <p className="font-medium">{order.shipping.name}</p>
              {order.shipping.trackingNumber && (
                <p className="text-muted-foreground font-mono text-xs mt-2">
                  Tracking: {order.shipping.trackingNumber}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Scarica Fattura
            </Button>
            
            {order.status === 'delivered' && (
              <Button variant="outline" className="w-full">
                Lascia Recensione
              </Button>
            )}
            
            {(order.status === 'pending' || order.status === 'processing') && (
              <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                Richiedi Cancellazione
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}