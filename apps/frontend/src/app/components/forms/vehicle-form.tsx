import { yupResolver } from '@hookform/resolvers/yup'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { CurrencyCode } from 'shared-types'
import * as Yup from 'yup'

import { useLocalStorage } from '../../hooks/use-local-storage.hook'
import { FormInput } from '../common/form/form-input'
import { FormSelect } from '../common/form/form-select'

export type VehicleFormFields = {
  name: string
  vehicleVin: string | null
  vehicleMileage: number | null
  currentBalance: number
  currencyCode: CurrencyCode
}

type Props = {
  vehicleInfo?: VehicleFormFields
  onSubmit: (values: VehicleFormFields) => void
}

export const VehicleForm: React.FC<Props> = ({ onSubmit, vehicleInfo }) => {
  const [currencyCode] = useLocalStorage<CurrencyCode>('currencyCode', CurrencyCode.USD)

  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    vehicleVin: Yup.string().nullable().defined(),
    vehicleMileage: Yup.number().nullable().defined(),
    currentBalance: Yup.number().required('Vehicle value is required'),
    currencyCode: Yup.mixed<CurrencyCode>().required('Currency is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<VehicleFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: vehicleInfo?.name ?? '',
      vehicleVin: vehicleInfo?.vehicleVin ?? '',
      vehicleMileage: vehicleInfo?.vehicleMileage ?? null,
      currentBalance: vehicleInfo?.currentBalance ?? 0,
      currencyCode: vehicleInfo?.currencyCode ?? currencyCode
    }
  })

  const currencyItems = useMemo(
    () => [CurrencyCode.CAD, CurrencyCode.USD].sort().map((c) => ({ label: c, value: c })),
    []
  )

  return (
    <form id="vehicle-form" data-testid="vehicle-form" autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-x-6 md:grid-cols-2">
        <div>
          <FormInput control={control} errors={errors.name?.message} label="Name" name="name" type="text" />
        </div>
        <div>
          <FormInput
            control={control}
            errors={errors.vehicleVin?.message}
            label="VIN  (Optional)"
            name="vehicleVin"
            type="text"
          />
        </div>
        <div>
          <FormInput
            control={control}
            errors={errors.vehicleMileage?.message}
            label="Mileage (Optional)"
            name="vehicleMileage"
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
