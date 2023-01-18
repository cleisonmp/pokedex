import { useState } from 'react'
import { type NextPage } from 'next'

import { useQuery } from '@tanstack/react-query'

import { api } from '../services/api'
import type { Pokemon, PokemonSearch } from '../@types/pokemon'

import { Header } from '../components/common/header'
import { SearchBox } from '../components/common/pokemonSearch'

const Home: NextPage = () => {
  const [queryEnabled, setQueryEnabled] = useState(false)
  const [currentPokemonId, setCurrentPokemonId] = useState('1')

  const { data } = useQuery<Pokemon>({
    queryKey: ['pokemon', currentPokemonId],
    enabled: queryEnabled,
    queryFn: () => {
      return api
        .get<Pokemon>(`pokemon/${currentPokemonId}`)
        .then((response) => {
          console.log(response.data)

          return response.data
        })
    },
  })

  const searchPokemon = (pokemon: PokemonSearch) => {
    setCurrentPokemonId(pokemon.id.toString())
    setQueryEnabled(true)

    console.log('search ', pokemon)
  }

  return (
    <>
      <Header />
      <main className='flex grow flex-col items-center gap-10 px-4 pb-10'>
        <SearchBox onSearch={searchPokemon} />
        {data && <p>{data.name}</p>}
      </main>
    </>
  )
}

export default Home
