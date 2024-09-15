import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ApiQuery, createCheckout, createPortal, getSubscription, updateSubscription } from 'frontend-api'
import { formatDollars, mapSubscriptionType, mapSubscriptionTypeToPrice } from 'frontend-utils'
import { useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa6'
import { toast } from 'react-toastify'
import { SubscriptionType } from 'shared-types'
import { useQueryParam } from 'use-query-params'

import { Button } from '../common/button/button'
import { Card } from '../common/card/card'

export const SettingsSubscription = () => {
  const queryClient = useQueryClient()

  const [success, setSuccess] = useQueryParam<string | undefined>('success')
  const [_package] = useQueryParam<SubscriptionType | undefined>('package')

  const [selectedPackage, setSelectedPackage] = useState<SubscriptionType>(
    _package ?? SubscriptionType.UnlimitedConnections
  )

  const { data: subscription, isFetching } = useQuery({
    queryKey: [ApiQuery.StripeSubscription],
    queryFn: async () => {
      const res = await getSubscription()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await createCheckout({ subscriptionType: selectedPackage })
      if (res.ok && res.parsedBody?.payload?.url) {
        window.location.href = res.parsedBody.payload.url
      }
    }
  })

  const { mutate: mutatePortal, isPending: portalPending } = useMutation({
    mutationFn: async () => {
      const res = await createPortal()
      if (res.ok && res.parsedBody?.payload?.url) {
        window.location.href = res.parsedBody.payload.url
      }
    }
  })

  const { mutate: mutateSubscription, isPending: updateSubscriptionPending } = useMutation({
    mutationFn: async () => {
      const res = await updateSubscription({ newSubscriptionType: selectedPackage })
      if (res.ok) {
        toast.success('Subscription updated')
        queryClient.invalidateQueries({ queryKey: [ApiQuery.StripeSubscription] })
      }
    }
  })

  useEffect(() => {
    if (success === 'true') {
      queryClient.invalidateQueries({ queryKey: [ApiQuery.StripeSubscription] })
      toast.success('Your subscription is now active')
      setSuccess(undefined)
    }
  }, [success])

  const renderExtra = () => {
    if (subscription?.invoice) {
      return (
        <Button type="primary" onClick={() => mutatePortal()} disabled={portalPending} loading={portalPending}>
          Manage Subscription
        </Button>
      )
    }

    return null
  }

  if (!subscription) {
    return null
  }

  return (
    <div>
      <Card title="Subscription" className="mt-4" extra={renderExtra()}>
        <div>
          {subscription.subscriptionType ? (
            <>
              <div className="pb-6 px-6 border-b">
                <div className="text-base mt-6 mb-2 text-outline">Plan</div>
                <div className="">{mapSubscriptionType(subscription.subscriptionType)}</div>
                {subscription.platform === 'ios' && (
                  <div className="text-outline mt-2">Manage your subscription via the iOS app</div>
                )}
              </div>
              {subscription.invoice ? (
                <>
                  <div className="text-base mt-6 mb-2 mx-6 text-outline">Next Payment</div>
                  <div className="pb-6 px-6 border-b">
                    {subscription.invoice.currency.toUpperCase()}{' '}
                    {formatDollars(Math.max(0, subscription.invoice.amount))} on{' '}
                    {format(subscription.invoice.date, 'MMMM dd, yyyy')}
                  </div>
                </>
              ) : subscription.renewalDate ? (
                <>
                  <div className="text-base mt-6 mb-2 mx-6 text-outline">Next Payment</div>
                  <div className="pb-6 px-6 border-b">
                    USD {formatDollars(Math.max(0, mapSubscriptionTypeToPrice(subscription.subscriptionType)))} on{' '}
                    {format(subscription.renewalDate, 'MMMM dd, yyyy')}
                  </div>
                </>
              ) : null}
              {subscription.platform === 'stripe' && (
                <>
                  <div className="px-6 mt-6 text-base text-outline">Change plan</div>
                  <div className="flex flex-wrap gap-4 m-6">
                    <Card
                      className={`w-full max-w-[400px] cursor-pointer ${selectedPackage === SubscriptionType.UnlimitedConnections ? 'bg-elevationLevel1' : ''}`}
                      onClick={() => setSelectedPackage(SubscriptionType.UnlimitedConnections)}
                    >
                      <div className="flex items-center m-6">
                        <div className="flex flex-col grow">
                          <div className="text-base mb-2">Unlimited Connections</div>
                          <div>USD $4.99 / month</div>
                        </div>
                        {selectedPackage === SubscriptionType.UnlimitedConnections && (
                          <div className={`flex items-center justify-center rounded-full mr-3 w-5 h-5 bg-primary`}>
                            <FaCheck color="white" />
                          </div>
                        )}
                      </div>
                    </Card>
                    <Card
                      className={`w-full max-w-[400px] cursor-pointer ${selectedPackage === SubscriptionType.UnlimitedConnectionsYearly ? 'bg-elevationLevel1' : ''}`}
                      onClick={() => setSelectedPackage(SubscriptionType.UnlimitedConnectionsYearly)}
                    >
                      <div className="flex items-center m-6">
                        <div className="flex flex-col grow">
                          <div className="text-base mb-2">Unlimited Connections - Annual</div>
                          <div>USD $39.99 / year</div>
                        </div>
                        {selectedPackage === SubscriptionType.UnlimitedConnectionsYearly && (
                          <div className={`flex items-center justify-center rounded-full mr-3 w-5 h-5 bg-primary`}>
                            <FaCheck color="white" />
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                  <Button
                    type="primary"
                    onClick={() => mutateSubscription()}
                    disabled={selectedPackage === subscription.subscriptionType || updateSubscriptionPending}
                    loading={updateSubscriptionPending}
                    className="ml-6 mb-6"
                  >
                    Update Subscription
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <div className="px-6 mt-6 text-base text-outline">Select a plan</div>
              <div className="px-6 mt-3 text-sm">
                Select a subscription to connect a financial institution and take full advantage of 42 Finance's
                features.
              </div>
              <div className="flex flex-wrap gap-4 m-6">
                <Card
                  className={`w-full max-w-[400px] cursor-pointer ${selectedPackage === SubscriptionType.UnlimitedConnections ? 'bg-elevationLevel1' : ''}`}
                  onClick={() => setSelectedPackage(SubscriptionType.UnlimitedConnections)}
                >
                  <div className="flex items-center m-6">
                    <div className="flex flex-col grow">
                      <div className="text-base mb-2">Unlimited Connections</div>
                      <div>1 month free then, USD $4.99 / month</div>
                    </div>
                    {selectedPackage === SubscriptionType.UnlimitedConnections && (
                      <div className={`flex items-center justify-center rounded-full mr-3 w-5 h-5 bg-primary`}>
                        <FaCheck color="white" />
                      </div>
                    )}
                  </div>
                </Card>
                <Card
                  className={`w-full max-w-[400px] cursor-pointer ${selectedPackage === SubscriptionType.UnlimitedConnectionsYearly ? 'bg-elevationLevel1' : ''}`}
                  onClick={() => setSelectedPackage(SubscriptionType.UnlimitedConnectionsYearly)}
                >
                  <div className="flex items-center m-6">
                    <div className="flex flex-col grow">
                      <div className="text-base mb-2">Unlimited Connections - Annual</div>
                      <div>1 month free then, USD $39.99 / year</div>
                    </div>
                    {selectedPackage === SubscriptionType.UnlimitedConnectionsYearly && (
                      <div className={`flex items-center justify-center rounded-full mr-3 w-5 h-5 bg-primary`}>
                        <FaCheck color="white" />
                      </div>
                    )}
                  </div>
                </Card>
              </div>
              <Button
                type="primary"
                onClick={() => mutate()}
                disabled={isPending}
                loading={isPending}
                className="ml-6 mb-6"
              >
                Purchase Subscription
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
