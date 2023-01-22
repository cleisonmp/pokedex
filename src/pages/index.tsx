import { useEffect, useMemo, useState } from 'react'
import type { InferGetStaticPropsType } from 'next'
import { type NextPage } from 'next'
import axios from 'axios'

import type {
  DetailedPokemon,
  Pokemon,
  PokemonSearch,
  PokemonType,
} from '../@types/pokemon'

import { Header } from '../components/common/header'
import { SearchBox } from '../components/common/pokemonSearch'
import { PokemonList } from '../components/common/pokemonList'
import { useAtom } from 'jotai'
import { pokemonListState } from '../lib/atoms/pokemonList'
import { toTitleCase } from '../lib/utils/toTitleCase'
import { pokemonSearchListState } from '../lib/atoms/pokemonSearchList'

type PokemonLink = {
  name: string
  url: string
}

type PokemonQuery = {
  count: number
  next: string
  previous: number | null
  results: PokemonLink[]
}

type PokemonByType = {
  [k: string]: DetailedPokemon[]
}

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  pokemons,
  pokemonTypes,
  pokemonSearchList,
}) => {
  const [, setPokemonList] = useAtom(pokemonListState)
  const [, setPokemonSearchList] = useAtom(pokemonSearchListState)
  const [activeType, setActiveType] = useState('')
  const [filteredPokemons, setFilteredPokemons] = useState(pokemons)

  //groupPokemons and memoize
  const pokemonsByType = useMemo(() => {
    const pokemonsByType: PokemonByType = {}

    pokemonTypes.forEach((uniqueType) => {
      const currentPokemonsByType = pokemons.filter((pokemon) =>
        pokemon.types.some((type) => type.name === uniqueType.name),
      )
      pokemonsByType[uniqueType.name] = currentPokemonsByType
    })

    return pokemonsByType
  }, [pokemonTypes, pokemons])

  const searchPokemon = (pokemonName: string) => {
    setActiveType('')
    setFilteredPokemons(
      pokemons.filter((pokemon) => pokemon.name.includes(pokemonName)),
    )
  }

  const toggleType = (filterTypeName: string) => {
    if (activeType === filterTypeName) {
      setActiveType('')
      setFilteredPokemons(pokemons)
    } else {
      const newFilteredPokemons = pokemonsByType[filterTypeName]

      if (newFilteredPokemons) {
        setActiveType(filterTypeName)
        setFilteredPokemons(newFilteredPokemons)
      }
    }
  }

  useEffect(() => {
    setPokemonList(pokemons)
    setPokemonSearchList(pokemonSearchList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Header />
      <main className='flex grow flex-col items-center gap-10 px-4 pb-10'>
        <SearchBox onSearch={searchPokemon} />
        <div className='grid grid-flow-row grid-cols-5 gap-2 text-xs'>
          {pokemonTypes.map((type) => (
            <button
              key={type.name}
              onClick={() => toggleType(type.name)}
              className={`rounded border p-2 ${
                activeType.includes(type.name) ? 'bg-teal-500' : ''
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
        <PokemonList pokemons={filteredPokemons} />
      </main>
    </>
  )
}

export default Home

export const getStaticProps = async () => {
  //get all 151 classic pokemon
  const pokemonListRaw = await axios
    .get<PokemonQuery>('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151')
    .then((response) => {
      return response.data.results
    })

  //TODO optimize data removing repeated link contents
  const allPokemonTypes: PokemonType[] = []
  const pokemonSearchList: PokemonSearch[] = []
  const getAllPokemonData = async (pokemon: PokemonLink) => {
    const pokemonData = await axios
      .get<Pokemon>(pokemon.url)
      .then((response) => {
        return response.data
      })

    const types = pokemonData.types.map((type) => {
      return { slot: type.slot, ...type.type }
    })

    allPokemonTypes.push(...types)
    pokemonSearchList.push({
      id: pokemonData.id,
      urlName: pokemonData.name,
      searchableName: toTitleCase(pokemonData.name),
    })

    return {
      url: pokemon.url,
      id: pokemonData.id,
      name: pokemonData.name,
      abilities: pokemonData.abilities,
      species: pokemonData.species,
      image: pokemonData.sprites.front_default,
      imageHq: pokemonData.sprites.other['official-artwork'].front_default,
      stats: pokemonData.stats,
      types,
      weight: pokemonData.weight,
      height: pokemonData.height,
    }
  }
  const pokemonDataPromisses = pokemonListRaw.map(getAllPokemonData)
  const pokemonsData: DetailedPokemon[] = await Promise.all(
    pokemonDataPromisses,
  )
  const uniquePokemonTypes: PokemonType[] = []

  allPokemonTypes.forEach((type) => {
    if (
      uniquePokemonTypes.findIndex(
        (uniqueType) => uniqueType.name === type.name,
      ) === -1
    ) {
      uniquePokemonTypes.push(type)
    }
  })

  uniquePokemonTypes.sort((a, b) => (a.name < b.name ? -1 : 1))
  pokemonSearchList.sort((a, b) =>
    a.searchableName < b.searchableName ? -1 : 1,
  )

  return {
    props: {
      pokemons: pokemonsData,
      pokemonTypes: uniquePokemonTypes,
      pokemonSearchList,
    },
    revalidate: 60 * 60 * 24 * 30, // 30 days
  }
}
