import { format } from 'date-fns-tz'

export const getTimeZones = () => {
  const timezones = [
    'America/Vancouver',
    'America/Cambridge_Bay',
    'America/Creston',
    'America/Dawson',
    'America/Dawson_Creek',
    'America/Edmonton',
    'America/Fort_Nelson',
    'America/Inuvik',
    'America/Whitehorse',
    'America/Yellowknife',
    'America/Rainy_River',
    'America/Rankin_Inlet',
    'America/Regina',
    'America/Resolute',
    'America/Swift_Current',
    'America/Winnipeg',
    'America/Atikokan',
    'America/Iqaluit',
    'America/Nipigon',
    'America/Pangnirtung',
    'America/Thunder_Bay',
    'America/Toronto',
    'America/Blanc-Sablon',
    'America/Glace_Bay',
    'America/Goose_Bay',
    'America/Halifax',
    'America/Moncton',
    'America/St_Johns',
    'America/Adak',
    'Pacific/Honolulu',
    'America/Anchorage',
    'America/Juneau',
    'America/Metlakatla',
    'America/Nome',
    'America/Sitka',
    'America/Yakutat',
    'America/Los_Angeles',
    'America/Boise',
    'America/Denver',
    'America/Phoenix',
    'America/Chicago',
    'America/Indiana/Knox',
    'America/Indiana/Tell_city',
    'America/Menominee',
    'America/North_Dakota/Beulah',
    'America/North_Dakota/Center',
    'America/North_Dakota/New_Salem',
    'America/Detroit',
    'America/Indiana/Indianapolis',
    'America/Indiana/Marengo',
    'America/Indiana/Petersburg',
    'America/Indiana/Vevay',
    'America/Indiana/Vincennes',
    'America/Indiana/Winamac',
    'America/Kentucky/Louisville',
    'America/Kentucky/Monticello',
    'America/New_York',
  ]

  return [
    { label: 'Default', value: '' },
    ...timezones
      .reduce(
        (acc, timezone) => {
          const label = formatTimezone(timezone)
          if (acc.some((a) => a.label === label)) return acc
          return [
            ...acc,
            {
              label,
              value: timezone,
            },
          ]
        },
        [] as { label: string; value: string }[]
      )
      .sort((a, b) => {
        if (a.label < b.label) {
          return -1
        }
        return a.label > b.label ? 1 : 0
      }),
  ]
}

export const formatTimezone = (timezone: string) =>
  format(new Date(), 'zzzz', {
    timeZone: timezone,
  }).split(' ')[0]

// The earliest data record in the system
export const EARLIEST_DATE_IN_SYSTEM = new Date('2020-09-30')

export const LATEST_DATE_IN_SYSTEM = new Date('2080-01-01')
