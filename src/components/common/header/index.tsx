import Link from 'next/link'
import { MdCatchingPokemon } from 'react-icons/md'
import { TbListSearch } from 'react-icons/tb'

export const Header = () => {
  return (
    <header className='flex items-center justify-center gap-4 py-6 text-xl'>
      <Link
        href='/'
        className='flex items-center gap-1 border-2 border-gray-500 p-1 transition-all hover:underline hover:brightness-125'
      >
        <TbListSearch />
        Home
      </Link>
      <Link
        href='/pokedex'
        className='relative flex items-center gap-1 border-2 border-gray-500 p-1 transition-all hover:underline hover:brightness-125'
      >
        <MdCatchingPokemon />
        Pokédex
        <div className='absolute right-0 top-0 -translate-y-1/2 translate-x-2/3 rounded-full bg-teal-500 px-2'>
          5
        </div>
      </Link>
    </header>
  )
}
