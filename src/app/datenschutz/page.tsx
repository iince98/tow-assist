import { Shield, Database, MapPin, Mail, Phone, User, Trash2, Eye } from 'lucide-react'

export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">Datenschutzerklärung</h1>
          <p className="text-xl text-gray-600">Informationen zur Erhebung und Verarbeitung Ihrer Daten</p>
        </div>

        <div className="pro-card rounded-3xl p-8 space-y-8">
          {/* Einleitung */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Verantwortlicher</h2>
            <p className="text-gray-700 leading-relaxed">
              Verantwortlich für die Datenverarbeitung auf dieser Website ist der Betreiber der Pannenhilfe- und Abschleppdienst-Plattform. 
              Kontaktdaten finden Sie im Impressum.
            </p>
          </section>

          {/* Erhobene Daten */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Welche Daten wir erheben</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Standortdaten</h3>
                </div>
                <p className="text-blue-800 text-sm">
                  GPS-Koordinaten und Adressinformationen zur Vermittlung des nächstgelegenen Fahrers
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold text-green-900">Kontaktdaten</h3>
                </div>
                <p className="text-green-800 text-sm">
                  Telefonnummern für die Kommunikation zwischen Kunden und Fahrern
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <User className="w-6 h-6 text-purple-600" />
                  <h3 className="font-semibold text-purple-900">Personenbezogene Daten</h3>
                </div>
                <p className="text-purple-800 text-sm">
                  Namen und Kontaktinformationen aus Kontakt- und Partnerformularen
                </p>
              </div>

              <div className="bg-yellow-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Database className="w-6 h-6 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-900">Nutzungsdaten</h3>
                </div>
                <p className="text-yellow-800 text-sm">
                  Informationen über genutzte Dienste und Service-Anfragen
                </p>
              </div>
            </div>
          </section>

          {/* Zweck der Verarbeitung */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Zweck der Datenverarbeitung</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Vermittlung von Pannenhilfe- und Abschleppdiensten</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Kommunikation zwischen Kunden und Dienstleistern</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Verarbeitung von Kontakt- und Partneranfragen</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Verbesserung unserer Dienstleistungen</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Dritt-Dienstleister */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Eingesetzte Dienstleister</h2>
            <div className="space-y-4">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Supabase</h3>
                <p className="text-gray-600 text-sm">
                  Datenbankdienst zur Speicherung der Anwendungsdaten. Serverstandort: EU.
                </p>
              </div>
              
              <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Google Maps</h3>
                <p className="text-gray-600 text-sm">
                  Zur Standortermittlung und Kartendarstellung. Es werden GPS-Daten und Adressinformationen verarbeitet.
                </p>
              </div>
              
              <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Resend</h3>
                <p className="text-gray-600 text-sm">
                  E-Mail-Dienst für Benachrichtigungen und Kontaktformulare.
                </p>
              </div>
              
              <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Vercel</h3>
                <p className="text-gray-600 text-sm">
                  Hosting-Plattform für die Webanwendung.
                </p>
              </div>
            </div>
          </section>

          {/* Aufbewahrungsdauer */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Aufbewahrungsdauer</h2>
            <div className="bg-orange-50 rounded-xl p-6">
              <ul className="space-y-3 text-orange-800">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Service-Anfragen:</strong> 6 Monate nach Abschluss</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Kontaktformulare:</strong> 12 Monate</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Partneranfragen:</strong> 24 Monate</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Standortdaten:</strong> Unmittelbar nach Serviceerbringung gelöscht</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Betroffenenrechte */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Ihre Rechte</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold text-green-900">Auskunftsrecht</h3>
                </div>
                <p className="text-green-800 text-sm">
                  Sie haben das Recht, Auskunft über die zu Ihrer Person gespeicherten Daten zu erhalten.
                </p>
              </div>

              <div className="bg-red-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Trash2 className="w-6 h-6 text-red-600" />
                  <h3 className="font-semibold text-red-900">Löschungsrecht</h3>
                </div>
                <p className="text-red-800 text-sm">
                  Sie können die Löschung Ihrer personenbezogenen Daten verlangen.
                </p>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 rounded-xl p-6">
              <p className="text-blue-800">
                <strong>Kontakt für Datenschutzanfragen:</strong><br />
                Für die Ausübung Ihrer Rechte oder bei Fragen zum Datenschutz wenden Sie sich bitte an die im Impressum angegebenen Kontaktdaten.
              </p>
            </div>
          </section>

          {/* SSL-Verschlüsselung */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Datensicherheit</h2>
            <div className="bg-green-50 rounded-xl p-6">
              <p className="text-green-800">
                Diese Website verwendet SSL-Verschlüsselung (HTTPS) zum Schutz Ihrer Daten. 
                Alle übertragenen Daten werden verschlüsselt und sind vor unbefugtem Zugriff geschützt.
              </p>
            </div>
          </section>

          {/* Änderungsvorbehalt */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Änderungen dieser Datenschutzerklärung</h2>
            <p className="text-gray-700">
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte rechtliche Anforderungen 
              oder bei Änderungen unseres Dienstes anzupassen.
            </p>
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