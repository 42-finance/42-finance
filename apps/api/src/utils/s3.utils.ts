import { S3 } from '@aws-sdk/client-s3'

import { config } from '../common/config'

export const s3 = new S3({
  credentials: {
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey
  },
  region: config.s3.region
})
