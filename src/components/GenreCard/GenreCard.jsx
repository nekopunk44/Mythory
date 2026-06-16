import clsx from 'clsx'
import Icon from '@/components/Icon'
import './GenreCard.scss'

const GenreCard = (props) => {
  const {
    className,
    label,
    iconName,
    slug,
    isActive = false,
    ...rest
  } = props

  return (
    <a
      className={clsx('genre-card', isActive && 'genre-card--active', className)}
      href={`/genres?genre=${slug}`}
      {...rest}
    >
      <Icon className="genre-card__icon" name={iconName} size={40} />
      <span className="genre-card__label">{label}</span>
    </a>
  )
}

export default GenreCard