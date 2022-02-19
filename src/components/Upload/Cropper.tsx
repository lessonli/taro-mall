import { Button, View, Text } from "@tarojs/components"
import ReactDOM from 'react-dom'
import CropperC from "react-cropper"
import { useRef } from "react"
import Cropper from 'cropperjs'
import './Cropper.ui.scss'

let zIndex = 2000 

if (process.env.TARO_ENV === 'h5') {
  require('cropperjs/dist/cropper.css')
}

export default (props: {
  src: string,
  /**
   * 裁剪比例
   */
  aspectRatio?: number;
}): Promise<{
  src: string;
}> => {
  zIndex++
  return new Promise((resolve, reject) => {

    const root = document.createElement('div')
    root.setAttribute('class', 'hhjjjhjhj')
    root.setAttribute('style', `z-index: ${zIndex}; position: fixed; top: 0; left: 0; bottom: 0; right: 0;`)
    console.log(root)

    document.body.appendChild(root)

    const C = () => {

      const cropperIns = useRef<Cropper | undefined>(undefined)

      return <View className="CropperC-componnet">
        <View className="CropperC-componnet-1">
          <CropperC
            style={{height: '100%', width: '100%'}}
            zoomTo={0.5}
            aspectRatio={props.aspectRatio || 1}
            src={props.src}
            viewMode={1}
            checkOrientation={false}
            guides={true}
            onInitialized={(instance) => {
              cropperIns.current = instance
            }}
          />
        </View>
        <View className="CropperC-componnet-2">
          <Text className="myIcon CropperC-componnet-2-btn"
            onClick={() => {
              reject()
              ReactDOM.unmountComponentAtNode(root)
              root.parentNode?.removeChild(root)
            }}
          >&#xe746;</Text>
          <Text className="myIcon CropperC-componnet-2-btn"
            onClick={() => {
              const b64 = cropperIns.current?.getCroppedCanvas().toDataURL()
              resolve({src: b64})
              ReactDOM.unmountComponentAtNode(root)
              root.parentNode?.removeChild(root)
            }}
          >&#xe74c;</Text>
        </View>
      </View>
    }
    
    ReactDOM.render(<C />, root)

  })
}