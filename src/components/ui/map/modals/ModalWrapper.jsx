import React from 'react'

const ModalWrapper = ({ handleCloseModal, children }) => {
  return (
    <div
      id="import-modal"
      className="z-[1002] absolute flex items-center justify-center w-full h-full bg-black bg-opacity-25"
      onClick={(e) => {
        if (e.target.id === "import-modal") {
          handleCloseModal(false)
        }
      }}
    >
      {children}
    </div>
  )
}

export default ModalWrapper