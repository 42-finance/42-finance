import * as yup from 'yup'

import { DISABLE_SCE_PERIOD_MIN } from '../../common/config'
import { getSecondsFromHHMMSS } from '../time/time.utils'

yup.addMethod<yup.StringSchema>(
  yup.string,
  'minSeconds',
  function (minSeconds: number, errorMessage: string) {
    return this.test(`test-min-seconds`, errorMessage, function (value) {
      const { path, createError } = this

      if (value === null) {
        return true
      }

      // Disable limit for testing purposes
      if (
        path === 'schedConnEventPeriod' &&
        DISABLE_SCE_PERIOD_MIN === 'true'
      ) {
        return true
      }

      const seconds = getSecondsFromHHMMSS(value)
      return (
        (value && seconds >= minSeconds) ||
        createError({ path, message: errorMessage })
      )
    })
  }
)

yup.addMethod<yup.StringSchema>(
  yup.string,
  'maxSeconds',
  function (maxSeconds: number, errorMessage: string) {
    return this.test(`test-max-seconds`, errorMessage, function (value) {
      const { path, createError } = this

      if (value === null) {
        return true
      }

      const seconds = getSecondsFromHHMMSS(value)
      return (
        (value && seconds <= maxSeconds) ||
        createError({ path, message: errorMessage })
      )
    })
  }
)

declare module 'yup' {
  interface StringSchema extends yup.Schema {
    minSeconds(minSeconds: number, errorMessage: string): StringSchema
    maxSeconds(maxSeconds: number, errorMessage: string): StringSchema
  }
}

export default yup
