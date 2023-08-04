'use client'
import React, { useState } from 'react'
import ModalWrapper from './ModalWrapper'
import Image from 'next/image'

const ImportMapModal = ({
  handleCloseModal,
  handleImportMap
}) => {
  const [importMapValue, setImportMapValue] = useState('')
  return (
    <ModalWrapper handleCloseModal={handleCloseModal}>
      <div className="flex flex-col justify-center p-3 gap-3 w-full max-w-[300px] h-full max-h-[350px] bg-white rounded-lg">
        <h2>
          Import Map
        </h2>
        <textarea className="p-3 grow" placeholder="Paste JSON" value={importMapValue} onChange={e => setImportMapValue(e.target.value)} />
        <button
          onClick={() => handleImportMap(importMapValue)}
          className="flex justify-center items-center gap-2 w-full py-1 px-3 bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-md text-center text-white font-semibold"
        >
          <Image width={22} height={22} src="/svg/import.svg" alt='import icon' />
          <p>Import</p>
        </button>
      </div>
    </ModalWrapper >)
}

export default ImportMapModal