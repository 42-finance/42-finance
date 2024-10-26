import { Ionicons } from '@expo/vector-icons'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, deleteAccountGroup, getAccountGroup } from 'frontend-api'
import { formatAccountBalance, formatDateDifference, mapAccountGroupType, mapAccountSubType } from 'frontend-utils'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { Button, Dialog, Divider, Portal, ProgressBar, Text, useTheme } from 'react-native-paper'
import { DateRangeFilter } from 'shared-types'

import { AccountIcon } from '../components/account/AccountIcon'
import { DateRangePicker } from '../components/common/DateRangePicker'
import { NoData } from '../components/common/NoData'
import { View } from '../components/common/View'
import { NetWorthGraph } from '../components/stats/NetWorthGraph'
import { useUserTokenContext } from '../contexts/user-token.context'
import { useActionSheet } from '../hooks/use-action-sheet.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const AccountGroupScreen = ({ route, navigation }: RootStackScreenProps<'AccountGroup'>) => {
  const { accountGroupId } = route.params

  const showActionSheet = useActionSheet()
  const { colors } = useTheme()
  const queryClient = useQueryClient()
  const { currencyCode } = useUserTokenContext()

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)
  const [selectedDateRangeFilter, setSelectedDateRangeFilter] = useState<DateRangeFilter>(DateRangeFilter.OneMonth)

  const { data: accountGroup, isFetching: fetching } = useQuery({
    queryKey: [ApiQuery.AccountGroup, accountGroupId],
    queryFn: async () => {
      const res = await getAccountGroup(accountGroupId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    },
    placeholderData: keepPreviousData
  })

  const { mutate: deleteMutation, isPending: loadingDelete } = useMutation({
    mutationFn: async () => {
      const res = await deleteAccountGroup(accountGroupId)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Accounts] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.AccountGroup] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.AccountGroups] })
        navigation.pop()
      }
    }
  })

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            showActionSheet([
              {
                label: 'Edit account group',
                onSelected: () => navigation.navigate('EditAccountGroup', { accountGroupId })
              },
              {
                label: 'Delete account group',
                onSelected: () => setDeleteDialogVisible(true),
                isDestructive: true
              }
            ])
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      ),
      title: accountGroup?.name
    })
  }, [accountGroup, accountGroupId, colors, navigation, showActionSheet])

  if (!accountGroup || loadingDelete) {
    return <ProgressBar indeterminate />
  }

  return (
    <View style={{ flex: 1 }}>
      <ProgressBar indeterminate visible={fetching} />
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Account Group</Dialog.Title>
          <Dialog.Content>
            <Text>
              Are you sure you want to delete this account group? All accounts will be moved to the ungrouped account
              group.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => deleteMutation()}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <ScrollView>
        <NetWorthGraph accountGroup={accountGroup} dateRangeFilter={selectedDateRangeFilter} />
        <DateRangePicker
          selectedDateRangeFilter={selectedDateRangeFilter}
          onSelected={(type) => setSelectedDateRangeFilter(type)}
        />
        <View
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.elevation.level2, padding: 10 }}
        >
          <Text
            variant="titleMedium"
            style={{
              fontWeight: 'bold',
              flex: 1
            }}
          >
            Accounts
          </Text>
        </View>
        <Divider />
        {accountGroup.accounts.length === 0 && (
          <View style={{ backgroundColor: colors.elevation.level2 }}>
            <NoData text="No accounts" />
          </View>
        )}
        {accountGroup.accounts.map((account) => (
          <View key={account.id}>
            <Divider />
            <TouchableOpacity
              key={account.id}
              style={{ backgroundColor: colors.elevation.level2 }}
              onPress={() => navigation.navigate('Account', { accountId: account.id })}
            >
              <Divider />
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  backgroundColor: 'transparent',
                  paddingHorizontal: 15,
                  paddingVertical: 15,
                  alignItems: 'center'
                }}
              >
                <AccountIcon account={account} />
                <View
                  style={{
                    backgroundColor: 'transparent',
                    justifyContent: 'center',
                    flex: 1
                  }}
                >
                  <Text variant="titleMedium">{account.name}</Text>
                  <Text variant="bodySmall" style={{ marginTop: 5 }}>
                    {mapAccountSubType(account.subType)}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: 'transparent',
                    justifyContent: 'center',
                    alignItems: 'flex-end'
                  }}
                >
                  <Text variant="titleMedium">{formatAccountBalance(account, currencyCode)}</Text>
                  <Text variant="bodySmall" style={{ marginTop: 5 }}>
                    {formatDateDifference(account.updatedAt)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
        <Divider />
        <View style={{ flexDirection: 'row', padding: 15, backgroundColor: colors.elevation.level2, marginTop: 15 }}>
          <Text
            variant="titleMedium"
            style={{
              flex: 1
            }}
          >
            Type
          </Text>
          <Text variant="titleMedium">{mapAccountGroupType(accountGroup.type)}</Text>
        </View>
        <Divider />
      </ScrollView>
    </View>
  )
}
