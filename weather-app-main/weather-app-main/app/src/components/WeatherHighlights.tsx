import type { CurrentConditions, WeatherData } from '../types/weather'

interface WeatherHighlightsProps {
  current: CurrentConditions
  units: WeatherData['units']
}

export function WeatherHighlights({ current, units }: WeatherHighlightsProps) {
  const highlights = [
    {
      label: 'Feels like',
      value: `${Math.round(current.apparentTemperature)}${units.temperature}`,
      
    },
    {
      label: 'Humidity',
      value: `${current.humidity}%`,
      
    },
    {
      label: 'Wind',
      value: `${Math.round(current.windSpeed)} ${units.wind}`,
      
    },
    {
      label: 'Precipitation',
      value: `${current.precipitation.toFixed(1)} ${units.precipitation}`,
      
    },
  ]

  return (
    <section className="space-y-3 sm:space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-300 sm:text-sm">
        Today&apos;s overview
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {highlights.map((item) => (
          <article
            key={item.label}
            className="rounded-2xl bg-[#111538] p-3 text-neutral-0 shadow-[0_10px_30px_rgba(4,6,26,0.45)] ring-1 ring-[#1d2148] sm:p-4"
          >
            <p className="text-xs text-neutral-300 sm:text-sm">{item.label}</p>
            <p className="mt-1.5 text-2xl font-semibold sm:mt-2 sm:text-3xl">{item.value}</p>
           
            {item.label === 'Humidity' && (
              <div className="mt-3 sm:mt-4">
               
                
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

