import Section from '@/layouts/Section'
import TopStoryRow from './TopStoryRow'
import stories from '@/data/stories'
import './TopStoriesSection.scss'

const topStories = [...stories]
  .sort((storyA, storyB) => storyB.rating - storyA.rating)
  .slice(0, 5)

const TopStoriesSection = () => {
  return (
    <Section
      iconLabel="top"
      title="Top - 5"
      subtitle="Top - 5 Stories this month"
    >
      <ol className="top-stories-list">
        {topStories.map((story, index) => (
          <li className="top-stories-list__item" key={story.id}>
            <TopStoryRow story={story} rank={index + 1} />
          </li>
        ))}
      </ol>
    </Section>
  )
}

export default TopStoriesSection
