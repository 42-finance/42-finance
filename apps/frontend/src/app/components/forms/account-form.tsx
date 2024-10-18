import { yupResolver } from '@hookform/resolvers/yup'
import { mapAccountSubType, mapAccountType } from 'frontend-utils'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { AccountSubType, AccountType, CurrencyCode } from 'shared-types'
import * as Yup from 'yup'

import { useLocalStorage } from '../../hooks/use-local-storage.hook'
import { FormInput } from '../common/form/form-input'
import { FormSelect } from '../common/form/form-select'

export type AccountFormFields = {
  name: string
  type: AccountType
  subType: AccountSubType
  currentBalance: number
  currencyCode: CurrencyCode
}

type Props = {
  accountInfo?: AccountFormFields
  onSubmit: (values: AccountFormFields) => void
  canChangeCurrency: boolean
}

export const AccountForm: React.FC<Props> = ({ onSubmit, accountInfo, canChangeCurrency }) => {
  const [currencyCode] = useLocalStorage<CurrencyCode>('currencyCode', CurrencyCode.USD)

  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    type: Yup.mixed<AccountType>().required('Type is required'),
    subType: Yup.mixed<AccountSubType>().required('Subtype is required'),
    currentBalance: Yup.number().required('Balance is required'),
    currencyCode: Yup.mixed<CurrencyCode>().required('Currency is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<AccountFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: accountInfo?.name ?? '',
      type: accountInfo?.type ?? AccountType.Asset,
      subType: accountInfo?.subType ?? AccountSubType.Other,
      currentBalance: accountInfo?.currentBalance ?? 0,
      currencyCode: accountInfo?.currencyCode ?? currencyCode
    }
  })

  const accountTypes = useMemo(
    () => Object.values(AccountType).map((c) => ({ label: mapAccountType(c), value: c })),
    []
  )

  const accountSubTypes = useMemo(
    () =>
      Object.values(AccountSubType)
        .sort()
        .map((c) => ({ label: mapAccountSubType(c), value: c })),
    []
  )

  const currencyCodes = useMemo(
    () =>
      Object.values(CurrencyCode)
        .sort()
        .map((c) => ({ label: c, value: c })),
    []
  )

  return (
    <form id="account-form" data-testid="account-form" autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-x-6 md:grid-cols-2">
        <div>
          <FormInput control={control} errors={errors.name?.message} label="Name" name="name" type="text" />
        </div>
        <div>
          <FormSelect control={control} errors={errors.type?.message} label="Type" name="type" options={accountTypes} />
        </div>
        <div>
          <FormSelect
            control={control}
            errors={errors.subType?.message}
            label="Subtype"
            name="subType"
            options={accountSubTypes}
          />
        </div>
        {canChangeCurrency && (
          <>
            <div>
              <FormInput
                control={control}
                errors={errors.currentBalance?.message}
                label="Balance"
                name="currentBalance"
                type="text"
              />
            </div>
            <div>
              <FormSelect
                control={control}
                errors={errors.currencyCode?.message}
                label="Currency"
                name="currencyCode"
                options={currencyCodes}
              />
            </div>
          </>
        )}
      </div>
    </form>
  )
}
