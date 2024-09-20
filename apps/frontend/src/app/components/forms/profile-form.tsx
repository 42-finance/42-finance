import { yupResolver } from '@hookform/resolvers/yup'
import React, { useMemo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { CurrencyCode } from 'shared-types'
import * as Yup from 'yup'

import { FormInput } from '../common/form/form-input'
import { FormSelect } from '../common/form/form-select'
import { Optional } from '../common/optional/optional'

export type ProfileFormFields = {
  name: string
  email: string
  phone: string | null
  currencyCode: CurrencyCode
}

type Props = {
  profileInfo: ProfileFormFields | null
  onSubmit: SubmitHandler<ProfileFormFields>
}

export const ProfileForm: React.FC<Props> = ({ onSubmit, profileInfo }) => {
  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email().required('Email is required'),
    phone: Yup.string().nullable().defined(),
    currencyCode: Yup.mixed<CurrencyCode>().required('Currency is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<ProfileFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: profileInfo?.name ?? '',
      email: profileInfo?.email ?? '',
      phone: profileInfo?.phone ?? null,
      currencyCode: profileInfo?.currencyCode ?? CurrencyCode.USD
    }
  })

  const currencyItems = useMemo(() => Object.values(CurrencyCode).map((c) => ({ label: c, value: c })), [])

  return (
    <form id="profile-form" data-testid="profile-form" autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-x-6 md:grid-cols-2">
        <div>
          <FormInput control={control} errors={errors.name?.message} label="Name" name="name" type="text" />
        </div>
        <div>
          <FormInput control={control} errors={errors.email?.message} label="Email" name="email" type="text" disabled />
        </div>
        <div>
          <FormInput
            control={control}
            errors={errors.phone?.message}
            label={
              <>
                Phone Number
                <Optional />
              </>
            }
            name="phone"
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
