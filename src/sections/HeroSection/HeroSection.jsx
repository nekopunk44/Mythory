import './HeroSection.scss'
import Button from '@/components/Button'
import Icon from '@/components/Icon'

const HeroSection = () => {
  const HERO_STATISTICS = [
    { label: 'Stories', value: '50K+', iconName: 'logo' },
    { label: 'Readers', value: '1M+', iconName: 'social' },
    { label: 'Rating', value: '4.8', iconName: 'star' },
  ]

  return (
    <section className="hero">
      <div className="hero__inner">
        <div className="hero__info">
          <h1 className="hero__title">
            Unlimited Stories,
            <br />
            <span>One Universe</span>
          </h1>
          <p className="hero__subtitle">
            Dive into millions of web novels across fantasy, sci-fi, romance and
            more. Read for free or write your own story.
          </p>
        </div>

        <div className="hero__actions">
          <Button label="Start Reading" as="a" mode="filled" href="/genres" />
          <Button label="Start Writing" as="a" href="/signup" />
        </div>

        <ul className="hero__statistics hidden-mobile">
          {HERO_STATISTICS.map((item, index) => (
            <li className="hero__statistics-item" key={index}>
              <Icon
                className="hero__statistics-icon"
                name={item.iconName}
                size={48}
              />
              <p className="hero__statistics-value">{item.value}</p>
              <p className="hero__statistics-label">{item.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default HeroSection
