import { Dialog } from '@headlessui/react'
import { useEffect, useMemo, useState } from 'react'
import { FaBars, FaX } from 'react-icons/fa6'

import logo from '../../assets/images/logo.svg'

export const Navigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = useMemo(
    () => [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Roadmap', href: '#roadmap' }
    ],
    []
  )

  useEffect(() => {
    const onHashChange = () => {
      setMobileMenuOpen(false)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => {
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 p-6 bg-white border-b">
      <nav className="mx-auto flex max-w-7xl items-center justify-between lg:justify-normal lg:px-8">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">42 Finance</span>
            <img src={logo} className="h-8 w-auto" />
          </a>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-neutral-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open menu</span>
            <FaBars className="h-6 w-6 stroke-neutral-800" aria-hidden="true" />
          </button>
        </div>

        {/* NAVIGATION ITEMS */}
        <div className="hidden lg:flex lg:items-center lg:gap-x-12 lg:mr-12">
          {navigation.map((item) => (
            <a key={item.name} href={item.href} className="nav-link text-xl text-neutral-900 hover:text-neutral-600">
              {item.name}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex lg:justify-end lg:space-x-4">
          <a href="https://app.42f.io" className="bg-black px-12 py-3 rounded-lg no-underline text-white text-xl">
            Go To App
          </a>
        </div>
      </nav>

      {/* MOBILE NAVIGATION */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-neutral-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">42 Finance</span>
              <img src={logo} className="h-8 w-auto fill-neutral-900" />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-neutral-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <FaX className="h-6 w-6 stroke-black" aria-hidden="true" />
            </button>
          </div>

          {/* MOBILE NAVIGATION ITEMS */}
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-neutral-500/10">
              <div className="space-y-2 pt-6 pb-3">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-neutral-900 hover:bg-neutral-200"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <a
                  href="https://app.42f.io"
                  className="rounded-md bg-neutral-900 px-5 py-3 text-base text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500"
                >
                  Go To App
                </a>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}
