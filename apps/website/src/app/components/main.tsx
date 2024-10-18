import { Features } from './features'
import { Header } from './header'
import { Pricing } from './pricing'
import { Roadmap } from './roadmap'

export const Main = () => {
  return (
    <main>
      <Header />
      <Features />
      <Pricing />
      <Roadmap />
    </main>
  )
}
