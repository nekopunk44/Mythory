import clsx from 'clsx'
import Icon from '@/components/Icon'
import './SliderButton.scss'

const SliderButton = (props) => {
  const { className, direction = 'next', variant = 'arrow', ...rest } = props

  const isPrev = direction === 'prev'
  const label = isPrev ? 'Previous' : 'Next'
  const iconName = variant === 'chevron' ? 'chevron-right' : 'arrow-right'

  return (
    <button
      className={clsx('slider-button', `slider-button--${variant}`, className)}
      type="button"
      aria-label={label}
      {...rest}
    >
      <Icon
        className={clsx(
          'slider-button__icon',
          isPrev && 'slider-button__icon--prev',
        )}
        name={iconName}
      />
    </button>
  )
}

export default SliderButton
