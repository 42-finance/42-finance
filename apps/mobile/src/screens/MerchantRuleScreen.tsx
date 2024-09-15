import { eventEmitter } from 'frontend-utils'
import { mapNameFilter } from 'frontend-utils/src/mappers/map-name-filter'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { SegmentedButtons } from 'react-native-paper'
import { MerchantFilter, NameFilter } from 'shared-types'

import { PaperPickerField } from '../components/common/PaperPickerField'
import { TextInput } from '../components/common/TextInput'
import { View } from '../components/common/View'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const MerchantRuleScreen = ({ route }: RootStackScreenProps<'MerchantRule'>) => {
  const { merchantValueFilter, merchantName, merchantOriginalStatement } = route.params

  const { control, setValue, watch } = useForm({
    defaultValues: {
      merchantFilter: merchantName
        ? MerchantFilter.Name
        : merchantOriginalStatement
          ? MerchantFilter.OriginalStatement
          : null,
      merchantValueFilter,
      value: merchantName ?? merchantOriginalStatement
    }
  })

  const filter = watch('merchantFilter')
  const nameFilter = watch('merchantValueFilter')
  const value = watch('value')

  useEffect(() => {
    eventEmitter.emit('onMerchantRuleSelected', {
      merchantFilter: filter,
      nameFilter,
      value
    })
  }, [filter, nameFilter, value])

  return (
    <View>
      <SegmentedButtons
        value={filter ?? 'disabled'}
        onValueChange={(value) =>
          value === 'disabled' ? setValue('merchantFilter', null) : setValue('merchantFilter', value as MerchantFilter)
        }
        buttons={[
          {
            value: 'disabled',
            label: 'DISABLED'
            // icon: () => (
            //   <AntDesign
            //     name="closecircleo"
            //     size={16}
            //     color={colors.onSecondaryContainer}
            //     style={{ marginEnd: 4, marginTop: 1 }}
            //   />
            // )
          },
          {
            value: MerchantFilter.Name,
            label: 'NAME'
            // icon: () => (
            //   <AntDesign
            //     name="minuscircleo"
            //     size={16}
            //     color={colors.onSecondaryContainer}
            //     style={{ marginEnd: 4, marginTop: 1 }}
            //   />
            // )
          },
          {
            value: MerchantFilter.OriginalStatement,
            label: 'STATEMENT'
            // icon: () => (
            //   <AntDesign
            //     name="pluscircleo"
            //     size={16}
            //     color={colors.onSecondaryContainer}
            //     style={{ marginEnd: 4, marginTop: 1 }}
            //   />
            // )
          }
        ]}
        style={{ marginHorizontal: 5, marginTop: 5 }}
      />
      {filter && (
        <>
          <PaperPickerField
            label="Filter"
            name="merchantValueFilter"
            control={control}
            items={Object.values(NameFilter).map((n) => ({ label: mapNameFilter(n), value: n }))}
            style={{
              marginTop: 5,
              marginHorizontal: 5
            }}
          />
          <TextInput
            label="Name"
            name="value"
            control={control}
            style={{
              marginTop: 5,
              marginHorizontal: 5
            }}
          />
        </>
      )}
    </View>
  )
}
