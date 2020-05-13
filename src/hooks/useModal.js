import React, { useState } from 'react'
import ReactDOM,{createPortal} from 'react-dom';

/* 
使用Portal+hooks开发一个Modal组件
React Portal之所以叫Portal，因为做的就是和“传送门”一样的事情：
render到一个组件里面去，实际改变的是网页上另一处的DOM结构。 */

// Modal的UI层，以及渲染层
const Modal = React.memo(({ children, closeModal }) => {
  const domEl = document.getElementById('modal-root')

  if (!domEl) return null
  return ReactDOM.createPortal(
    <div>
      <button onClick={closeModal}>Close</button>
      {children}
    </div>,
    domEl
  )
})



// Modal的hooks逻辑层
const useModal = () => {
  const [isVisible, setIsVisible] = useState(false)
  
  const show = () => setIsVisible(true)
  const hide = () => setIsVisible(false)
  
  const RenderModal = ({ children }) => (
    <React.Fragment>
      {isVisible && <Modal closeModal={hide}>{children}</Modal>}
    </React.Fragment>
  )

  return {
    show,
    hide,
    RenderModal,
  }
}

// 业务层使用useModal
const App = React.memo(() => {
    const { show, hide, RenderModal } = useModal()
    return (
      <div>
        <div>
          <p>some content...</p>
          <button onClick={show}>打开</button>
          <button onClick={hide}>关闭</button>
          <RenderModal>
            <p>这里面的内容将会被渲染到'modal-root'容器里.</p>
          </RenderModal>
        </div>
        <div id='modal-root' />
      </div>
    )
  })
