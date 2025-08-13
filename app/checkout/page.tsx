"use client"

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { CreditCard, Truck, MapPin, User, Lock } from 'lucide-react'

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
    paymentMethod: 'card'
  })

  const cartItems = [
    {
      id: '1',
      name: 'Smartphone Premium XYZ',
      price: 899.99,
      quantity: 1,
      color: 'Nero'
    },
    {
      id: '2',
      name: 'Cuffie Wireless Pro',
      price: 299.99,
      quantity: 2,
      color: 'Bianco'
    }
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 0 // Free shipping
  const tax = subtotal * 0.22
  const total = subtotal + shipping + tax

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleCompleteOrder = () => {
    // Logic for completing the order
    alert('Ordine completato con successo!')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[
            { number: 1, label: 'Contatto' },
            { number: 2, label: 'Spedizione' },
            { number: 3, label: 'Pagamento' }
          ].map((stepInfo, index) => (
            <div key={stepInfo.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepInfo.number
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {stepInfo.number}
                </div>
                <span className="text-xs mt-1 text-center">{stepInfo.label}</span>
              </div>
              {index < 2 && (
                <div
                  className={`w-12 h-0.5 mx-4 ${
                    step > stepInfo.number ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Contact & Shipping */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">Informazioni di Contatto</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="tua@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Telefono *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+39 xxx xxx xxxx"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg border">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">Indirizzo di Spedizione</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nome *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Cognome *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Indirizzo *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Via, numero civico"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Città *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">CAP *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="00000"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Shipping Method */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border">
                <div className="flex items-center space-x-2 mb-4">
                  <Truck className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">Metodo di Spedizione</h2>
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      defaultChecked
                      className="text-primary"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Spedizione Standard</span>
                        <span className="text-green-600 font-medium">Gratuita</span>
                      </div>
                      <p className="text-sm text-muted-foreground">3-5 giorni lavorativi</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      className="text-primary"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Spedizione Express</span>
                        <span className="font-medium">€9.99</span>
                      </div>
                      <p className="text-sm text-muted-foreground">1-2 giorni lavorativi</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <input
                      type="radio"
                      name="shipping"
                      value="next-day"
                      className="text-primary"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Consegna Giorno Successivo</span>
                        <span className="font-medium">€19.99</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Consegna entro 24h</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border">
                <div className="flex items-center space-x-2 mb-4">
                  <CreditCard className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">Metodo di Pagamento</h2>
                </div>
                
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      defaultChecked
                      className="text-primary"
                    />
                    <CreditCard className="h-4 w-4" />
                    <span>Carta di Credito/Debito</span>
                  </label>
                  
                  <div className="pl-7 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Numero Carta *</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Scadenza *</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="MM/AA"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">CVV *</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Nome sulla Carta *</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Nome Cognome"
                      />
                    </div>
                  </div>
                  
                  <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      className="text-primary"
                    />
                    <div className="h-4 w-4 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">P</span>
                    </div>
                    <span>PayPal</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank-transfer"
                      className="text-primary"
                    />
                    <div className="h-4 w-4 bg-gray-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">🏦</span>
                    </div>
                    <span>Bonifico Bancario</span>
                  </label>
                </div>

                {/* Terms and Conditions */}
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      className="mt-0.5"
                      required
                    />
                    <div className="text-sm">
                      <p>Accetto i <a href="/termini" className="text-primary hover:underline">Termini e Condizioni</a> e la <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a></p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              size="lg"
            >
              Indietro
            </Button>
            
            {step < 3 ? (
              <Button onClick={nextStep} size="lg">
                Continua
              </Button>
            ) : (
              <Button size="lg" className="px-8" onClick={handleCompleteOrder}>
                <Lock className="h-4 w-4 mr-2" />
                Completa Ordine
              </Button>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card p-6 rounded-lg border sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Riepilogo Ordine</h2>
            
            {/* Cart Items */}
            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.color} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <hr className="my-4" />
            
            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotale</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Spedizione</span>
                <span className="text-green-600">Gratuita</span>
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

            {/* Security Notice */}
            <div className="mt-6 p-3 bg-muted/50 rounded-md">
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-green-600" />
                <span className="text-xs">Pagamento sicuro SSL</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Protezione acquirente</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Dati crittografati</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Garanzia rimborso</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}