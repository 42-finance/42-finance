import { Request, Response } from 'express'
import { CountryCode } from 'plaid'
import { plaidClient } from 'plaid-helpers'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type InstitutionsQueryParams = {
  search?: string | null
}

export const getInstitutions = async (
  request: Request<{}, {}, {}, InstitutionsQueryParams>,
  response: Response<HTTPResponseBody>
) => {
  const { search } = request.query

  const institutionsRes = await plaidClient.institutionsGet({
    count: 100,
    offset: 0,
    country_codes: [CountryCode.Ca, CountryCode.Us]
  })

  return response.send({
    errors: [],
    payload: institutionsRes.data.institutions
  })
}
