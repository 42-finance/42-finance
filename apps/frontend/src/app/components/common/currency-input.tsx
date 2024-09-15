import React from 'react'
import { NumericFormat, NumericFormatProps } from 'react-number-format'

type Props = {
  onChange: (event: { target: { name: string; value: string } }) => void
  value?: string
  name?: string
  className?: string
  placeholder?: string
}

export const CurrencyInput = React.forwardRef<NumericFormatProps, Props>(function NumericFormatCustom(props, ref) {
  const { onChange, ...other } = props

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name ?? '',
            value: values.value
          }
        })
      }}
      thousandSeparator
      valueIsNumericString
      prefix="$"
    />
  )
})
