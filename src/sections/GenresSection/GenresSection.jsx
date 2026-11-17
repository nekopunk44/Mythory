import { useState } from 'react'
import Section from '@/layouts/Section'
import GenreCard from '@/components/GenreCard'
import genreItems from './genreItems'
import './GenresSection.scss'

const INITIAL_COUNT = 10

const GenresSection = ({ activeGenre }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const visibleItems = isExpanded
    ? genreItems
    : genreItems.slice(0, INITIAL_COUNT)

  return (
    <Section title="Explore Genres" titleClassName="h3">
      <div className="genres-section__grid">
        {visibleItems.map((item) => (
          <GenreCard
            key={item.slug}
            label={item.label}
            iconName={item.iconName}
            slug={item.slug}
            isActive={activeGenre === item.slug}
          />
        ))}
      </div>
      {!isExpanded && (
        <button
          className="genres-section__view-all"
          onClick={() => setIsExpanded(true)}
        >
          View All ↓
        </button>
      )}
    </Section>
  )
}

export default GenresSection
