import React, { useState, useEffect } from 'react';
import { Waves, Wind, Droplets, Sun, Cloud, CloudRain, Navigation, Search, Fish, Eye, Activity, AlertCircle, RefreshCw } from 'lucide-react';

// Mock data for Alanya, Turkey (36.5444°N, 31.9878°E)
const MOCK_DATA = {
  location: "Alanya, Turkey",
  coords: { latitude: 36.5444, longitude: 31.9878 },
  marine: {
    current: {
      wave_height: 0.8,
      wave_direction: 245,
      wave_period: 4.2,
      swell_wave_height: 0.6
    },
    daily: {
      time: ["2024-12-06", "2024-12-07", "2024-12-08"],
      wave_height_max: [1.2, 0.9, 1.1],
      wave_direction_dominant: [240, 250, 235]
    }
  },
  weather: {
    current: {
      temperature_2m: 18,
      relative_humidity_2m: 65,
      wind_speed_10m: 12,
      wind_direction_10m: 250,
      weather_code: 1,
      cloud_cover: 25
    },
    daily: {
      time: ["2024-12-06", "2024-12-07", "2024-12-08"],
      temperature_2m_max: [20, 19, 21],
      temperature_2m_min: [15, 14, 16],
      uv_index_max: [3.2, 3.5, 3.8]
    }
  }
};

