import { NextRequest, NextResponse } from 'next/server';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const q = searchParams.get('q');

  if (!OPENWEATHER_API_KEY) {
    return NextResponse.json(
      { error: 'OpenWeather API key not configured' },
      { status: 500 }
    );
  }

  try {
    // Handle reverse geocoding
    if (action === 'reverse' && lat && lon) {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHER_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to reverse geocode');
      }
      
      const data = await response.json();
      if (data && data.length > 0) {
        return NextResponse.json({
          name: data[0].name,
          country: data[0].country,
          state: data[0].state
        });
      } else {
        return NextResponse.json({ error: 'Location not found' }, { status: 404 });
      }
    }

    // Handle city search
    if (action === 'search' && q) {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${OPENWEATHER_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search cities');
      }
      
      const data = await response.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Invalid action or missing parameters' }, { status: 400 });

  } catch (error) {
    console.error('Geocoding API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!OPENWEATHER_API_KEY) {
    return NextResponse.json(
      { error: 'OpenWeather API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { latitude, longitude } = await request.json();

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Fetch current weather
    const currentWeatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (!currentWeatherResponse.ok) {
      throw new Error('Failed to fetch current weather data');
    }

    const currentWeather = await currentWeatherResponse.json();

    // Fetch air quality data
    const airQualityResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`
    );

    if (!airQualityResponse.ok) {
      throw new Error('Failed to fetch air quality data');
    }

    const airQuality = await airQualityResponse.json();

    // Fetch 5-day forecast (includes hourly data)
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (!forecastResponse.ok) {
      throw new Error('Failed to fetch forecast data');
    }

    const forecast = await forecastResponse.json();

    // Process hourly data (next 24 hours)
    const hourlyData = forecast.list.slice(0, 8).map((item: any) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      temperature: Math.round(item.main.temp),
      humidity: item.main.humidity,
      precipitation: item.pop * 100 // Probability of precipitation as percentage
    }));

    // Process daily forecast (next 7 days)
    const dailyData = [];
    const processedDates = new Set();
    
    for (const item of forecast.list) {
      const date = new Date(item.dt * 1000).toDateString();
      if (!processedDates.has(date) && dailyData.length < 7) {
        processedDates.add(date);
        dailyData.push({
          date: new Date(item.dt * 1000).toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          }),
          high: Math.round(item.main.temp_max),
          low: Math.round(item.main.temp_min),
          condition: item.weather[0].main,
          icon: item.weather[0].icon,
          precipitation: item.pop * 100,
          windSpeed: item.wind.speed
        });
      }
    }

    // Calculate AQI components
    const aqi = airQuality.list[0];
    const aqiComponents = {
      aqi: aqi.main.aqi,
      pm25: aqi.components.pm2_5,
      pm10: aqi.components.pm10,
      no2: aqi.components.no2,
      o3: aqi.components.o3,
      co: aqi.components.co
    };

    const result = {
      location: `${currentWeather.name}, ${currentWeather.sys.country}`,
      date: new Date().toISOString(),
      temperature: Math.round(currentWeather.main.temp),
      feels_like: Math.round(currentWeather.main.feels_like),
      humidity: currentWeather.main.humidity,
      pressure: currentWeather.main.pressure,
      wind_speed: currentWeather.wind?.speed || 0,
      wind_direction: currentWeather.wind?.deg || 0,
      visibility: currentWeather.visibility ? currentWeather.visibility / 1000 : null, // Convert to km
      weather_description: currentWeather.weather[0].description,
      weather_icon: currentWeather.weather[0].icon,
      air_quality: aqiComponents.aqi,
      air_quality_components: {
        pm2_5: aqiComponents.pm25,
        pm10: aqiComponents.pm10,
        no2: aqiComponents.no2,
        o3: aqiComponents.o3,
        co: aqiComponents.co
      },
      predictions: {
        temperature_trend: calculateTemperatureTrend(forecast),
        air_quality_trend: 0, // Would need historical data for real trend
        precipitation_probability: currentWeather.clouds?.all || 0
      },
      hourly_forecast: hourlyData,
      daily_forecast: dailyData,
      source: "OpenWeather API"
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}

function calculateTemperatureTrend(forecastData: any): number {
  if (!forecastData.list || forecastData.list.length < 2) return 0
  
  const currentTemp = forecastData.list[0].main.temp
  const futureTemp = forecastData.list[1].main.temp
  return Math.round((futureTemp - currentTemp) * 10) / 10
}

function processHourlyForecast(forecastData: any) {
  return forecastData.list.slice(0, 8).map((item: any) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }),
    temp: Math.round(item.main.temp),
    feels_like: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
    precipitation: item.pop * 100, // Convert to percentage
    weather: item.weather[0].description,
    icon: item.weather[0].icon
  }))
}

function processDailyForecast(forecastData: any) {
  const dailyData: { [key: string]: any[] } = {}
  
  // Group by day
  forecastData.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000).toDateString()
    if (!dailyData[date]) {
      dailyData[date] = []
    }
    dailyData[date].push(item)
  })

  // Process each day
  return Object.entries(dailyData).slice(0, 7).map(([date, items]) => {
    const temps = items.map((item: any) => item.main.temp)
    const precipitation = items.reduce((sum: number, item: any) => sum + item.pop, 0) / items.length * 100
    
    return {
      day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      date: date,
      temp_high: Math.round(Math.max(...temps)),
      temp_low: Math.round(Math.min(...temps)),
      precipitation: Math.round(precipitation),
      weather: items[Math.floor(items.length / 2)].weather[0].description,
      icon: items[Math.floor(items.length / 2)].weather[0].icon
    }
  })
}
