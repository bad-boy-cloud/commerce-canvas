import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Search, MapPin, Navigation, Crosshair } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { KAMAKIS_COORDS, LocationCoords } from '../types/marketplace';
import { toast } from 'sonner';

// Fix Leaflet marker icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
  onLocationSelect: (coords: LocationCoords) => void;
  onClose: () => void;
  initialCoords?: LocationCoords | null;
}

function MapEvents({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export function LocationPicker({ onLocationSelect, onClose, initialCoords }: LocationPickerProps) {
  const [coords, setCoords] = useState<LocationCoords>(initialCoords || KAMAKIS_COORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([coords.lat, coords.lng]);

  const handleMapClick = async (lat: number, lng: number) => {
    setCoords({ lat, lng });
    setMapCenter([lat, lng]);
    
    // Reverse geocode to get name
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await response.json();
      if (data && data.display_name) {
        setCoords({ lat, lng, name: data.display_name });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      // Limit search to Kenya
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ', Kenya')}&limit=1`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newCoords = { lat: parseFloat(lat), lng: parseFloat(lon), name: display_name };
        setCoords(newCoords);
        setMapCenter([newCoords.lat, newCoords.lng]);
      } else {
        toast.error('Location not found. Please try a different search.');
      }
    } catch (error) {
      toast.error('Error searching for location.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    onLocationSelect(coords);
    onClose();
    toast.success('Delivery location updated');
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await handleMapClick(latitude, longitude);
        setIsLoading(false);
      },
      (error) => {
        toast.error('Unable to retrieve your location');
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="flex flex-col h-[70vh] sm:h-[500px] w-full gap-4">
      <div className="flex flex-col gap-2">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <Input
            placeholder="Search for your delivery address..."
            className="pl-10 pr-24 h-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            type="submit" 
            className="absolute right-1 top-1 h-10" 
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </form>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleCurrentLocation}
          >
            <Crosshair className="mr-2 h-4 w-4" />
            Use Current Location
          </Button>
        </div>
      </div>

      <div className="relative flex-1 rounded-lg overflow-hidden border bg-muted group">
        <MapContainer 
          center={mapCenter} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeView center={mapCenter} />
          <MapEvents onMapClick={handleMapClick} />
          <Marker position={[coords.lat, coords.lng]} icon={DefaultIcon} />
        </MapContainer>
        
        <div className="absolute bottom-4 left-4 right-4 z-[1000] pointer-events-none">
          <div className="bg-background/95 backdrop-blur p-3 rounded-lg border shadow-lg pointer-events-auto">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Selected Location</p>
                <p className="text-sm font-medium line-clamp-2">
                  {coords.name || 'Click on map or search for an address'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-4 right-4 z-[1000]">
          <div className="flex flex-col gap-2">
            <div className="bg-background p-2 rounded shadow border text-xs font-bold">
              Bolt-style GPS Delivery
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleConfirm} className="flex-1 h-12 text-lg font-bold">
          Confirm Location
        </Button>
      </div>
    </div>
  );
}
