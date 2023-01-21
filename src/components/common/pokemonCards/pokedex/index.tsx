import type { MouseEventHandler } from 'react'
import { usePokedexStore } from '../../../../lib/stores/pokedex'
import { BasicCard } from '../basic'

type PokedexCardProps = {
  id: number
  name: string
  image: string
  onClick: MouseEventHandler<HTMLButtonElement>
}

export const PokedexCard = ({ id, name, image, onClick }: PokedexCardProps) => {
  const { update, remove } = usePokedexStore()

  return (
    <div className='relative'>
      <BasicCard
        name={name}
        image={image}
        onClick={onClick}
        onEdit={(newName) => {
          update(id, newName)
        }}
      />
      <button
        type='button'
        onClick={() => remove(id)}
        className='absolute right-0 top-0 inline-flex translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full bg-gray-300 px-2 font-bold text-red-500 transition-all hover:bg-gray-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-500'
      >
        X
      </button>
    </div>
  )
}
