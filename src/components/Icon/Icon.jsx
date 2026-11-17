import clsx from 'clsx'
import './Icon.scss'

const iconUrls = import.meta.glob('@/assets/icons/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
})

const icons = Object.fromEntries(
  Object.entries(iconUrls).map(([path, url]) => [
    path
      .split('/')
      .pop()
      .replace(/\.svg$/, ''),
    url,
  ]),
)

const Icon = (props) => {
  const { className, name, size = 24, alt = '', ...rest } = props

  return (
    <img
      className={clsx('icon', className)}
      src={icons[name]}
      width={size}
      height={size}
      alt={alt}
      {...rest}
    />
  )
}

export default Icon
