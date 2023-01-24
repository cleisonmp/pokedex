import dynamic from 'next/dynamic'
import Link from 'next/link'
import { MdCatchingPokemon } from 'react-icons/md'
import { TbListSearch } from 'react-icons/tb'

const PokemonCount = dynamic(
  () => import('./pokemonCount').then((component) => component.PokemonCount),
  {
    ssr: false,
  },
)

export const Header = () => {
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
        <PokemonCount />
      </Link>
    </header>
  )
}
