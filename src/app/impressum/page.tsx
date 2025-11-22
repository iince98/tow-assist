import { Building, MapPin, Phone, Mail, Shield } from 'lucide-react'

export default function Impressum() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">Impressum</h1>
          <p className="text-xl text-gray-600">Angaben gemäß § 5 TMG</p>
        </div>

        <div className="pro-card rounded-3xl p-8 space-y-8">
          {/* Unternehmensinformationen */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Betreiber und Kontakt</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-yellow-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Building className="w-6 h-6 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-900">Unternehmen</h3>
                </div>
                <div className="space-y-2 text-yellow-800">
                  <p className="font-bold text-lg">Road Help GmbH</p>
                  <p>Kottwitzstraße 51</p>
                  <p>20253 Hamburg</p>
                  <p>Deutschland</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-6 h-6 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Kontakt</h3>
                </div>
                <div className="space-y-2 text-blue-800">
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <a href="tel:+491703814443" className="hover:text-blue-600 transition-colors">
                      +49 170 3814443
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <a href="mailto:info@roadhelp.de" className="hover:text-blue-600 transition-colors">
                      info@roadhelp.de
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Rechtsinformationen */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Rechtliche Informationen</h2>
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Handelsregister</h3>
                <p className="text-gray-700">Amtsgericht Hamburg<br />HRB 123456</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Umsatzsteuer-ID</h3>
                <p className="text-gray-700">DE123456789</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Verantwortlich für den Inhalt</h3>
                <p className="text-gray-700">Geschäftsführung Road Help GmbH</p>
              </div>
            </div>
          </section>

          {/* Streitbeilegung */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Streitbeilegung</h2>
            <div className="bg-green-50 rounded-xl p-6">
              <p className="text-green-800 mb-4">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-600 ml-1">
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
              <p className="text-green-800">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>
          </section>

          {/* Haftungshinweis */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Haftung für Inhalte</h2>
            <div className="bg-red-50 rounded-xl p-6">
              <p className="text-red-800">
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. 
                Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen 
                zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
            </div>
          </section>

          {/* Urheberrecht */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Urheberrecht</h2>
            <div className="bg-purple-50 rounded-xl p-6">
              <p className="text-purple-800">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. 
                Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes 
                bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </div>
          </section>

          {/* Datenschutz */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Datenschutz</h2>
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Informationen zum Datenschutz</h3>
              </div>
              <p className="text-blue-800">
                Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. 
                Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder E-Mail-Adressen) erhoben werden, 
                erfolgt dies, soweit möglich, stets auf freiwilliger Basis.
              </p>
              <div className="mt-4">
                <a href="/datenschutz" className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  <Shield className="w-4 h-4" />
                  Zur Datenschutzerklärung
                </a>
              </div>
            </div>
          </section>

          {/* Stand */}
          <div className="bg-gray-100 rounded-xl p-6 text-center">
            <p className="text-gray-600 text-sm">
              Stand: {new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}