import { useEffect, useState } from 'react'
import { SearchForm } from './components/SearchForm'
import { UnitsMenu } from './components/UnitsMenu'
import { CurrentWeatherCard } from './components/CurrentWeatherCard'
import { WeatherHighlights } from './components/WeatherHighlights'
import { DailyForecast } from './components/DailyForecast'
import { HourlyForecast } from './components/HourlyForecast'
import { SkeletonState } from './components/SkeletonState'
import { fetchWeatherForecast, geocodeLocation } from './lib/weather'
import type { LocationMatch, MeasurementSystem, WeatherData } from './types/weather'

type SearchStatus = 'idle' | 'loading' | 'error' | 'no-results'

const DEFAULT_LOCATION: LocationMatch = {
  id: '5391959',
  name: 'San Francisco',
  admin1: 'California',
  country: 'United States',
  latitude: 37.7749,
  longitude: -122.4194,
  timezone: 'America/Los_Angeles',
}

function App() {
  const [searchTerm, setSearchTerm] = useState(
    `${DEFAULT_LOCATION.name}, ${DEFAULT_LOCATION.country}`,
  )
  const [searchResults, setSearchResults] = useState<LocationMatch[]>([])
  const [searchStatus, setSearchStatus] = useState<SearchStatus>('idle')
  const [searchError, setSearchError] = useState<string | null>(null)

  const [selectedLocation, setSelectedLocation] =
    useState<LocationMatch>(DEFAULT_LOCATION)
  const [units, setUnits] = useState<MeasurementSystem>('metric')

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [weatherStatus, setWeatherStatus] =
    useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [weatherError, setWeatherError] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const handleLocationSelection = (location: LocationMatch) => {
    setSelectedLocation(location)
    setSearchTerm(
      `${location.name}${location.country ? `, ${location.country}` : ''}`,
    )
    setSearchStatus('idle')
  }

  const handleSearch = async () => {
    const query = searchTerm.trim()
    if (!query) {
      setSearchStatus('no-results')
      setSearchResults([])
      setWeatherData(null)
      return
    }

    setSearchStatus('loading')
    setSearchError(null)
    try {
      const results = await geocodeLocation(query)
      if (results.length === 0) {
        setSearchResults([])
        setSearchStatus('no-results')
        setWeatherData(null)
        return
      }
      setSearchResults(results)
      handleLocationSelection(results[0])
    } catch (error) {
      setSearchStatus('error')
      setSearchError(error instanceof Error ? error.message : 'Unknown error')
    }
  }

  useEffect(() => {
    let isActive = true
    const fetchWeather = async () => {
      if (!selectedLocation) return
      setWeatherStatus('loading')
      setWeatherError(null)
      try {
        const data = await fetchWeatherForecast(selectedLocation, units)
        if (!isActive) return
        setWeatherData(data)
        setSelectedDay(data.dayOrder[0] ?? null)
        setWeatherStatus('ready')
      } catch (error) {
        if (!isActive) return
        setWeatherStatus('error')
        setWeatherError(
          error instanceof Error ? error.message : 'Unable to load forecast',
        )
      }
    }
    fetchWeather()
    return () => {
      isActive = false
    }
  }, [selectedLocation, units])

  return (
    <div className="min-h-screen bg-[#050723] bg-gradient-to-b from-[#070A2C] via-[#050723] to-[#050723] py-6 text-neutral-0 sm:py-12">
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:gap-8 md:gap-10 md:px-8">
        <nav className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src="/assets/images/logo.svg" alt="Weather Now" className="h-6 w-auto sm:h-8" />
          </div>
          <UnitsMenu value={units} onChange={setUnits} />
        </nav>

        <section className="space-y-5 text-center sm:space-y-6">
          <h1 className="font-display text-3xl font-semibold leading-tight text-neutral-0 sm:text-3xl md:text-4xl">
            How&apos;s the sky looking today?
          </h1>
          <div className="mx-auto w-full max-w-2xl">
            <SearchForm
              value={searchTerm}
              onChange={setSearchTerm}
              onSubmit={handleSearch}
              isSearching={searchStatus === 'loading'}
              status={searchStatus}
              error={searchError}
              results={searchResults}
              onSelectResult={(location) => {
                handleLocationSelection(location)
                setSearchResults([])
              }}
              statusChip={searchStatus === 'loading' ? 'Search in progress' : null}
            />
          </div>
          {searchStatus === 'no-results' && !weatherData && (
            <div className="flex items-center justify-center pt-2">
              <p className="text-lg font-medium text-neutral-0">
                No search result found!
              </p>
            </div>
          )}
        </section>

        {weatherStatus === 'error' && (
          <div className="rounded-3xl bg-red-500/10 p-6 text-red-100 ring-1 ring-red-500/40">
            <p className="font-semibold">We couldn&apos;t load the forecast.</p>
            <p className="text-sm">{weatherError}</p>
            <button
              type="button"
              onClick={() => handleLocationSelection(selectedLocation)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-400/50 px-4 py-2 text-sm font-semibold text-red-100 hover:bg-red-500/10"
            >
              <img
                src="/assets/images/icon-retry.svg"
                alt=""
                className="size-4"
                aria-hidden
              />
              Try again
            </button>
          </div>
        )}

        {weatherStatus === 'loading' && <SkeletonState />}

        {weatherStatus === 'ready' && weatherData && (
          <section className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-8">
            <div className="flex flex-col gap-6">
              <CurrentWeatherCard
                location={weatherData.location}
                current={weatherData.current}
                units={weatherData.units}
              />
              <WeatherHighlights current={weatherData.current} units={weatherData.units} />
              <DailyForecast
                days={weatherData.daily}
                units={weatherData.units}
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
              />
            </div>
            <HourlyForecast
              dayOrder={weatherData.dayOrder}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              hourlyByDay={weatherData.hourlyByDay}
              units={weatherData.units}
            />
          </section>
        )}

       
      </main>
    </div>
  )
}

export default App
