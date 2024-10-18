import { Card } from '../card/card'

export const PrivacyPolicy = () => {
  return (
    <div className="pt-8">
      <Card title="42 Finance Privacy Policy" className="mx-auto max-w-screen-lg">
        <div className="m-8">
          <div className="font-bold">Last updated April 27, 2024</div>

          <div className="mt-6">
            Your privacy is critically important to us. This privacy policy outlines the types of information we may
            collect from you or that you may provide when you use our app and our practices for collecting, using,
            maintaining, protecting, and disclosing that information.
          </div>

          <div className="mt-6 font-bold text-lg">1. Information We Collect</div>

          <div className="mt-2">We collect the following types of information from users of our app, including:</div>

          <div className="font-bold text-base my-2">Personal Data:</div>
          <div>
            Information by which you may be personally identified including name, email address and telephone number.
            This is used solely for account creation and your user profile and is not required to provide a full name or
            telephone number.
          </div>
          <div className="font-bold text-base my-2">Financial Data:</div>
          <div>
            Details about your financial accounts including the institution, account balance and transaction information
            including the merchant and transaction amount necessary for transaction history and budgeting.
          </div>

          <div className="mt-6 font-bold text-lg">2. Disclosure of Your Information</div>
          <div>None of your personal information or financial data is shared or sold to any third parties.</div>

          <div className="mt-6 font-bold text-lg">3. Data Security</div>
          <div>
            We have implemented measures designed to secure your personal data from accidental loss and from
            unauthorized access, use, alteration, and disclosure.
          </div>

          <div className="mt-6 font-bold text-lg">4. Changes to Our Privacy Policy</div>
          <div>
            It is our policy to post any changes we make to our privacy policy on this page. If we make material changes
            to how we treat our users personal data, we will notify you through a notice on our home page.
          </div>

          <div className="mt-6 font-bold text-lg">5. Contact Information</div>
          <div>
            To ask questions or comment about this privacy policy and our privacy practices, contact us at:{' '}
            <a href="mailto:support@42f.io">support@42f.io</a>
          </div>
        </div>
      </Card>
    </div>
  )
}
