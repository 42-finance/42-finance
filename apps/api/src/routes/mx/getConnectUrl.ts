import { Boom } from '@hapi/boom'
import { Household, dataSource } from 'database'
import { Request, Response } from 'express'
import { mxClient } from 'mx-helpers'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const getConnectUrl = async (
  request: Request<object, object, object, object>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request

  const household = await dataSource.getRepository(Household).findOneOrFail({ where: { id: householdId } })

  if (household.mxUserId == null) {
    const createUserResponse = await mxClient.createUser({
      user: {
        id: `household-${householdId}`
      }
    })
    household.mxUserId = createUserResponse.data.user?.guid ?? null
    await dataSource.getRepository(Household).update(householdId, {
      mxUserId: household.mxUserId
    })
  }

  if (household.mxUserId == null) {
    throw new Boom('Unable to create MX user', { statusCode: 409 })
  }

  const widgetRequestBody = {
    widget_url: {
      mode: 'aggregation',
      widget_type: 'connect_widget',
      ui_message_version: 4,
      is_mobile_webview: true
    }
  }

  const widgetResponse = await mxClient.requestWidgetURL(household.mxUserId, widgetRequestBody)

  if (widgetResponse.data.widget_url == null) {
    throw new Boom('Unable to create MX connect URL', { statusCode: 409 })
  }

  console.log(widgetResponse.data.widget_url)

  return response.send({
    errors: [],
    payload: widgetResponse.data.widget_url.url
  })
}
