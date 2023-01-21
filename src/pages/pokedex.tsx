import { type NextPage } from 'next'

import { usePokedexStore } from '../lib/stores/pokedex'

import { Header } from '../components/common/header'
import { PokemonList } from '../components/common/pokemonList'

const Pokedex: NextPage = () => {
  const pokemons = usePokedexStore((state) => state.pokemons)

  return (
    <>
      <Header />
      <main className='flex grow flex-col items-center gap-2'>
        <p className='text-xl font-bold'>Captured Pokémons</p>
        <PokemonList pokemons={pokemons} allowCatching={false} pokedexMode />
      </main>
    </>
  )
}

export default Pokedex
