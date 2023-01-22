import Link from 'next/link'
import { MdCatchingPokemon } from 'react-icons/md'
import { TbListSearch } from 'react-icons/tb'
import { usePokedexStore } from '../../../lib/stores/pokedex'

export const Header = () => {
  const totalPokemonsCatched = usePokedexStore((state) => state.pokemons.length)

  return (
    <header className='flex items-center justify-center gap-4 py-6 text-xl sticky top-0 z-9999 bg-app-background'>
      <Link
        href='/'
        className='flex items-center gap-1 border-2 border-gray-700 p-1 transition-all hover:underline hover:scale-105 '
      >
        <TbListSearch />
        Home
      </Link>
      <Link
        href='/pokedex'
        className='relative flex items-center gap-1 border-2 border-gray-700 p-1 transition-all hover:underline hover:scale-105'
      >
        <MdCatchingPokemon />
        Pokédex
        {totalPokemonsCatched > 0 && (
          <div className='absolute right-0 top-0 -translate-y-1/2 translate-x-2/3 rounded-full bg-app-tertiary px-2 text-sm'>
            {totalPokemonsCatched}
          </div>
        )}
      </Link>
    </header>
  )
}
