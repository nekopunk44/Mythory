import clsx from 'clsx'
import useSlider from './useSlider'
import './Slider.scss'

const Slider = (props) => {
  const { trackRef, className, children, ...rest } = props
  const { trackRef: internalTrackRef } = useSlider()
  const actualTrackRef = trackRef ?? internalTrackRef

  return (
    <div className={clsx('slider', className)} {...rest}>
      <div className="slider__track" ref={actualTrackRef}>
        {children}
      </div>
    </div>
  )
}

export default Slider
