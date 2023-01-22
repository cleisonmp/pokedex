import { useAtom } from 'jotai'
import Link from 'next/link'

import {
  editModalState,
  pokemonToEditState,
} from '../../../../lib/atoms/editModal'

import { usePokedexStore } from '../../../../lib/stores/pokedex'
import { BasicCard } from '../basic'

type PokedexCardProps = {
  id: number
  name: string
  image: string
}

export const PokedexCard = ({ id, name, image }: PokedexCardProps) => {
  const removeFromPokedex = usePokedexStore((state) => state.remove)
  const [, setIsEditing] = useAtom(editModalState)
  const [, setPokemonToEdit] = useAtom(pokemonToEditState)

  const handleRename = () => {
    setPokemonToEdit({ id, name })
    setIsEditing(true)
  }

  return (
    <div className='relative'>
      <Link href={`/pokemon/${name}`} key={id}>
        <BasicCard name={name} image={image} />
      </Link>
      <div className='flex justify-between px-2 py-1 text-white text-sm'>
        <button
          type='button'
          onClick={handleRename}
          className='bg-app-secondary px-2 font-bold rounded-lg transition-all hover:bg-app-tertiary focus:outline-none focus-visible:ring-1 focus-visible:ring-app-tertiary'
        >
          Rename
        </button>
        <button
          type='button'
          onClick={() => removeFromPokedex(id)}
          className='bg-app-primary px-2 font-bold rounded-lg transition-all hover:bg-app-tertiary focus:outline-none focus-visible:ring-1 focus-visible:ring-app-tertiary'
        >
          Release
        </button>
      </div>
    </div>
  )
}
