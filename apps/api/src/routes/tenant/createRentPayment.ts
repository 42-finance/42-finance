import { dataSource, Property, RentalUnit, Tenant, User } from 'database'
import { Request, Response } from 'express'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export default async (request: Request<{ id: number }, {}, {}>, response: Response<HTTPResponseBody>) => {
  const { id } = request.params
  const userId = request.userId

  const tenant = await dataSource
    .getRepository(Tenant)
    .createQueryBuilder('tenant')
    .leftJoinAndMapOne('tenant.rentalUnit', RentalUnit, 'rentalUnit', 'rentalUnit.id = tenant.rentalUnitId')
    .leftJoinAndMapOne('rentalUnit.property', Property, 'property', 'property.id = rentalUnit.propertyId')
    .leftJoinAndMapOne('property.landlord', User, 'landlord', 'landlord.id = property.landlordId')
    .where('tenant.id = :id', { id })
    .andWhere('tenant.userId = :userId', { userId })
    .getOne()
  if (!tenant) {
    return response.status(404).json({
      errors: [`Tenant with id: ${id} was not found`],
      payload: {}
    })
  }

  // const existingRentPayment = await getRepository(Payment)
  //   .createQueryBuilder('payment')
  //   .leftJoin(Tenant, 'tenant', 'tenant.id = payment.tenantId')
  //   .where('tenant.id = :id', { id })
  //   .andWhere('payment.type = :paymentType', { paymentType: PaymentType.Rent })
  //   .andWhere('payment.status = :paymentStatus', { paymentStatus: PaymentStatus.Pending })
  //   .getOne()

  // if (existingRentPayment) {
  //   paypal.payment.get(existingRentPayment.paypalPaymentId, async (error, paypalPayment) => {
  //     if (error) {
  //       return response.status(500).json({
  //         errors: [error],
  //         payload: {}
  //       })
  //     }
  //     if (paypalPayment.state === 'approved') {
  //       existingRentPayment.status = PaymentStatus.Complete
  //       existingRentPayment.date = new Date()
  //       await getRepository(Payment).save(existingRentPayment)
  //       return response.json({
  //         errors: [],
  //         payload: existingRentPayment
  //       })
  //     } else if ((paypalPayment.payer as any)?.status === 'VERIFIED') {
  //       const paymentData = {
  //         payer_id: (paypalPayment.payer as any).payer_info.payer_id
  //       }
  //       paypal.payment.execute(paypalPayment.id!, paymentData, async (error) => {
  //         if (error) {
  //           return response.status(500).json({
  //             errors: [error],
  //             payload: {}
  //           })
  //         }
  //         existingRentPayment.status = PaymentStatus.Complete
  //         existingRentPayment.date = new Date()
  //         getRepository(Payment).save(existingRentPayment)
  //         return response.json({
  //           errors: [],
  //           payload: existingRentPayment
  //         })
  //       })
  //     } else {
  //       return response.json({
  //         errors: [],
  //         payload: existingRentPayment
  //       })
  //     }
  //   })
  // } else {
  //   const paymentData = {
  //     intent: 'sale',
  //     payer: {
  //       payment_method: 'paypal'
  //     },
  //     redirect_urls: {
  //       return_url: `${config.express.apiUrl}/paypal/success`,
  //       cancel_url: `${config.express.apiUrl}/paypal/cancelled`
  //     },
  //     transactions: [
  //       {
  //         amount: {
  //           currency: 'CAD',
  //           total: tenant.rent?.toString()
  //         },
  //         payee: {
  //           email: tenant.rentalUnit.property.landlord.email
  //         }
  //       }
  //     ]
  //   } as PayPalPayment
  //   paypal.payment.create(paymentData, async (error, paypalPayment) => {
  //     if (error) {
  //       return response.status(500).json({
  //         errors: [error],
  //         payload: {}
  //       })
  //     }

  //     await getConnection().transaction(async (entityManager) => {
  //       const payment = getRepository(Payment).create({
  //         type: PaymentType.Rent,
  //         date: new Date(),
  //         amount: tenant.rent ?? 0,
  //         status: PaymentStatus.Pending,
  //         paypalPaymentId: paypalPayment.id,
  //         paypalCheckoutUrl: paypalPayment.links![1].href,
  //         tenant: _.omit(tenant, ['rentalUnit'])
  //       })
  //       await entityManager.save(payment)

  //       try {
  //         // await getNextRentInvoice(tenant, payment, entityManager)
  //         return response.json({
  //           errors: [],
  //           payload: payment
  //         })
  //       } catch (error: any) {
  //         return response.status(500).json({
  //           errors: [error.message],
  //           payload: {}
  //         })
  //       }
  //     })
  //   })
  // }
}
