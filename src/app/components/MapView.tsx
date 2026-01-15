import React, { useState, useRef, useEffect } from 'react';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  price: number;
  title: string;
  image?: string;
  beds?: number;
  baths?: number;
}

interface MapViewProps {
  markers: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  selectedMarkerId?: string;
}

// San Francisco neighborhoods with approximate coordinates
const sfNeighborhoods = [
  { name: 'Mission District', lat: 37.759, lng: -122.419 },
  { name: 'SoMa', lat: 37.778, lng: -122.405 },
  { name: 'Castro', lat: 37.762, lng: -122.435 },
  { name: 'Marina', lat: 37.803, lng: -122.436 },
  { name: 'Hayes Valley', lat: 37.776, lng: -122.424 },
  { name: 'Nob Hill', lat: 37.793, lng: -122.416 },
  { name: 'Pacific Heights', lat: 37.792, lng: -122.435 },
  { name: 'Haight-Ashbury', lat: 37.770, lng: -122.446 },
];

export function MapView({
  markers,
  onMarkerClick,
  center = { lat: 37.7749, lng: -122.4194 },
  zoom = 12,
  selectedMarkerId,
}: MapViewProps) {
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  // Convert lat/lng to pixel position
  const latLngToPixel = (lat: number, lng: number) => {
    const mapWidth = mapRef.current?.clientWidth || 400;
    const mapHeight = mapRef.current?.clientHeight || 400;

    const scale = Math.pow(2, mapZoom - 10);
    const x = ((lng - mapCenter.lng) * scale * 100 + mapWidth / 2) + offset.x;
    const y = (-(lat - mapCenter.lat) * scale * 120 + mapHeight / 2) + offset.y;

    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.map-marker')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(prev + 1, 16));
  };

  const handleZoomOut = () => {
    setMapZoom(prev => Math.max(prev - 1, 10));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="relative w-full h-full min-h-[400px] bg-gray-100 rounded-2xl overflow-hidden">
      {/* Map Container */}
      <div
        ref={mapRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          background: `
            linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 50%, #e8e8e8 100%),
            repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(0,0,0,0.03) 50px, rgba(0,0,0,0.03) 51px),
            repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0,0,0,0.03) 50px, rgba(0,0,0,0.03) 51px)
          `,
        }}
      >
        {/* Neighborhood Labels */}
        {sfNeighborhoods.map((hood) => {
          const pos = latLngToPixel(hood.lat, hood.lng);
          return (
            <div
              key={hood.name}
              className="absolute text-[10px] font-medium text-gray-400 uppercase tracking-wider pointer-events-none select-none"
              style={{
                left: pos.x,
                top: pos.y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {hood.name}
            </div>
          );
        })}

        {/* Map Markers */}
        {markers.map((marker) => {
          const pos = latLngToPixel(marker.lat, marker.lng);
          const isSelected = marker.id === selectedMarkerId;
          const isHovered = marker.id === hoveredMarker;

          return (
            <div
              key={marker.id}
              className="map-marker absolute"
              style={{
                left: pos.x,
                top: pos.y,
                transform: 'translate(-50%, -100%)',
                zIndex: isSelected || isHovered ? 100 : 10,
              }}
            >
              {/* Price Tag */}
              <button
                onClick={() => onMarkerClick?.(marker)}
                onMouseEnter={() => setHoveredMarker(marker.id)}
                onMouseLeave={() => setHoveredMarker(null)}
                className={`relative transition-all duration-200 ${
                  isSelected || isHovered ? 'scale-110' : 'scale-100'
                }`}
              >
                <div
                  className={`px-3 py-1.5 rounded-full font-bold text-sm shadow-lg transition-all ${
                    isSelected
                      ? 'bg-black text-white'
                      : isHovered
                      ? 'bg-gray-800 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  {formatPrice(marker.price)}
                </div>
                {/* Pin */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent transition-all ${
                    isSelected
                      ? 'border-t-black'
                      : isHovered
                      ? 'border-t-gray-800'
                      : 'border-t-white'
                  }`}
                />
              </button>

              {/* Hover Card */}
              {(isHovered || isSelected) && marker.image && (
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-in"
                  style={{ zIndex: 200 }}
                >
                  <img
                    src={marker.image}
                    alt={marker.title}
                    className="w-full h-28 object-cover"
                  />
                  <div className="p-3">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{marker.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      {marker.beds && <span>{marker.beds} bd</span>}
                      {marker.baths && <span>{marker.baths} ba</span>}
                    </div>
                    <p className="font-bold text-black mt-1">{formatPrice(marker.price)}/mo</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Zoom Controls */}
      <div className="absolute right-4 top-4 flex flex-col gap-1 z-50">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
      </div>

      {/* Map Attribution */}
      <div className="absolute bottom-2 left-2 text-[10px] text-gray-400 bg-white/80 px-2 py-1 rounded">
        Murge Maps
      </div>

      {/* Compass */}
      <div className="absolute left-4 top-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
        <div className="relative w-6 h-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-0.5 h-full bg-gray-300" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-0.5 w-full bg-gray-300" />
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0.5 text-[8px] font-bold text-red-500">
            N
          </div>
        </div>
      </div>
    </div>
  );
}

// Fullscreen map modal component
interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  markers: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
  selectedMarkerId?: string;
}

export function MapModal({
  isOpen,
  onClose,
  markers,
  onMarkerClick,
  selectedMarkerId,
}: MapModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="absolute inset-4 bg-white rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">Housing Map</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="absolute inset-0 pt-16">
          <MapView
            markers={markers}
            onMarkerClick={onMarkerClick}
            selectedMarkerId={selectedMarkerId}
          />
        </div>
      </div>
    </div>
  );
}
