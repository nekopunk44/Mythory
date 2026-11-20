import Header from '@/layouts/Header'
import Footer from '@/layouts/Footer'
import HeroSection from '@/sections/HeroSection'
import TrendingSection from '@/sections/TrendingSection'
import NewsSection from '@/sections/NewsSection'
import TopStoriesSection from '@/sections/TopStoriesSection'
import GenresSection from '@/sections/GenresSection'
import LatestUpdatesSection from '@/sections/LatestUpdatesSection'

function App() {
  return (
    <>
      <Header />
      <HeroSection />
      <TrendingSection />
      <NewsSection />
      <TopStoriesSection />
      <GenresSection />
      <LatestUpdatesSection />
      <Footer />
    </>
  )
}

export default App
