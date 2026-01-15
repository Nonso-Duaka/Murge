import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
// @ts-ignore
import murgeLogoImage from '../../assets/murge-logo-final.png';


interface SelectLocationScreenProps {
  companyName: string;
  onSelectLocation: (location: string, imageUrl: string) => void;
  onBack: () => void;
}

interface City {
  id: string;
  name: string;
  count: number;
  imageUrl: string;
}

export function SelectLocationScreen({ companyName, onSelectLocation, onBack }: SelectLocationScreenProps) {
  const [selectedCity, setSelectedCity] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // High-quality black and white city images (simulated with standard grayscale filter in CSS)
  const cities: City[] = [
    {
      id: 'nyc',
      name: 'New York',
      count: 250,
      imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80',
    },
    {
      id: 'sf',
      name: 'San Francisco',
      count: 180,
      imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&q=80',
    },
    {
      id: 'la',
      name: 'Los Angeles',
      count: 120,
      imageUrl: 'https://images.unsplash.com/photo-1534190239940-9ba8944ea261?w=1200&q=80',
    },
    {
      id: 'seattle',
      name: 'Seattle',
      count: 95,
      imageUrl: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=1200&q=80',
    },
    {
      id: 'austin',
      name: 'Austin',
      count: 85,
      imageUrl: 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=1200&q=80',
    },
    {
      id: 'boston',
      name: 'Boston',
      count: 70,
      imageUrl: 'https://images.unsplash.com/photo-1517840545241-b491010a8af4?w=1200&q=80',
    },
  ];

  const handleCitySelect = (cityId: string) => {
    setSelectedCity(cityId);
  };

  const handleContinue = () => {
    const city = cities.find(c => c.id === selectedCity);
    if (city) {
      onSelectLocation(city.name, city.imageUrl);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24 relative">
      {/* Murge Logo Watermark - Consistent with App Overlay */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none">
        <img src={murgeLogoImage} alt="Murge" className="h-12 w-auto opacity-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
      </div>

      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 pb-4">
        <div className="w-full max-w-4xl mx-auto">
          <div
            className={`mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
          >
            {/* Header Controls */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={onBack}
                className="p-2 -ml-2 rounded-full text-foreground/60 hover:text-foreground hover:bg-black/5 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </button>

              {/* Progress Indicators */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-8 h-1 rounded-full bg-foreground"></div>
                  <div className="w-8 h-1 rounded-full bg-foreground"></div>
                  <div className="w-8 h-1 rounded-full bg-muted-foreground/30"></div>
                </div>
                <span className="text-xs text-muted-foreground font-medium tracking-wide">STEP 2 OF 3</span>
              </div>
            </div>

            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
              alt="Google"
              className="h-10 sm:h-12 mb-4 object-contain"
            />
            <p className="text-sm text-muted-foreground">Select your office location</p>
          </div>
        </div>
      </div>

      {/* Cities Grid */}
      <div className="px-4 sm:px-6 flex-1">
        <div className="w-full max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {cities.map((city, index) => {
              const isSelected = selectedCity === city.id;
              return (
                <div
                  key={city.id}
                  className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <button
                    onClick={() => handleCitySelect(city.id)}
                    className={`
                      group relative w-full h-64 rounded-2xl overflow-hidden
                      transition-all duration-500
                      ${isSelected ? 'ring-2 ring-foreground ring-offset-4 ring-offset-background scale-[1.02]' : 'hover:scale-[1.01] hover:shadow-xl'}
                    `}
                  >
                    {/* City Image - grayscale by default, colored on hover if desired, but request asked for bw */}
                    <img
                      src={city.imageUrl}
                      alt={city.name}
                      className={`
                        absolute inset-0 w-full h-full object-cover transition-all duration-700 
                        ${isSelected ? 'grayscale-0 scale-110' : 'grayscale group-hover:grayscale-0 group-hover:scale-105'}
                      `}
                    />

                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />

                    {/* Glass overlay label */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-lg font-medium text-white">{city.name}</h3>

                          {/* Minimal Checkmark instead of radio */}
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-white/80">
                          <span className="font-medium">{city.count}+ relocating</span>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="px-4 sm:px-6 pt-6">
        <div
          className={`w-full max-w-md mx-auto transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <Button
            fullWidth
            size="lg"
            variant="primary"
            onClick={handleContinue}
            disabled={!selectedCity}
            rightIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            }
          >
            Continue
          </Button>
          {selectedCity && (
            <p className="mt-3 text-xs text-center text-gray-400">
              Connecting you with {cities.find((c) => c.id === selectedCity)?.count}+ professionals
            </p>
          )}
        </div>
      </div>
    </div>
  );
}