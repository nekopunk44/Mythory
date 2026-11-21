import formatCount from '@/utils/formatCount'
import starYellow from '@/assets/icons/star_yellow.png'
import eyeIcon from '@/assets/icons/eye.svg'
import likeIcon from '@/assets/icons/like.svg'
import chevronRight from '@/assets/icons/chevron-right.svg'
import './TopStoryRow.scss'

const TopStoryRow = ({ story, rank }) => (
  <a className="top-story-row" href={`/stories/${story.id}`}>
    <span className="top-story-row__rank" aria-hidden="true">
      {rank}.
    </span>
    <img className="top-story-row__cover" src={story.cover} alt={story.title} />
    <div className="top-story-row__content">
      <h3 className="top-story-row__title">{story.title}</h3>
      <p className="top-story-row__author">{story.author}</p>
      <p className="top-story-row__description">{story.description}</p>
    </div>
    <ul
      className="top-story-row__stats"
      aria-label={`${story.title} statistics`}
    >
      <li className="top-story-row__stat">
        <img
          className="top-story-row__stat-icon top-story-row__stat-icon--star"
          src={starYellow}
          alt=""
        />
        <span className="visually-hidden">Rating</span>
        <span>{story.rating}</span>
      </li>
      <li className="top-story-row__stat">
        <img
          className="top-story-row__stat-icon"
          src={eyeIcon}
          alt=""
          aria-hidden="true"
        />
        <span className="visually-hidden">Views</span>
        <span>{formatCount(story.views)}</span>
      </li>
      <li className="top-story-row__stat">
        <img
          className="top-story-row__stat-icon top-story-row__stat-icon--like"
          src={likeIcon}
          alt=""
          aria-hidden="true"
        />
        <span className="visually-hidden">Likes</span>
        <span>{formatCount(story.likes).replace(/K$/, '')}</span>
      </li>
    </ul>
    <img
      className="top-story-row__chevron"
      src={chevronRight}
      alt=""
      aria-hidden="true"
    />
  </a>
)

export default TopStoryRow
