import Section from '@/layouts/Section'
import Header from '@/layouts/Header'
import Button from '@/components/Button'
import Footer from '@/layouts/Footer'
import HeroSection from '@/sections/HeroSection'
import GenresSection from '@/sections/GenresSection'

function App() {

  return (
    <>
      <Header />
      <HeroSection />
      <Section
        iconName="increase"
        title="Trending Now"
        subtitle="Most popular stories this week"
        actions={<a className="link" href="/">View All →</a>}
      >
        ...Слайдер в тренде...
      </Section>
      <Section
        iconLabel="new"
        title="News Stories"
        subtitle="Most  news stories this week"
      >
        ...Слайдер новых историй...
      </Section>

      <Section
        iconLabel="top"
        title="Top - 5"
        subtitle="Top - 5 Stories this month"
      >
        ...Карточки 5 лучших историй месяца...
      </Section>

      <GenresSection />

      <Section
        iconLabel="update"
        title="Latest Updates"
        subtitle="Books with new chapters published"
      >
        ...Карточки 12 последних добавленных / измененных историй...
      </Section>
      <Footer />
    </>
  )
}

export default App
