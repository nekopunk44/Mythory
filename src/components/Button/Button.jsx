import clsx from 'clsx'
import './Button.scss'
import Icon from '@/components/Icon'

const Button = (props) => {
  const {
    className,
    type = 'button',
    /**
     * '' (default) | 'filled'
     */
    mode = '',
    as: Tag = 'button',
    label,
    isLabelHidden = false,
    iconName,
    /**
     * 'before' | 'after'
     */
    iconPosition = 'after',
    ...rest
  } = props

  const iconComponent = iconName && <Icon className="icon" name={iconName} />

  return (
    <Tag
      className={clsx(
        'button',
        mode && `button--${mode}`,
        isLabelHidden && 'button--icon-only',
        className,
      )}
      type={Tag === 'button' ? type : undefined}
      aria-label={isLabelHidden ? label : undefined}
      {...rest}
    >
      {iconPosition === 'before' && iconComponent}
      {!isLabelHidden && <span className="button__label">{label}</span>}
      {iconPosition === 'after' && iconComponent}
    </Tag>
  )
}

export default Button
