import { useId } from 'react'
import clsx from 'clsx'
import Badge from '@/components/Badge'
import Icon from '@/components/Icon'
import starYellow from '@/assets/icons/star_yellow.png'
import formatCount from '@/utils/formatCount'
import './StoryCard.scss'

const StoryCard = (props) => {
  const { story, variant = 'default', className, ...rest } = props
  const isFeatured = variant === 'featured'
  const titleId = useId()
  const descriptionId = useId()
  const statsId = useId()

  return (
    <a
      className={clsx(
        'story-card',
        isFeatured && 'story-card--featured',
        className,
      )}
      href={`/stories/${story.id}`}
      aria-labelledby={titleId}
      aria-describedby={`${descriptionId} ${statsId}`}
      {...rest}
    >
      <div className="story-card__media">
        <img
          className="story-card__cover"
          src={story.cover}
          alt={story.title}
          loading={isFeatured ? 'eager' : 'lazy'}
        />
        <Badge className="story-card__badge" label={story.genre} />
        <div className="story-card__content">
          <h3 className="story-card__title" id={titleId}>
            {story.title}
          </h3>
          <p className="story-card__description" id={descriptionId}>
            {story.description}
          </p>
          <ul className="story-card__stats" id={statsId}>
            <li className="story-card__stat">
              <img
                className="story-card__stat-icon story-card__stat-icon--star"
                src={starYellow}
                alt=""
                aria-hidden="true"
              />
              <span className="visually-hidden">Rating</span>
              <span className="story-card__stat-value">{story.rating}</span>
            </li>
            <li className="story-card__stat">
              <Icon
                className="story-card__stat-icon"
                name="eye"
                size={25}
                alt=""
                aria-hidden="true"
              />
              <span className="visually-hidden">Views</span>
              <span className="story-card__stat-value">
                {formatCount(story.views)}
              </span>
            </li>
            <li className="story-card__stat">
              <Icon
                className="story-card__stat-icon story-card__stat-icon--like"
                name="like"
                size={21}
                alt=""
                aria-hidden="true"
              />
              <span className="visually-hidden">Likes</span>
              <span className="story-card__stat-value">
                {formatCount(story.likes).replace(/K$/, '')}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="story-card__footer">
        <img className="story-card__avatar" src={story.authorAvatar} alt="" />
        <span className="story-card__author">{story.author}</span>
      </div>
    </a>
  )
}

export default StoryCard
