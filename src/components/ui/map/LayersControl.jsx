import React from 'react'
import Image from 'next/image'

const LAYERS = [
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
  },
]

const LayersControl = ({
  toggleLayer,
  layers,
}) => {
  return (
    <div className='bg-white rounded-md py-2 px-4'>
      <h2 className='font-semibold text-center text-lg'>
        Layers
      </h2>
      <ul className='flex flex-col gap-2 my-4'>
        {
          LAYERS.map((layer, index) => (
            <li
              className='w-full'
              key={index}
            >
              <button
                className='relative flex w-full items-center gap-3 py-2 hover:bg-neutral-200 rounded-md'
                onClick={() => toggleLayer(layer.name)}
              >
                {
                  layers[layer.name] === false && (
                    <div className='h-[2px] absolute top-1/2 -translate-y-1/2 w-full bg-red-800'>
                    </div>
                  )
                }
                <Image
                  src={layer.img}
                  alt={layer.name}
                  width={22}
                  height={22}
                  className='ml-2'
                />
                <span className='text-md leading-none font-semibold text-[#333] mr-2'>
                  {layer.name}
                </span>
              </button>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default LayersControl