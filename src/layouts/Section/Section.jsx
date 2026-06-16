import clsx from 'clsx'
import Icon from '@/components/Icon'
import './Section.scss'

const Section = (props) => {
  const {
    className,
    iconName,
    iconLabel,
    title,
    /**
     * 'h1' | 'h2' (default) | 'h3' | 'h4' | 'h5' | 'h6'
     */
    titleAs: Title = 'h2',
    /**
     * 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
     */
    titleClassName,
    subtitle,
    actions,
    children,
    ...rest
  } = props

  const hasHeader = title || iconName || subtitle || actions

  return (
    <section className={clsx('section container', className)} {...rest}>
      {hasHeader && (
        <header className="section__header">
          <div className="section__heading">
            {(iconName || iconLabel) && (
              <div className="section__icon">
                {iconLabel
                  ? <span>{iconLabel}</span>
                  : <Icon name={iconName} size={58} />
                }
              </div>
            )}
            <div className="section__info">
              {title && (
                <Title className={clsx('section__title', titleClassName)}>
                  {title}
                </Title>
              )}
              {subtitle && (
                <p className="section__subtitle">{subtitle}</p>
              )}
            </div>
          </div>
          {actions && (
            <div className="section__actions">{actions}</div>
          )}
        </header>
      )}
      <div className="section__body">
        {children}
      </div>
    </section>
  )
}

export default Section