import { Footer } from '../components/footer'
import { Main } from '../components/main'
import { Navigation } from '../components/navigation'

export const Home = () => (
  <main id="top" className="page-wrapper">
    <Navigation />
    <Main />
    <Footer />
  </main>
)