export default function SpearfishingApp() {
  const [location, setLocation] = useState('Alanya');
  const [searchInput, setSearchInput] = useState('Alanya');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const fetchData = async (loc) => {
    setLoading(true);
    setError(null);
    setUsingMockData(false);
    
    try {
      // Fetch coordinates
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(loc)}&count=1&language=en&format=json`
      );
      
      if (!geoRes.ok) throw new Error('GEO_FAILED');
      const geoData = await geoRes.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('LOCATION_NOT_FOUND');
      }
      
      const { latitude, longitude, name, country } = geoData.results[0];
      
      // Fetch marine data
      const marineRes = await fetch(
        `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&current=wave_height,wave_direction,wave_period,swell_wave_height&daily=wave_height_max,wave_direction_dominant&timezone=auto&forecast_days=3`
      );
      
      if (!marineRes.ok) throw new Error('MARINE_FAILED');
      const marineData = await marineRes.json();
      
      // Fetch weather data
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,cloud_cover&daily=temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto&forecast_days=3`
      );
      
      if (!weatherRes.ok) throw new Error('WEATHER_FAILED');
      const weatherData = await weatherRes.json();
      
      setData({
        location: `${name}, ${country}`,
        marine: marineData,
        weather: weatherData,
        coords: { latitude, longitude }
      });
      setError(null);
    } catch (err) {
      console.error('API Error:', err);
      
      // Fallback to mock data for Alanya
      if (loc.toLowerCase().includes('alanya') || loc.toLowerCase().includes('turkey')) {
        setData(MOCK_DATA);
        setUsingMockData(true);
        setError(null);
      } else {
        setError(`Unable to fetch live data. Try "Alanya" to see demo data.`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(location);
  }, [location]);

  const handleSearch = () => {
    if (searchInput.trim() && searchInput.trim() !== location) {
      setLocation(searchInput.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getWeatherIcon = (code) => {
    if (!code || code === 0) return <Sun className="w-8 h-8 text-yellow-300" />;
    if (code <= 3) return <Cloud className="w-8 h-8 text-gray-200" />;
    return <CloudRain className="w-8 h-8 text-blue-200" />;
  };

  const getDirectionArrow = (degrees) => {
    return `rotate(${degrees || 0}deg)`;
  };

  const getSpearfishingConditions = () => {
    if (!data || !data.marine.current || !data.weather.current) return null;
    
    const waveHeight = data.marine.current.wave_height || 0;
    const windSpeed = data.weather.current.wind_speed_10m || 0;
    const cloudCover = data.weather.current.cloud_cover || 50;
    
    let score = 100;
    let conditions = [];
    
    // Wave conditions (most important for spearfishing)
    if (waveHeight > 2.0) {
      score -= 40;
      conditions.push('⚠️ High waves - poor underwater visibility');
    } else if (waveHeight > 1.2) {
      score -= 20;
      conditions.push('⚠️ Moderate waves - visibility affected');
    } else if (waveHeight < 0.5) {
      conditions.push('✅ Calm seas - excellent visibility');
    } else {
      score -= 5;
      conditions.push('✓ Slight waves - good conditions');
    }
    
    // Wind conditions
    if (windSpeed > 25) {
      score -= 30;
      conditions.push('⚠️ Strong winds - unsafe conditions');
    } else if (windSpeed > 15) {
      score -= 15;
      conditions.push('⚠️ Moderate winds - choppy surface');
    } else if (windSpeed < 8) {
      conditions.push('✅ Light winds - perfect for diving');
    }
    
    // Cloud cover affects underwater light
    if (cloudCover < 20) {
      conditions.push('✅ Clear skies - maximum light penetration');
    } else if (cloudCover > 80) {
      score -= 10;
      conditions.push('☁️ Overcast - reduced underwater light');
    }
    
    score = Math.max(0, Math.min(100, score));
    
    let rating = 'Poor';
    let color = 'bg-red-500';
    let emoji = '❌';
    
    if (score >= 85) {
      rating = 'Excellent';
      color = 'bg-green-500';
      emoji = '🎯';
    } else if (score >= 70) {
      rating = 'Good';
      color = 'bg-blue-500';
      emoji = '✓';
    } else if (score >= 50) {
      rating = 'Fair';
      color = 'bg-yellow-500';
      emoji = '⚠️';
    } else if (score >= 30) {
      rating = 'Marginal';
      color = 'bg-orange-500';
      emoji = '⚠️';
    }
    
    return { score, rating, color, emoji, conditions };
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 flex items-center justify-center p-4">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border-2 border-white/30">
          <div className="text-white text-xl mb-3 text-center">Loading conditions...</div>
          <div className="flex justify-center">
            <Waves className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const fishingConditions = data ? getSpearfishingConditions() : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Fish className="w-10 h-10" />
            Spearfishing Conditions
          </h1>
          <p className="text-white/90">Real-time ocean conditions for spearfishing</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Search coastal location..."
              className="w-full px-4 py-3 pr-12 rounded-full bg-white/20 backdrop-blur-md text-white placeholder-white/70 border-2 border-white/30 focus:outline-none focus:border-white/60"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/30 rounded-full hover:bg-white/40 transition"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="text-center mt-3 text-white/70 text-sm">
            Try: Alanya, Bodrum, Antalya, Cyprus, Marmaris
          </div>
        </div>

        {/* Mock Data Notice */}
        {usingMockData && (
          <div className="bg-blue-500/20 backdrop-blur-md border-2 border-blue-300 text-white p-4 rounded-2xl mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold mb-1">📊 Demo Mode</p>
                <p className="text-sm text-white/90">
                  Showing sample data for Alanya. The live API may be blocked by your network or browser.
                </p>
              </div>
              <button 
                onClick={() => fetchData(location)}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
                title="Retry with live data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 backdrop-blur-md border-2 border-red-300 text-white p-5 rounded-2xl mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">{error}</p>
                <p className="text-sm text-white/80 mb-3">The API may be blocked by network restrictions.</p>
                <button 
                  onClick={() => fetchData('Alanya')}
                  className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition text-sm font-medium"
                >
                  Load Alanya Demo Data
                </button>
              </div>
            </div>
          </div>
        )}

        {data && data.marine.current && data.weather.current && (
          <>
            {/* Location Title */}
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              {data.location}
            </h2>

            {/* Conditions Score Card */}
            {fishingConditions && (
              <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 border-2 border-white/30 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-8 h-8 text-white" />
                  <h3 className="text-2xl font-bold text-white">Conditions Rating</h3>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-white text-xl font-bold">
                      {fishingConditions.emoji} {fishingConditions.rating}
                    </span>
                    <span className="text-white text-xl font-bold">{fishingConditions.score}/100</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-5 overflow-hidden">
                    <div 
                      className={`h-full ${fishingConditions.color} transition-all duration-700`}
                      style={{ width: `${fishingConditions.score}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  {fishingConditions.conditions.map((condition, idx) => (
                    <div key={idx} className="text-white/95 text-base">
                      {condition}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {/* Marine Conditions Card */}
              <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 border-2 border-white/30">
                <div className="flex items-center gap-3 mb-6">
                  <Waves className="w-8 h-8 text-white" />
                  <h3 className="text-xl font-bold text-white">Sea State</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-white/70 text-sm mb-1">Wave Height</div>
                    <div className="text-4xl font-bold text-white">
                      {(data.marine.current.wave_height || 0).toFixed(1)}m
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-white/70 text-sm mb-1">Swell Height</div>
                    <div className="text-2xl font-semibold text-white">
                      {(data.marine.current.swell_wave_height || 0).toFixed(1)}m
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-white/70 text-sm mb-1">Wave Period</div>
                    <div className="text-2xl font-semibold text-white">
                      {(data.marine.current.wave_period || 0).toFixed(1)}s
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-white/70 text-sm">Direction</span>
                    <div className="flex items-center gap-2">
                      <Navigation 
                        className="w-6 h-6 text-white" 
                        style={{ transform: getDirectionArrow(data.marine.current.wave_direction) }}
                      />
                      <span className="text-xl font-semibold text-white">
                        {Math.round(data.marine.current.wave_direction || 0)}°
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weather Card */}
              <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 border-2 border-white/30">
                <div className="flex items-center gap-3 mb-6">
                  {getWeatherIcon(data.weather.current.weather_code)}
                  <h3 className="text-xl font-bold text-white">Weather</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-white/70 text-sm mb-1">Temperature</div>
                    <div className="text-4xl font-bold text-white">
                      {Math.round(data.weather.current.temperature_2m || 0)}°C
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm flex items-center gap-2">
                      <Droplets className="w-4 h-4" /> Humidity
                    </span>
                    <span className="text-xl font-semibold text-white">
                      {Math.round(data.weather.current.relative_humidity_2m || 0)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm flex items-center gap-2">
                      <Cloud className="w-4 h-4" /> Cloud Cover
                    </span>
                    <span className="text-xl font-semibold text-white">
                      {Math.round(data.weather.current.cloud_cover || 0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Wind Card */}
              <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 border-2 border-white/30">
                <div className="flex items-center gap-3 mb-6">
                  <Wind className="w-8 h-8 text-white" />
                  <h3 className="text-xl font-bold text-white">Wind</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-white/70 text-sm mb-1">Speed</div>
                    <div className="text-4xl font-bold text-white">
                      {Math.round(data.weather.current.wind_speed_10m || 0)}
                      <span className="text-2xl"> km/h</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-white/70 text-sm">Direction</span>
                    <div className="flex items-center gap-2">
                      <Navigation 
                        className="w-6 h-6 text-white" 
                        style={{ transform: getDirectionArrow(data.weather.current.wind_direction_10m) }}
                      />
                      <span className="text-xl font-semibold text-white">
                        {Math.round(data.weather.current.wind_direction_10m || 0)}°
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-white/10 rounded-xl">
                    <p className="text-white text-sm text-center font-medium">
                      {(data.weather.current.wind_speed_10m || 0) < 10 
                        ? "🎯 Perfect diving weather" 
                        : (data.weather.current.wind_speed_10m || 0) < 20 
                        ? "⚠️ Moderate - use caution" 
                        : "❌ Too windy for diving"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3-Day Forecast */}
            {data.marine.daily && data.weather.daily && (
              <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 border-2 border-white/30">
                <h3 className="text-2xl font-bold text-white mb-4">3-Day Forecast</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {data.marine.daily.time.slice(0, 3).map((date, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white/10 rounded-xl p-5"
                    >
                      <div className="text-white font-bold text-lg mb-3">
                        {new Date(date).toLocaleDateString('en-US', { 
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-white/90">
                          <span>Max Waves</span>
                          <span className="font-bold">
                            {(data.marine.daily.wave_height_max[idx] || 0).toFixed(1)}m
                          </span>
                        </div>
                        <div className="flex justify-between text-white/90">
                          <span>Temp Range</span>
                          <span className="font-bold">
                            {Math.round(data.weather.daily.temperature_2m_min[idx] || 0)}-
                            {Math.round(data.weather.daily.temperature_2m_max[idx] || 0)}°C
                          </span>
                        </div>
                        <div className="flex justify-between text-white/90">
                          <span>UV Index</span>
                          <span className="font-bold">
                            {(data.weather.daily.uv_index_max[idx] || 0).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-white/60 text-sm">
          {usingMockData ? 'Demo Data' : 'Powered by Open-Meteo APIs'}
        </div>
      </div>
    </div>
  );
}
