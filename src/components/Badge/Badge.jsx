import clsx from 'clsx'
import './Badge.scss'

const Badge = (props) => {
  const {
    className,
    label,
    ...rest
  } = props

  return (
    <span
      className={clsx('badge', className)}
      {...rest}
    >
      {label}
    </span>
  )
}

export default Badge