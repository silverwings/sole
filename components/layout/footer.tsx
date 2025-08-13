import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">M</span>
              </div>
              <span className="font-bold text-xl">ModernShop</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Il tuo negozio online di fiducia per prodotti di qualità con un design moderno e user experience eccezionale.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Link Rapidi</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/prodotti" className="text-muted-foreground hover:text-foreground transition-colors">
                  Prodotti
                </Link>
              </li>
              <li>
                <Link href="/categorie" className="text-muted-foreground hover:text-foreground transition-colors">
                  Categorie
                </Link>
              </li>
              <li>
                <Link href="/offerte" className="text-muted-foreground hover:text-foreground transition-colors">
                  Offerte
                </Link>
              </li>
              <li>
                <Link href="/nuovi-arrivi" className="text-muted-foreground hover:text-foreground transition-colors">
                  Nuovi Arrivi
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-semibold">Assistenza</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contatti" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contattaci
                </Link>
              </li>
              <li>
                <Link href="/spedizioni" className="text-muted-foreground hover:text-foreground transition-colors">
                  Spedizioni
                </Link>
              </li>
              <li>
                <Link href="/resi" className="text-muted-foreground hover:text-foreground transition-colors">
                  Resi e Rimborsi
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold">Legale</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/termini" className="text-muted-foreground hover:text-foreground transition-colors">
                  Termini di Servizio
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 ModernShop. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  )
}