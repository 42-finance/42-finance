import { MaterialIcons } from '@expo/vector-icons'
import { formatDollars, mapAmountFilter, mapNameFilter, mapTransactionAmountType } from 'frontend-utils'
import { TouchableOpacity, View } from 'react-native'
import { Divider, Text, useTheme } from 'react-native-paper'
import { AmountFilter } from 'shared-types'

import { Rule } from '../../../../../libs/frontend-types/src/rule.type'
import { useUserTokenContext } from '../../contexts/user-token.context'

type Props = {
  rule: Rule
  onSelected: (rule: Rule) => void
  index?: number
}

export const RuleItem = ({ rule, onSelected, index }: Props) => {
  const { colors } = useTheme()
  const { currencyCode } = useUserTokenContext()

  return (
    <TouchableOpacity
      onPress={() => {
        onSelected(rule)
      }}
      style={{
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: colors.elevation.level2
      }}
    >
      <>
        {index != null && index > 0 && <Divider style={{ height: 1, backgroundColor: '#082043' }} />}
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            backgroundColor: 'transparent',
            alignItems: 'center',
            padding: 20
          }}
        >
          <View style={{ flex: 1 }}>
            {rule.account && (
              <Text variant="titleMedium">
                If account equals {rule.account.name} (...{rule.account.mask})
              </Text>
            )}
            {rule.amountType && rule.amountFilterType && rule.amountValue != null && (
              <Text variant="titleMedium">
                If transaction is a {mapTransactionAmountType(rule.amountType).toLowerCase()} and the amount is{' '}
                {mapAmountFilter(rule.amountFilterType).toLowerCase()} {formatDollars(rule.amountValue, currencyCode)}
                {rule.amountFilterType === AmountFilter.Between
                  ? ` and ${formatDollars(rule.amountValue2, currencyCode)}`
                  : ''}
              </Text>
            )}
            {rule.category && (
              <Text variant="titleMedium">
                If category equals {rule.category.icon} {rule.category.name}"
              </Text>
            )}
            {rule.merchantValueFilter && rule.merchantName && (
              <Text variant="titleMedium">
                If name {mapNameFilter(rule.merchantValueFilter)} "{rule.merchantName}"
              </Text>
            )}
            {rule.merchantValueFilter && rule.merchantOriginalStatement && (
              <Text variant="titleMedium">
                If original statement {mapNameFilter(rule.merchantValueFilter)} "{rule.merchantOriginalStatement}"
              </Text>
            )}
            <View style={{ marginTop: 5 }} />
            {rule.newMerchantName && (
              <Text variant="bodyMedium" style={{ color: colors.outline }}>
                Rename merchant to {rule.newMerchantName}
              </Text>
            )}
            {rule.newCategory && (
              <Text variant="bodyMedium" style={{ color: colors.outline }}>
                Recategorize to {rule.newCategory.name}
              </Text>
            )}
            {rule.needsReview != null && (
              <Text variant="bodyMedium" style={{ color: colors.outline }}>
                Set review status to {rule.needsReview ? 'needs review' : 'reviewed'}
              </Text>
            )}
            {rule.hideTransaction != null && (
              <Text variant="bodyMedium" style={{ color: colors.outline }}>
                Set transaction visibility to {rule.hideTransaction ? 'hidden' : 'visible'}
              </Text>
            )}
          </View>
          <MaterialIcons name="arrow-forward-ios" size={16} color={colors.onSurface} />
        </View>
      </>
    </TouchableOpacity>
  )
}
