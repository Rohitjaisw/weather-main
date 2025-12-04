import type { CurrentConditions, LocationMatch, WeatherData } from '../types/weather'

interface CurrentWeatherCardProps {
  location: LocationMatch
  current: CurrentConditions
  units: WeatherData['units']
}

export function CurrentWeatherCard({ location, current }: CurrentWeatherCardProps) {
  const dateCopy = new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date(current.observationTime))

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#4F5BFB] via-[#5f45f4] to-[#2f4bf1] px-8 py-6 text-neutral-0 shadow-[0_20px_60px_rgba(40,45,140,0.45)] sm:rounded-[32px] sm:px-10 sm:py-8">
      {/* Glow overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_55%)] opacity-60" />

      {/* Main row: left = location, center = icon, right = temp */}
      <div className="relative flex h-56 items-center sm:h-64 md:h-72">
        {/* LEFT: location info, centered vertically, aligned to left */}
        <div className="flex w-1/3 flex-col justify-center">
          <h1 className="font-display text-2xl font-semibold sm:text-3xl md:text-4xl">
            {location.name}
          </h1>
          <p className="mt-1 text-sm text-blue-100 sm:text-base">
            {location.admin1 ? `${location.admin1}, ` : ''}
            {location.country}
          </p>
          <p className="mt-1 text-xs text-blue-100 sm:text-sm">
            {dateCopy}
          </p>
        </div>

        {/* CENTER: icon, centered vertically & horizontally in its third */}
        <div className="flex w-1/3 justify-center">
          <img
            src={current.icon}
            alt={current.label}
            className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28"
            loading="lazy"
          />
        </div>

        {/* RIGHT: big temperature, centered vertically, right aligned */}
        <div className="flex w-1/3 items-center justify-end pr-2 sm:pr-4">
          <p className="font-display leading-none text-[4.5rem] sm:text-[5.5rem] md:text-[6.5rem] lg:text-[7.5rem]">
            {Math.round(current.temperature)}
          </p>
        </div>
      </div>
    </section>
  )
}
