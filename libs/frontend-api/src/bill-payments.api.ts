import { BillPayment } from 'frontend-types'

import { config } from './config'
import { get } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export const getBillPayment = async (billPaymentId: number) =>
  get<HTTPResponseBody<BillPayment>>(`${config.apiUrl}/bill-payments/${billPaymentId}`)

export const getBillPayments = async () => get<HTTPResponseBody<BillPayment[]>>(`${config.apiUrl}/bill-payments`)
