import React from 'react'

import logo from '../../assets/images/logo.svg'

export const Footer: React.FC = () => {
  return (
    <footer aria-labelledby="footer-heading" className="border-t border-neutral-900/10 mt-12">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 lg:px-8">
        <div className="mb-6 mt-10 flex flex-col justify-between space-y-6 md:flex-row md:items-end">
          <div>
            <img src={logo} className="h-8 w-auto fill-neutral-900" />
          </div>
          <p className="text-xs leading-5 text-neutral-500">&copy; 2024 42 Finance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
