import { mapDateRangeFilter } from 'frontend-utils'
import { Chip } from 'react-native-paper'
import { DateRangeFilter } from 'shared-types'

import { View } from './View'

type Props = {
  selectedDateRangeFilter: DateRangeFilter
  onSelected: (dateRangeFilter: DateRangeFilter) => void
}

export const DateRangePicker: React.FC<Props> = ({ selectedDateRangeFilter, onSelected }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        marginTop: -5,
        marginHorizontal: 10
      }}
    >
      {Object.values(DateRangeFilter).map((type) => (
        <Chip
          key={type}
          onPress={() => onSelected(type)}
          theme={{ roundness: 20 }}
          style={{
            padding: 2,
            ...(selectedDateRangeFilter === type ? {} : { backgroundColor: 'transparent' })
          }}
          textStyle={{ fontWeight: 'bold', fontSize: 12 }}
        >
          {mapDateRangeFilter(type).toUpperCase()}
        </Chip>
      ))}
    </View>
  )
}
