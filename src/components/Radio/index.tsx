import { Consumer } from '../RadioGroup'
import './index.scss'

const Radio = (props) => {
  const { name } = props
  return (
    <Consumer>
      {(sentProps) =>

        <div className='Radio'>
          {
            name === sentProps.value ? <div className='Radio-checked'>
              <i className='myIcon Radio-checked-i'>&#xe6f9;</i>
            </div> : <div className='Radio-noCheck' onClick={sentProps.onChange?.bind(this, name)}></div>
          }
          <span className='Radio-label'>
            {
              props.children
            }
          </span>

        </div>
      }

    </Consumer>
  )
}

export default Radio
