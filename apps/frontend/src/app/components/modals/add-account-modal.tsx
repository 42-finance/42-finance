import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AddAccountRequest, ApiQuery, addAccount, getLinkToken } from 'frontend-api'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AccountSubType, AccountType, CurrencyCode } from 'shared-types'

import { AddAccountOptions } from '../account/add-account-options'
import { Button } from '../common/button/button'
import { Modal } from '../common/modal/modal'
import { LaunchLink } from '../connections/launch-link'
import { AccountForm } from '../forms/account-form'
import { CryptoForm } from '../forms/crypto-form'
import { PropertyForm } from '../forms/property-form'
import { VehicleForm } from '../forms/vehicle-form'

type Props = {
  onClose: () => void
}

export const AddAccountModal: React.FC<Props> = ({ onClose }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [showPlaid, setShowPlaid] = useState<boolean>(false)
  const [showCrypto, setShowCrypto] = useState<boolean>(false)
  const [showVehicle, setShowVehicle] = useState<boolean>(false)
  const [showProperty, setShowProperty] = useState<boolean>(false)
  const [showManual, setShowManual] = useState<boolean>(false)

  const { data: linkTokenData, isFetching: fetchingLinkToken } = useQuery({
    queryKey: [ApiQuery.PlaidLinkToken],
    queryFn: async () => {
      const res = await getLinkToken()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  const { mutate: mutateCrypto, isPending: submittingCrypto } = useMutation({
    mutationFn: async (request: AddAccountRequest) => {
      const res = await addAccount(request)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Accounts] })
        toast.success('Crypto account added')
        onClose()
      }
    }
  })

  const { mutate: mutateVehicle, isPending: submittingVehicle } = useMutation({
    mutationFn: async (request: AddAccountRequest) => {
      const res = await addAccount(request)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Accounts] })
        toast.success('Vehicle added')
        onClose()
      }
    }
  })

  const { mutate: mutateProperty, isPending: submittingProperty } = useMutation({
    mutationFn: async (request: AddAccountRequest) => {
      const res = await addAccount(request)
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Accounts] })
        toast.success('Property added')
        onClose()
      }
    }
  })

  const { mutate: mutateManual, isPending: submittingManual } = useMutation({
    mutationFn: async (request: AddAccountRequest) => {
      const res = await addAccount(request)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Accounts] })
        toast.success('Account added')
        onClose()
      }
    }
  })

  const onSelected = (type: string) => {
    if (type === 'plaid') {
      if (fetchingLinkToken) {
        return
      }
      if (linkTokenData?.linkToken) {
        setShowPlaid(true)
      } else if (linkTokenData?.connectionLimitReached) {
        toast.error('You have reached your connection limit. Purchase a subscription to connect more institutions.')
      } else {
        onClose()
        navigate('/settings?setting=subscription')
      }
    } else if (type === 'crypto') {
      setShowCrypto(true)
    } else if (type === 'vehicle') {
      setShowVehicle(true)
    } else if (type === 'property') {
      setShowProperty(true)
    } else if (type === 'manual') {
      setShowManual(true)
    }
  }

  const getFooter = () => {
    const footer = []

    if (showCrypto || showVehicle || showProperty || showManual) {
      footer.push(
        <Button
          key="cancel"
          onClick={() => {
            setShowCrypto(false)
            setShowVehicle(false)
            setShowProperty(false)
            setShowManual(false)
          }}
        >
          Back
        </Button>
      )
    }

    if (showCrypto) {
      footer.push(
        <Button key="submit" form="crypto-form" type="primary" htmlType="submit" disabled={submittingCrypto}>
          Submit
        </Button>
      )
    }

    if (showVehicle) {
      footer.push(
        <Button key="submit" form="vehicle-form" type="primary" htmlType="submit" disabled={submittingVehicle}>
          Submit
        </Button>
      )
    }

    if (showProperty) {
      footer.push(
        <Button key="submit" form="property-form" type="primary" htmlType="submit" disabled={submittingProperty}>
          Submit
        </Button>
      )
    }

    if (showManual) {
      footer.push(
        <Button key="submit" form="account-form" type="primary" htmlType="submit" disabled={submittingManual}>
          Submit
        </Button>
      )
    }

    return footer
  }

  return linkTokenData?.linkToken && showPlaid ? (
    <LaunchLink
      token={linkTokenData.linkToken}
      onExitCallback={() => {
        setShowPlaid(false)
        onClose()
      }}
    />
  ) : (
    <Modal title="Add Account" onClose={onClose} maxWidth="max-w-[50rem]" footer={getFooter()}>
      {showCrypto ? (
        <CryptoForm
          onSubmit={(values) =>
            mutateCrypto({
              name: values.name,
              type: AccountType.Asset,
              subType: AccountSubType.CryptoExchange,
              currentBalance: 0,
              walletType: values.walletType,
              walletAddress: values.walletAddress,
              currencyCode: CurrencyCode.USD,
              hideFromAccountsList: false,
              hideFromNetWorth: false,
              hideFromBudget: false
            })
          }
        />
      ) : showVehicle ? (
        <VehicleForm
          onSubmit={(values) =>
            mutateVehicle({
              name: values.name,
              type: AccountType.Asset,
              subType: AccountSubType.Vehicle,
              currentBalance: 0,
              vehicleVin: values.vehicleVin,
              vehicleMileage: values.vehicleMileage,
              currencyCode: CurrencyCode.USD,
              hideFromAccountsList: false,
              hideFromNetWorth: false,
              hideFromBudget: false
            })
          }
        />
      ) : showProperty ? (
        <PropertyForm
          onSubmit={(values) =>
            mutateProperty({
              name: values.name,
              propertyAddress: values.propertyAddress,
              currentBalance: values.currentBalance,
              type: AccountType.Asset,
              subType: AccountSubType.Property,
              currencyCode: values.currencyCode,
              hideFromAccountsList: false,
              hideFromNetWorth: false,
              hideFromBudget: false
            })
          }
        />
      ) : showManual ? (
        <AccountForm onSubmit={(values) => mutateManual(values)} canChangeCurrency />
      ) : (
        <AddAccountOptions onSelected={onSelected} loading={fetchingLinkToken} />
      )}
    </Modal>
  )
}
