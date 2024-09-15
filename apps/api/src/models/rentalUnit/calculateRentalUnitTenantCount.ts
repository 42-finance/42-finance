import { RentalUnit } from 'database';

export const calculateRentalUnitTenantCount = (rentalUnit: RentalUnit) => rentalUnit.tenants.length
