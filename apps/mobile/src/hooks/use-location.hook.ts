import * as Location from 'expo-location'
import { useEffect, useState } from 'react'

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null)

  useEffect(() => {
    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setLocation(null)
        return
      }

      const fetchedLocation = await Location.getCurrentPositionAsync({})
      setLocation(fetchedLocation)
    }
    fetchLocation()
  }, [])

  return location
}
