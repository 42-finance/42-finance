import { DisplayPreference } from 'frontend-types'

export const mapDisplayPreference = (value: DisplayPreference) => {
  switch (value) {
    case DisplayPreference.Dark:
      return 'Dark'
    case DisplayPreference.Light:
      return 'Light'
    case DisplayPreference.System:
      return 'System'
  }
}
