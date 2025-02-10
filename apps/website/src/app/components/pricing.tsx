import { PricingItem } from './pricing-item'

export const Pricing = () => {
  return (
    <section id="pricing" className="border-t pt-16 mt-16">
      <div className="flex flex-col max-w-(--breakpoint-lg) mx-auto gap-12 px-4">
        <div className="gap-[24px] text-center flex flex-col justify-center items-center">
          <div className="bg-black rounded-lg text-white py-3 px-12 text-xl">Pricing</div>
        </div>
        <div className="text-3xl md:text-4xl font-semibold text-center">
          Try 42 Finance with 1 free institution connection
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <PricingItem
            title="Free"
            price="$0 / month"
            yearlyPrice="$0 / month"
            body="Limited to 1 institution connection"
          />
          <PricingItem
            title="Premium"
            price="$4.99 / month"
            yearlyPrice="$39.99 / year"
            body="Unlimited institution connections"
            showToggle
          />
        </div>
      </div>
    </section>
  )
}
