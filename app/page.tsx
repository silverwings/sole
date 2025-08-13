import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Benvenuto in{' '}
            <span className="text-primary">ModernShop</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Scopri la nostra collezione di prodotti selezionati con cura. 
            Design moderno, qualità superiore, esperienza d'acquisto senza pari.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/prodotti">
              <Button size="lg" className="w-full sm:w-auto">
                Esplora Prodotti
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Scopri di più
            </Button>
          </div>
        </div>
      </section>

      {/* Placeholder sections */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Prodotti in Evidenza</h2>
          <p className="text-muted-foreground mb-8">
            I nostri prodotti più venduti e apprezzati
          </p>
          <div className="h-40 bg-card border border-dashed border-border rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Sezione prodotti in evidenza - In arrivo</p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Perché Scegliere ModernShop</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="space-y-4">
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center mx-auto">
                <span className="text-primary-foreground text-xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold">Spedizione Veloce</h3>
              <p className="text-muted-foreground">
                Consegna in 24-48h su tutto il territorio nazionale
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center mx-auto">
                <span className="text-primary-foreground text-xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold">Garanzia Qualità</h3>
              <p className="text-muted-foreground">
                Tutti i prodotti sono selezionati e garantiti
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center mx-auto">
                <span className="text-primary-foreground text-xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold">Assistenza 24/7</h3>
              <p className="text-muted-foreground">
                Il nostro team è sempre a tua disposizione
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}