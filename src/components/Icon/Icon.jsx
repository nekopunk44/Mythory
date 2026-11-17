import clsx from 'clsx'
import './Icon.scss'

const Icon = (props) => {
  const { className, name, size = 24, alt = '', ...rest } = props

  return (
    <img
      className={clsx('icon', className)}
      src={`/src/assets/icons/${name}.svg`}
      width={size}
      height={size}
      alt={alt}
      {...rest}
    />
  )
}

export default Icon
