import Image from 'next/image'
import type { MouseEventHandler } from 'react'

type BasicCardProps = {
  name: string
  image: string
  onClick: MouseEventHandler<HTMLButtonElement>
}

export const BasicCard = ({ name, image, onClick }: BasicCardProps) => {
  return (
    <button
      onClick={onClick}
      className='flex h-40 w-40 flex-col items-center justify-center overflow-hidden rounded-lg border-8 border-gray-700 bg-gray-50 text-xl text-gray-500 lg:h-48 lg:w-48'
    >
      <Image
        // src={
        //   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
        // }
        src={image}
        width='90'
        height='90'
        alt=''
      />

      <p className='w-full p-2 text-center font-start text-[8px]'>{name}</p>
    </button>
  )
}
