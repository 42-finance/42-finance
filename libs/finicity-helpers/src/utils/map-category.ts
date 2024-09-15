import { SystemCategory } from 'shared-types'

import { FinicityCategory } from '../types/FinicityCategory'

export const mapCategory = (category: FinicityCategory) => {
  switch (category) {
    case 'ATM Fee':
      return SystemCategory.AtmFees
    case 'Advertising':
      return SystemCategory.OtherGeneralServices
    case 'Air Travel':
      return SystemCategory.Flights
    case 'Alcohol & Bars':
      return SystemCategory.BeerWineAndLiquor
    case 'Allowance':
      return SystemCategory.AtmFees
    case 'Amusement':
      return SystemCategory.SportingEventsAmusementParksAndMuseums
    case 'Arts':
      return SystemCategory.OtherGeneralMerchandise
    case 'Auto & Transport':
      return SystemCategory.Automotive
    case 'Auto Insurance':
      return SystemCategory.Insurance
    case 'Auto Payment':
      return SystemCategory.CarPayment
    case 'Baby Supplies':
      return SystemCategory.Childcare
    case 'Babysitter & Daycare':
      return SystemCategory.Childcare
    case 'Bank Fee':
      return SystemCategory.OtherBankFees
    case 'Bills & Utilities':
      return SystemCategory.OtherUtilities
    case 'Bonus':
      return SystemCategory.OtherIncome
    case 'Books':
      return SystemCategory.BookstoresAndNewsstands
    case 'Books & Supplies':
      return SystemCategory.BookstoresAndNewsstands
    case 'Business Services':
      return SystemCategory.OtherGeneralServices
    case 'Buy':
      return SystemCategory.Miscellaneous
    case 'Cash & ATM':
      return SystemCategory.CashAdvancesAndLoans
    case 'Charity':
      return SystemCategory.Donations
    case 'Check':
      return SystemCategory.Deposit
    case 'Child Support':
      return SystemCategory.Childcare
    case 'Clothing':
      return SystemCategory.ClothingAndAccessories
    case 'Coffee Shops':
      return SystemCategory.Coffee
    case 'Credit Card Payment':
      return SystemCategory.CreditCardPayment
    case 'Dentist':
      return SystemCategory.DentalCare
    case 'Deposit':
      return SystemCategory.Deposit
    case 'Dividend & Cap Gains':
      return SystemCategory.Dividends
    case 'Doctor':
      return SystemCategory.OtherMedical
    case 'Education':
      return SystemCategory.Education
    case 'Electronics & Software':
      return SystemCategory.Electronics
    case 'Entertainment':
      return SystemCategory.OtherEntertainment
    case 'Eyecare':
      return SystemCategory.EyeCare
    case 'Fast Food':
      return SystemCategory.FastFood
    case 'Federal Tax':
      return SystemCategory.TaxPayment
    case 'Fees & Charges':
      return SystemCategory.OtherBankFees
    case 'Finance Charge':
      return SystemCategory.InterestCharge
    case 'Financial':
      return SystemCategory.AccountingAndFinancialPlanning
    case 'Financial Advisor':
      return SystemCategory.AccountingAndFinancialPlanning
    case 'Food & Dining':
      return SystemCategory.Restaurant
    case 'Furnishings':
      return SystemCategory.Furniture
    case 'Gas & Fuel':
      return SystemCategory.Gas
    case 'Gift':
      return SystemCategory.GiftsAndNovelties
    case 'Gifts & Donations':
      return SystemCategory.GiftsAndNovelties
    case 'Groceries':
      return SystemCategory.Groceries
    case 'Gym':
      return SystemCategory.GymsAndFitnessCenters
    case 'Hair':
      return SystemCategory.HairAndBeauty
    case 'Health & Fitness':
      return SystemCategory.GymsAndFitnessCenters
    case 'Health Insurance':
      return SystemCategory.Insurance
    case 'Hobbies':
      return SystemCategory.OtherEntertainment
    case 'Home':
      return SystemCategory.OtherHomeImprovement
    case 'Home Improvement':
      return SystemCategory.OtherHomeImprovement
    case 'Home Insurance':
      return SystemCategory.Insurance
    case 'Home Phone':
      return SystemCategory.Telephone
    case 'Home Services':
      return SystemCategory.OtherHomeImprovement
    case 'Home Supplies':
      return SystemCategory.OfficeSupplies
    case 'Hotel':
      return SystemCategory.Lodging
    case 'Income':
      return SystemCategory.Wages
    case 'Interest Income':
      return SystemCategory.InterestEarned
    case 'Internet':
      return SystemCategory.InternetAndCable
    case 'Investments':
      return SystemCategory.Dividends
    case 'Kids':
      return SystemCategory.Childcare
    case 'Kids Activities':
      return SystemCategory.Childcare
    case 'Late Fee':
      return SystemCategory.OtherBankFees
    case 'Laundry':
      return SystemCategory.LaundryAndDryCleaning
    case 'Lawn & Garden':
      return SystemCategory.OtherHomeImprovement
    case 'Legal':
      return SystemCategory.ConsultingAndLegal
    case 'Life Insurance':
      return SystemCategory.Insurance
    case 'Loan Fees and Charges':
      return SystemCategory.OtherBankFees
    case 'Loan Insurance':
      return SystemCategory.Insurance
    case 'Loan Interest':
      return SystemCategory.InterestCharge
    case 'Loan Payment':
      return SystemCategory.OtherPayment
    case 'Loan Principal':
      return SystemCategory.OtherPayment
    case 'Loans':
      return SystemCategory.OtherPayment
    case 'Local Tax':
      return SystemCategory.TaxPayment
    case 'Low Balance':
      return SystemCategory.OverdraftFees
    case 'Mobile Phone':
      return SystemCategory.Telephone
    case 'Mortgage & Rent':
      return SystemCategory.Rent
    case 'Movies & DVDs':
      return SystemCategory.TvAndMovies
    case 'Music':
      return SystemCategory.MusicAndAudio
    case 'Newspapers & Magazines':
      return SystemCategory.BookstoresAndNewsstands
    case 'Office Supplies':
      return SystemCategory.OfficeSupplies
    case 'Parking':
      return SystemCategory.Parking
    case 'Paycheck':
      return SystemCategory.Wages
    case 'Personal Care':
      return SystemCategory.OtherPersonalCare
    case 'Pet Food & Supplies':
      return SystemCategory.PetSupplies
    case 'Pet Grooming':
      return SystemCategory.VeterinaryServices
    case 'Pets':
      return SystemCategory.VeterinaryServices
    case 'Pharmacy':
      return SystemCategory.PharmaciesAndSupplements
    case 'Printing':
      return SystemCategory.OtherGeneralServices
    case 'Property Tax':
      return SystemCategory.TaxPayment
    case 'Public Transportation':
      return SystemCategory.PublicTransit
    case 'Reimbursement':
      return SystemCategory.OtherIncome
    case 'Rental Car & Taxi':
      return SystemCategory.TaxisAndRideShares
    case 'Restaurants':
      return SystemCategory.Restaurant
    case 'Sales Tax':
      return SystemCategory.TaxPayment
    case 'Sell':
      return SystemCategory.InvestmentAndRetirementFunds
    case 'Service & Parts':
      return SystemCategory.Automotive
    case 'Service Fee':
      return SystemCategory.AtmFees
    case 'Shipping':
      return SystemCategory.PostageAndShipping
    case 'Shopping':
      return SystemCategory.OtherGeneralMerchandise
    case 'Spa & Massage':
      return SystemCategory.OtherMedical
    case 'Sporting Goods':
      return SystemCategory.SportingGoods
    case 'Sports':
      return SystemCategory.SportingGoods
    case 'State Tax':
      return SystemCategory.TaxPayment
    case 'Streaming Services':
      return SystemCategory.TvAndMovies
    case 'Student Loan':
      return SystemCategory.StudentLoanPayment
    case 'Taxes':
      return SystemCategory.TaxPayment
    case 'Television':
      return SystemCategory.TvAndMovies
    case 'Toys':
      return SystemCategory.Childcare
    case 'Trade Commissions':
      return SystemCategory.OtherIncome
    case 'Transfer':
      return SystemCategory.OtherTransferOut
    case 'Transfer for Cash Spending':
      return SystemCategory.CashAdvancesAndLoans
    case 'Travel':
      return SystemCategory.OtherTravel
    case 'Tuition':
      return SystemCategory.Education
    case 'Uncategorized':
      return SystemCategory.Miscellaneous
    case 'Utilities':
      return SystemCategory.OtherUtilities
    case 'Vacation':
      return SystemCategory.OtherTravel
    case 'Veterinary':
      return SystemCategory.VeterinaryServices
    case 'Internet / Broadband Charges':
      return SystemCategory.InternetAndCable
    default:
      return SystemCategory.Miscellaneous
  }
}
