import { yupResolver } from '@hookform/resolvers/yup'
import { useDebounce } from 'frontend-utils'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { CurrencyCode } from 'shared-types'
import * as Yup from 'yup'

import { useLocalStorage } from '../../hooks/use-local-storage.hook'
import { FormInput } from '../common/form/form-input'
import { FormSelect } from '../common/form/form-select'
import { Optional } from '../common/optional/optional'

export type PropertyFormFields = {
  name: string
  propertyAddress: string | null
  currentBalance: number
  currencyCode: CurrencyCode
}

type Props = {
  propertyInfo?: PropertyFormFields
  onSubmit: (values: PropertyFormFields) => void
}

export const PropertyForm: React.FC<Props> = ({ onSubmit, propertyInfo }) => {
  const [currencyCode] = useLocalStorage<CurrencyCode>('currencyCode', CurrencyCode.USD)

  const [address, setAddress] = useDebounce('', 500)

  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    propertyAddress: Yup.string().nullable().defined(),
    currentBalance: Yup.number().required('Property value is required'),
    currencyCode: Yup.mixed<CurrencyCode>().required('Currency is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm<PropertyFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: propertyInfo?.name ?? '',
      propertyAddress: propertyInfo?.propertyAddress ?? null,
      currentBalance: propertyInfo?.currentBalance ?? 0,
      currencyCode: propertyInfo?.currencyCode ?? currencyCode
    }
  })

  const currencyItems = useMemo(
    () =>
      Object.values(CurrencyCode)
        .sort()
        .map((c) => ({ label: c, value: c })),
    []
  )

  return (
    <form
      id="property-form"
      data-testid="property-form"
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-x-6 md:grid-cols-2">
        <div>
          <FormInput control={control} errors={errors.name?.message} label="Name" name="name" type="text" />
        </div>
        <div>
          <FormInput
            control={control}
            errors={errors.propertyAddress?.message}
            label={
              <>
                Address <Optional />
              </>
            }
            name="propertyAddress"
            type="text"
          />
        </div>
        <div>
          <FormInput
            control={control}
            errors={errors.currentBalance?.message}
            label="Property Value"
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
            options={currencyItems?.map((d) => ({
              label: d.label,
              value: d.value
            }))}
          />
        </div>
      </div>
    </form>
  )
}
