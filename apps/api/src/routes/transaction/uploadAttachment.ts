import { Transaction, dataSource } from 'database'
import { Request, Response } from 'express'

import { config } from '../../common/config'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { s3 } from '../../utils/s3.utils'

export const uploadAttachment = async (
  request: Request<{ id: string }, object, object>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { id } = request.params

  const files = (request.files ?? []) as Express.Multer.File[]

  const transaction = await dataSource
    .getRepository(Transaction)
    .createQueryBuilder('transaction')
    .andWhere('transaction.id = :id', { id })
    .andWhere('transaction.householdId = :householdId', { householdId })
    .getOneOrFail()

  return await dataSource.transaction(async (entityManager) => {
    const filepaths = []

    for (const file of files) {
      const filename = `${householdId}_${new Date().getTime()}_${file.originalname}`
      const filepath = `https://${config.s3.attachmentsBucket}.s3.${config.s3.region}.amazonaws.com/${filename}`
      await s3.putObject({
        Bucket: config.s3.attachmentsBucket,
        Key: filename,
        Body: file.buffer
      })
      filepaths.push(filepath)
    }

    const result = await entityManager
      .getRepository(Transaction)
      .update(id, { attachments: [...transaction.attachments, ...filepaths] })

    return response.send({
      errors: [],
      payload: result
    })
  })
}
