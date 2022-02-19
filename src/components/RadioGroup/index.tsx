import React, { ReactNode } from 'react';
export const { Provider, Consumer } = React.createContext<Iprops>({});
import './index.scss'
interface Iprops {
  children?: ReactNode;
  value?: any,
  onChange?: (index: any) => void
}
export const Radio = function (props) {
  const { name } = props
  return (
    <Consumer>
      {(sentProps) =>
        <div className='Radio tabColor'>
          {
            name === sentProps.value ? <div className='Radio-checked'>
              <i className='myIcon Radio-checked-i'>&#xe739;</i>
            </div> : <div className='Radio-noCheck' onClick={sentProps.onChange?.bind(this, name)}><i className='myIcon Radio-noCheck-i' >&#xe728;</i></div>
          }
          {props.children && <span className='Radio-label'>
            {
              props.children
            }
          </span>}
        </div>
      }

    </Consumer>
  )
}
export const RadioGroup = function (props: Iprops) {
  const { value, onChange } = props
  let sentProps = { value, onChange }

  return (
    <Provider value={sentProps}>
      <div className='bw-RadioGroup'>
        {props.children}
      </div>
    </Provider>

  )
}

export default RadioGroup
