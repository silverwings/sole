import { Button } from '@/components/ui/button'
import { QuickAddButton } from '@/components/ui/quick-add-button'
import Link from 'next/link'
import { Filter, Grid3X3, List } from 'lucide-react'

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tutti i Prodotti</h1>
          <p className="text-muted-foreground">
            Scopri la nostra intera collezione di prodotti
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtri
          </Button>
          <div className="flex border rounded-md">
            <Button variant="ghost" size="sm" className="rounded-r-none">
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="rounded-l-none border-l">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Sidebar & Products Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filtri */}
        <aside className="lg:w-64">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-4">Filtri</h3>
            
            {/* Categorie */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Categorie</h4>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Elettronica</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Abbigliamento</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Casa e Giardino</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Sport e Tempo Libero</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Bellezza e Salute</span>
                  </label>
                </div>
              </div>

              {/* Prezzo */}
              <div>
                <h4 className="font-medium mb-2">Prezzo</h4>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="price" className="rounded" />
                    <span>Sotto €50</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="price" className="rounded" />
                    <span>€50 - €100</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="price" className="rounded" />
                    <span>€100 - €200</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="price" className="rounded" />
                    <span>Oltre €200</span>
                  </label>
                </div>
              </div>

              {/* Brand */}
              <div>
                <h4 className="font-medium mb-2">Brand</h4>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Apple</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Samsung</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Nike</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Adidas</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Sony</span>
                  </label>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="font-medium mb-2">Valutazione</h4>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>⭐⭐⭐⭐⭐ 5 stelle</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>⭐⭐⭐⭐ 4+ stelle</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>⭐⭐⭐ 3+ stelle</span>
                  </label>
                </div>
              </div>

              {/* Disponibilità */}
              <div>
                <h4 className="font-medium mb-2">Disponibilità</h4>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Disponibile subito</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Spedizione gratuita</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>In offerta</span>
                  </label>
                </div>
              </div>
            </div>

            <Button className="w-full mt-6" variant="outline" size="sm">
              Cancella Filtri
            </Button>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Mostrando 12 di 240 prodotti
            </p>
            <select className="border rounded-md px-3 py-2 text-sm bg-background">
              <option>Ordina per: Rilevanza</option>
              <option>Prezzo: Dal più basso</option>
              <option>Prezzo: Dal più alto</option>
              <option>Più recenti</option>
              <option>Più venduti</option>
              <option>Migliori recensioni</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }, (_, i) => {
              const price = Math.random() * 200 + 20
              const product = {
                id: (i + 1).toString(),
                name: getProductName(i),
                price: price,
                image: `/placeholder-image-${i + 1}.jpg`
              }
              
              return (
                <div key={i + 1} className="group">
                  <Link href={`/prodotti/${i + 1}`}>
                    <div className="cursor-pointer">
                      <div className="bg-muted rounded-lg aspect-square mb-4 flex items-center justify-center group-hover:bg-muted/80 transition-colors relative overflow-hidden">
                        <span className="text-muted-foreground">Prodotto {i + 1}</span>
                        
                        {/* Badge offerta casuale */}
                        {Math.random() > 0.7 && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            -20%
                          </div>
                        )}
                        
                        {/* Badge nuovo arrivo casuale */}
                        {Math.random() > 0.8 && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            Nuovo
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium mb-1 group-hover:text-primary transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {getProductDescription(i)}
                        </p>
                        
                        {/* Rating */}
                        <div className="flex items-center space-x-1">
                          <div className="flex text-yellow-400 text-sm">
                            {'★'.repeat(Math.floor(Math.random() * 2) + 4)}
                            {'☆'.repeat(5 - (Math.floor(Math.random() * 2) + 4))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({Math.floor(Math.random() * 200) + 10})
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">
                        €{product.price.toFixed(2)}
                      </span>
                      {Math.random() > 0.7 && (
                        <span className="text-sm text-muted-foreground line-through">
                          €{(product.price + Math.random() * 50).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <QuickAddButton 
                      product={product}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Precedente
              </Button>
              <Button variant="default" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                ...
              </Button>
              <Button variant="outline" size="sm">
                20
              </Button>
              <Button variant="outline" size="sm">
                Successivo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions per generare nomi e descrizioni prodotti realistici
function getProductName(index: number): string {
  const products = [
    "Smartphone Premium Pro Max",
    "Cuffie Wireless Noise Cancelling",
    "Smartwatch Fitness Tracker",
    "Laptop UltraBook 15.6\"",
    "Tablet Android 10.1\"",
    "Speaker Bluetooth Portatile",
    "Camera Digitale Mirrorless",
    "Gaming Mouse RGB",
    "Mechanical Keyboard",
    "Webcam HD 1080p",
    "Power Bank 20000mAh",
    "Caricatore Wireless Fast Charge"
  ]
  
  return products[index % products.length]
}

function getProductDescription(index: number): string {
  const descriptions = [
    "Display OLED 6.7\", processore octa-core, tripla fotocamera con AI",
    "Audio di qualità superiore con cancellazione attiva del rumore",
    "Monitor frequenza cardiaca, GPS, resistente all'acqua",
    "Intel i7, 16GB RAM, SSD 512GB, schermo 4K",
    "Android 13, 8GB RAM, schermo 2K, stylus inclusa",
    "Suono stereo cristallino, 12 ore di autonomia",
    "Sensore APS-C, 4K video, stabilizzazione ottica",
    "16000 DPI, illuminazione RGB personalizzabile",
    "Switch meccanici, retroilluminazione, layout italiano",
    "Auto-focus, microfono integrato, compatibile PC/Mac",
    "Ricarica rapida, display LED, porte multiple",
    "Qi-certified, ricarica rapida 15W, design elegante"
  ]
  
  return descriptions[index % descriptions.length]
}