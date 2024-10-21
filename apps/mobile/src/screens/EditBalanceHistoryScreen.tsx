import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ApiQuery,
  DeleteBalanceHistoryRequest,
  EditBalanceHistoryRequest,
  deleteBalanceHistory,
  editBalanceHistory,
  getAccount,
  getBalanceHistory
} from 'frontend-api'
import { BalanceHistory } from 'frontend-types'
import * as React from 'react'
import { useCallback, useState } from 'react'
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'
import { ActivityIndicator, Button, Dialog, Portal, ProgressBar, Text } from 'react-native-paper'

import { BalanceHistoryEntry } from '../components/balance-history/BalanceHistoryEntry'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const EditBalanceHistoryScreen = ({ route }: RootStackScreenProps<'EditBalanceHistory'>) => {
  const { accountId } = route.params

  const queryClient = useQueryClient()

  const [editingBalanceHistory, setEditingBalanceHistory] = useState<BalanceHistory | null>(null)
  const [deletingBalanceHistory, setDeletingBalanceHistory] = useState<BalanceHistory | null>(null)

  const { data: account } = useQuery({
    queryKey: [ApiQuery.Account, accountId],
    queryFn: async () => {
      const res = await getAccount(accountId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  const { data: balanceHistory = [] } = useQuery({
    queryKey: [ApiQuery.AccountBalanceHistory, accountId],
    queryFn: async () => {
      const res = await getBalanceHistory({ accountIds: [accountId] })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (request: EditBalanceHistoryRequest) => {
      Keyboard.dismiss()
      const res = await editBalanceHistory(accountId, request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Account] })
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Accounts] })
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.AccountBalanceHistory] })
      }
    }
  })

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationFn: async (request: DeleteBalanceHistoryRequest) => {
      Keyboard.dismiss()
      const res = await deleteBalanceHistory(accountId, request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Account] })
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Accounts] })
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.AccountBalanceHistory] })
      }
    }
  })

  const onPress = useCallback((history: BalanceHistory) => {
    setEditingBalanceHistory(history)
  }, [])

  const onEdit = useCallback(
    (history: BalanceHistory, amount: number) => {
      mutate({
        date: history.date,
        currentBalance: amount
      })
    },
    [mutate]
  )

  const onDelete = useCallback(
    (history: BalanceHistory) => {
      setDeletingBalanceHistory(history)
    },
    [mutateDelete]
  )

  if (!account) {
    return <ProgressBar indeterminate />
  }

  return (
    <>
      <Portal>
        <Dialog
          visible={deletingBalanceHistory != null || isPendingDelete}
          onDismiss={() => setDeletingBalanceHistory(null)}
        >
          <Dialog.Title>Delete Balance History</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this balance history entry?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeletingBalanceHistory(null)}>Cancel</Button>
            {isPendingDelete ? (
              <ActivityIndicator />
            ) : (
              <Button
                onPress={() => {
                  if (deletingBalanceHistory) {
                    mutateDelete({
                      date: deletingBalanceHistory.date
                    })
                    setDeletingBalanceHistory(null)
                  }
                }}
              >
                Ok
              </Button>
            )}
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          {balanceHistory.map((history) => (
            <BalanceHistoryEntry
              key={history.date.toISOString()}
              history={history}
              onPress={onPress}
              onEdit={onEdit}
              onDelete={onDelete}
              isEditing={editingBalanceHistory?.date === history.date}
              isLoading={isPending}
            />
          ))}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  )
}
