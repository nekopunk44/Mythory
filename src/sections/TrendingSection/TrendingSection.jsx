import Section from '@/layouts/Section'

const TrendingSection = () => {
  return (
    <Section
      iconName="increase"
      title="Trending Now"
      subtitle="Most popular stories this week"
      actions={
        <a className="link" href="/">
          View All →
        </a>
      }
    >
      ...Слайдер в тренде...
    </Section>
  )
}

export default TrendingSection
