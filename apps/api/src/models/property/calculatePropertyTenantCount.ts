import { Property } from 'database';

import { calculateRentalUnitTenantCount } from '../rentalUnit/calculateRentalUnitTenantCount';

export const calculatePropertyTenantCount = (property: Property) =>
  property.rentalUnits.reduce(
    (tenantCount, rentalUnit) => tenantCount + calculateRentalUnitTenantCount(rentalUnit),
    0
  )
