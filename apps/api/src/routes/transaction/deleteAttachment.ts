import { Transaction, dataSource } from 'database'
import { Request, Response } from 'express'

import { config } from '../../common/config'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { s3 } from '../../utils/s3.utils'

export const deleteAttachment = async (
  request: Request<{ id: number }, object, { attachment: string }>,
  response: Response<HTTPResponseBody>
) => {
  const { id } = request.params
  const { householdId } = request
  const { attachment } = request.body

  const transaction = await dataSource
    .getRepository(Transaction)
    .createQueryBuilder('transaction')
    .where('transaction.id = :id', { id })
    .andWhere('transaction.householdId = :householdId', { householdId })
    .getOneOrFail()

  const result = await dataSource
    .getRepository(Transaction)
    .update(id, { attachments: transaction.attachments.filter((a) => a !== attachment) })

  const parts = attachment.split('/')
  const key = parts[parts.length - 1]

  await s3.deleteObject({
    Bucket: config.s3.attachmentsBucket,
    Key: key
  })

  return response.send({
    errors: [],
    payload: result
  })
}
