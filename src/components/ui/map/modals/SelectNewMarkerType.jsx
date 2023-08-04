import React from 'react'
import ModalWrapper from './ModalWrapper'
import Image from 'next/image'


const LAYERS_ICONS = [
  {
    name: 'PMC Spawn',
    img: '/svg/pmc-spawn.svg'
  },
  {
    name: 'Impostor Spawn',
    img: '/svg/impostor-spawn.svg'
  },
  {
    name: 'Safe Box',
    img: '/svg/safe-box.svg'
  },
  {
    name: 'Exit',
    img: '/svg/exit.svg'
  },
  {
    name: 'Key',
    img: '/svg/key.svg'
  },
  {
    name: 'Boss Spawn',
    img: '/svg/boss-spawn.svg'
  }
]

const SelectNewMarkerType = ({ handleCloseModal, handleSelect }) => {
  return (
    <ModalWrapper handleCloseModal={handleCloseModal}>
      <div className="flex flex-col justify-center p-3 gap-3 w-full max-w-[300px] h-full max-h-[350px] bg-white rounded-lg">
        <h2 className='font-semibold text-lg text-center'>
          Select New Marker Type
        </h2>
        <div className="flex flex-col gap-2">
          {
            LAYERS_ICONS.map((layer, index) => (
              <button
                className='relative flex w-full items-center gap-4 py-2 px-3 hover:bg-neutral-200 rounded-md'
                onClick={() => handleSelect(layer.name)}
                key={index}
              >
                <Image
                  src={layer.img}
                  alt={layer.name}
                  width={22}
                  height={22}
                />
                <p className='font-semibold'>{layer.name}</p>
              </button>
            ))
          }
        </div>
      </div>
    </ModalWrapper>
  )
}

export default SelectNewMarkerType