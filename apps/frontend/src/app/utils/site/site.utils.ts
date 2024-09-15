export const getSiteParentId = (
  clientId: number | null,
  customerId?: number | null,
  organizationId?: number | null,
  subGroupId?: number | null
) => {
  if (subGroupId) {
    return subGroupId
  }
  if (organizationId) {
    return organizationId
  }
  return customerId ? customerId : (clientId as number)
}
