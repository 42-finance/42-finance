import _ from 'lodash'

export default <T>(
  {
    required = [],
    optional = [],
    nullable = []
  }: { required?: (keyof T)[]; optional?: (keyof T)[]; nullable?: (keyof T)[] },
  requestBody: T
) => {
  const requiredErrors = required.map((key) =>
    _.isNil(requestBody[key]) || (_.isNaN(requestBody[key]) && _.isEmpty(requestBody[key]))
      ? `${String(key)} cannot be empty`
      : null
  )
  const optionalErrors = optional.map((key) =>
    _.isUndefined(requestBody[key]) || !_.isNil(requestBody[key]) ? `${String(key)} cannot be empty` : null
  )
  return requiredErrors.concat(optionalErrors).filter((error) => !_.isNil(error))
}
