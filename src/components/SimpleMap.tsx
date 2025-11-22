'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Driver, Location } from '@/types'
import { Car, Navigation, MapPin, ZoomIn, ZoomOut } from 'lucide-react'

interface SimpleMapProps {
  userLocation: Location
  drivers: Driver[]
  selectedDriver: Driver | null
  onDriverSelect: (driver: Driver) => void
  height?: string
}

// Map styling configuration - keeping it outside to avoid recreating on each render
const MAP_STYLING: google.maps.MapTypeStyle[] = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#f5f5f5" }]
  },
  {
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#616161" }]
  },
  {
    "elementType": "labels.text.stroke", 
    "stylers": [{ "color": "#f5f5f5" }]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#bdbdbd" }]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{ "color": "#eeeeee" }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{ "color": "#e5e5e5" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#ffffff" }]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{ "color": "#fde047" }] // Nice yellow for highways
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#616161" }]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [{ "color": "#e5e5e5" }]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [{ "color": "#eeeeee" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#e0f2fe" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  }
]

export default function SimpleMap({ 
  userLocation, 
  drivers, 
  selectedDriver, 
  onDriverSelect, 
  height = '500px' 
}: SimpleMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null)
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false)
  const [loadingError, setLoadingError] = useState<string | null>(null)
  
  // Keep track of map elements for cleanup
  const mapMarkers = useRef<google.maps.Marker[]>([])
  const serviceAreaCircles = useRef<google.maps.Circle[]>([])
  const openInfoWindows = useRef<google.maps.InfoWindow[]>([])
  const activeListeners = useRef<google.maps.MapsEventListener[]>([])

  // Clean up all map elements - important for memory management
  const clearMapElements = useCallback(() => {
    console.log('Cleaning up existing map elements...')
    
    // Remove event listeners first
    activeListeners.current.forEach(listener => {
      if (listener?.remove) {
        listener.remove()
      }
    })
    activeListeners.current = []
    
    // Clear markers
    mapMarkers.current.forEach(marker => {
      if (marker) {
        google.maps.event.clearInstanceListeners(marker)
        marker.setMap(null)
      }
    })
    mapMarkers.current = []
    
    // Clear service area circles
    serviceAreaCircles.current.forEach(circle => {
      if (circle) {
        circle.setMap(null)
      }
    })
    serviceAreaCircles.current = []
    
    // Close info windows
    openInfoWindows.current.forEach(infoWindow => {
      if (infoWindow) {
        infoWindow.close()
      }
    })
    openInfoWindows.current = []
    
    // Clear map listeners if map exists
    if (mapInstance) {
      google.maps.event.clearInstanceListeners(mapInstance)
    }
  }, [mapInstance])

  // Initialize Google Maps API
  const initializeGoogleMaps = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if Google Maps script already exists
      const existingMapScript = document.querySelector('script[src*="maps.googleapis.com"]')
      if (existingMapScript) {
        // Script exists, wait for it to load
        let checkCounter = 0
        const maxChecks = 60 // Wait up to 6 seconds
        const loadingCheck = setInterval(() => {
          checkCounter++
          if (window.google?.maps) {
            clearInterval(loadingCheck)
            setIsGoogleMapsLoaded(true)
            resolve()
          } else if (checkCounter >= maxChecks) {
            clearInterval(loadingCheck)
            reject(new Error('Google Maps loading timeout'))
          }
        }, 100)
        return
      }

      // Create and load the script
      const googleMapsScript = document.createElement('script')
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=marker,places`
      googleMapsScript.async = true
      googleMapsScript.defer = true
      
      googleMapsScript.onload = () => {
        // Give it a moment to fully initialize
        setTimeout(() => {
          setIsGoogleMapsLoaded(true)
          resolve()
        }, 150) // Slightly longer delay for stability
      }
      
      googleMapsScript.onerror = () => {
        reject(new Error('Google Maps script failed to load'))
      }
      
      document.head.appendChild(googleMapsScript)
    })
  }, [])

  // Create the actual map instance
  const setupMap = useCallback(() => {
    if (!mapContainerRef.current || !window.google?.maps) {
      console.error('Map container or Google Maps API not available')
      return null
    }

    try {
      const mapConfiguration: google.maps.MapOptions = {
        zoom: 13,
        center: {
          lat: userLocation.latitude,
          lng: userLocation.longitude
        },
        styles: MAP_STYLING,
        zoomControl: false, // We'll add custom controls
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
        clickableIcons: false,
        gestureHandling: "greedy", // Better mobile experience
      }

      const newMap = new google.maps.Map(mapContainerRef.current, mapConfiguration)
      
      // Ensure proper initialization with a delay
      setTimeout(() => {
        google.maps.event.trigger(newMap, 'resize')
        newMap.setCenter({
          lat: userLocation.latitude,
          lng: userLocation.longitude
        })
      }, 250) // Adjusted timing
      
      return newMap
    } catch (error) {
      console.error('Map creation failed:', error)
      setLoadingError('Map initialization failed')
      return null
    }
  }, [userLocation.latitude, userLocation.longitude])

  // Main map initialization effect
  useEffect(() => {
    const setupMapInstance = async () => {
      if (!mapContainerRef.current) return

      try {
        // Clean up existing map elements
        clearMapElements()

        // Check if Google Maps is already available
        if (window.google?.maps) {
          const map = setupMap()
          setMapInstance(map)
          return
        }

        // Load Google Maps API
        await initializeGoogleMaps()
        const map = setupMap()
        setMapInstance(map)
        
      } catch (error) {
        console.error('Google Maps initialization error:', error)
        setLoadingError('Google Maps konnte nicht geladen werden. Bitte laden Sie die Seite neu.')
      }
    }

    setupMapInstance()

    // Cleanup when component unmounts
    return () => {
      clearMapElements()
    }
  }, [clearMapElements, setupMap, initializeGoogleMaps])

  // Update map markers when data changes
  useEffect(() => {
    if (!mapInstance || !isGoogleMapsLoaded) return

    console.log('Updating map with new driver data...')

    // Clear existing elements first
    clearMapElements()

    // Add user location indicator
    const userLocationCircle = new google.maps.Circle({
      strokeColor: '#3B82F6',
      strokeOpacity: 0.5,
      strokeWeight: 2,
      fillColor: '#3B82F6',
      fillOpacity: 0.15,
      map: mapInstance,
      center: {
        lat: userLocation.latitude,
        lng: userLocation.longitude
      },
      radius: 750 // Slightly smaller radius
    })
    serviceAreaCircles.current.push(userLocationCircle)

    // User location marker
    const userPositionMarker = new google.maps.Marker({
      position: {
        lat: userLocation.latitude,
        lng: userLocation.longitude
      },
      map: mapInstance,
      title: 'Ihr aktueller Standort',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12, // Slightly larger
        fillColor: '#3B82F6',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 3,
      },
    })
    mapMarkers.current.push(userPositionMarker)

    // Process available drivers
    drivers.forEach((driverData) => {
      if (!driverData.available) return

      const isCurrentlySelected = driverData.id === selectedDriver?.id
      
      // Driver position marker
      const driverPositionMarker = new google.maps.Marker({
        position: {
          lat: driverData.latitude,
          lng: driverData.longitude
        },
        map: mapInstance,
        title: driverData.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: isCurrentlySelected ? '#10B981' : '#EF4444',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
      })

      // Driver service area
      const driverServiceArea = new google.maps.Circle({
        strokeColor: isCurrentlySelected ? '#10B981' : '#EF4444',
        strokeOpacity: 0.4,
        strokeWeight: 1,
        fillColor: isCurrentlySelected ? '#10B981' : '#EF4444',
        fillOpacity: 0.12,
        map: mapInstance,
        center: {
          lat: driverData.latitude,
          lng: driverData.longitude
        },
        radius: 2800 // Slightly smaller service area
      })

      // Create detailed info window content
      const infoPopupContent = `
        <div class="bg-white rounded-xl shadow-xl border-2 ${isCurrentlySelected ? 'border-green-500' : 'border-red-500'} max-w-sm">
          <div class="bg-gradient-to-r ${isCurrentlySelected ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} p-4 rounded-t-xl">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white bg-opacity-25 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h4.05a2.5 2.5 0 014.9 0H20a1 1 0 001-1v-4a1 1 0 00-.293-.707l-4-4A1 1 0 0016 4H3z"/>
                </svg>
              </div>
              <div class="flex-1">
                <div class="font-bold text-white text-xl">${driverData.name}</div>
                <div class="text-white text-opacity-95 text-sm">${driverData.vehicleType}</div>
              </div>
              ${isCurrentlySelected ? `
                <div class="bg-white bg-opacity-20 text-white px-3 py-1 rounded-lg text-xs font-bold">
                  GEWÄHLT
                </div>
              ` : ''}
            </div>
          </div>
          <div class="p-5 space-y-4">
            <div class="grid grid-cols-3 gap-3 text-center">
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-yellow-600 font-bold text-base">${driverData.rating}/5</div>
                <div class="text-gray-500 text-xs">Bewertung</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-green-600 font-bold text-base">${driverData.distance}km</div>
                <div class="text-gray-500 text-xs">Entfernung</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-blue-600 font-bold text-base">${driverData.estimatedArrival}min</div>
                <div class="text-gray-500 text-xs">Ankunft</div>
              </div>
            </div>
            <div class="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-4 text-center">
              <div class="text-white font-bold text-xl">Ab ${driverData.basePrice}€</div>
              <div class="text-yellow-50 text-sm">Grundpreis inklusive Anfahrt</div>
            </div>
            <div class="text-gray-600 text-sm leading-relaxed">
              ${driverData.description}
            </div>
            <button onclick="window.chooseDriver('${driverData.id}')" 
              class="w-full bg-gradient-to-r ${isCurrentlySelected ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} hover:opacity-90 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
              ${isCurrentlySelected ? '✓ Bereits gewählt' : 'Diesen Fahrer wählen'}
            </button>
          </div>
        </div>
      `

      // Info window instance
      const driverInfoWindow = new google.maps.InfoWindow({
        content: infoPopupContent,
        maxWidth: 320
      })

      // Marker click handler
      const markerClickListener = driverPositionMarker.addListener('click', () => {
        // Close any open info windows first
        openInfoWindows.current.forEach(window => window.close())
        driverInfoWindow.open(mapInstance, driverPositionMarker)
      })
      activeListeners.current.push(markerClickListener)

      mapMarkers.current.push(driverPositionMarker)
      serviceAreaCircles.current.push(driverServiceArea)
      openInfoWindows.current.push(driverInfoWindow)
    })

    console.log(`Added ${mapMarkers.current.length - 1} driver markers to map`)

  }, [mapInstance, isGoogleMapsLoaded, drivers, selectedDriver, userLocation, clearMapElements])

  // Driver selection handler for info window buttons
  useEffect(() => {
    const handleDriverChoice = (driverId: string) => {
      const chosenDriver = drivers.find(d => d.id === driverId)
      if (chosenDriver) {
        onDriverSelect(chosenDriver)
        // Close info windows after selection
        openInfoWindows.current.forEach(window => window.close())
      }
    }

    // Attach to global window for info window access
    window.selectDriver = handleDriverChoice

    return () => {
      // Clean up global function reference
window.selectDriver = undefined as unknown as (driverId: string) => void
    }
  }, [drivers, onDriverSelect])

  // Map control functions
  const centerOnUserLocation = useCallback(() => {
    if (mapInstance) {
      mapInstance.panTo({
        lat: userLocation.latitude,
        lng: userLocation.longitude
      })
      mapInstance.setZoom(13) // Reset zoom level too
    }
  }, [mapInstance, userLocation.latitude, userLocation.longitude])

  const increaseZoom = useCallback(() => {
    if (mapInstance) {
      const currentZoom = mapInstance.getZoom() || 13
      mapInstance.setZoom(currentZoom + 1)
    }
  }, [mapInstance])

  const decreaseZoom = useCallback(() => {
    if (mapInstance) {
      const currentZoom = mapInstance.getZoom() || 13
      mapInstance.setZoom(currentZoom - 1)
    }
  }, [mapInstance])

  // Error display
  if (loadingError) {
    return (
      <div className="w-full bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center border-2 border-red-400 shadow-xl" style={{ height }}>
        <div className="text-center p-8 max-w-md">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-800 font-bold text-xl mb-3">Karte nicht verfügbar</p>
          <p className="text-red-600 mb-6 leading-relaxed">{loadingError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Seite neu laden
          </button>
        </div>
      </div>
    )
  }

  // Loading display
  if (!isGoogleMapsLoaded) {
    return (
      <div className="w-full bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl flex items-center justify-center border-2 border-yellow-400 shadow-xl" style={{ height }}>
        <div className="text-center p-6">
          <div className="relative mb-6">
            <div className="w-20 h-20 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Car className="w-7 h-7 text-yellow-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-800 font-semibold text-xl mb-2">Karte lädt...</p>
          <p className="text-gray-600 text-sm">Standort wird vorbereitet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full relative group">
      <div 
        ref={mapContainerRef}
        className="w-full rounded-2xl overflow-hidden shadow-xl border-4 border-yellow-500 transition-all duration-300 group-hover:border-yellow-600 group-hover:shadow-2xl"
        style={{ height, minHeight: '450px' }} // Slightly larger minimum height
      />
      
      {/* Custom map controls */}
      <div className="absolute top-5 right-5 flex flex-col gap-2 shadow-xl">
        <button
          onClick={centerOnUserLocation}
          className="bg-white hover:bg-gray-50 rounded-xl p-4 border border-gray-300 hover:border-yellow-500 transition-all duration-200 transform hover:scale-110 shadow-lg group/btn"
          title="Zu Ihrem Standort springen"
        >
          <Navigation className="w-5 h-5 text-blue-600 group-hover/btn:text-blue-700 transition-colors" />
        </button>
        
        <div className="bg-white rounded-xl border border-gray-300 overflow-hidden shadow-lg">
          <button
            onClick={increaseZoom}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors border-b border-gray-300"
            title="Hineinzoomen"
          >
            <ZoomIn className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={decreaseZoom}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors"
            title="Herauszoomen"
          >
            <ZoomOut className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Map legend */}
      <div className="absolute bottom-5 left-5 bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-gray-200">
        <div className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-yellow-600" />
          Kartenlegende
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm border-2 border-white"></div>
            <span className="text-gray-700 font-medium">Ihr Standort</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm border-2 border-white"></div>
            <span className="text-gray-700 font-medium">Verfügbare Fahrer</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm border-2 border-white"></div>
            <span className="text-gray-700 font-medium">Gewählter Fahrer</span>
          </div>
        </div>
      </div>

      {/* Driver availability indicator */}
      <div className="absolute top-5 left-5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl px-5 py-3 shadow-xl border border-green-400">
        <div className="flex items-center gap-3 text-sm font-semibold">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-sm"></div>
          <span>{drivers.filter(driver => driver.available).length} Fahrer in Ihrer Nähe</span>
        </div>
      </div>
    </div>
  )
}