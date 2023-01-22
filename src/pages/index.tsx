import { useEffect, useMemo, useState } from 'react'
import type { InferGetStaticPropsType } from 'next'
import { type NextPage } from 'next'

import { compress, decompress } from 'compress-json'
import { api } from '../services/api'

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
  compressedPokemons,
  compressedPokemonSearchList,
  //pokemonSearchList,
}) => {
  //memoize server data decompression
  const pokemonList = useMemo(
    () => decompress(compressedPokemons) as DetailedPokemon[],
    [compressedPokemons],
  )

  const pokemonSearchList = useMemo(
    () => decompress(compressedPokemonSearchList) as PokemonSearch[],
    [compressedPokemonSearchList],
  )

  const [, setPokemonList] = useAtom(pokemonListState)
  const [, setPokemonSearchList] = useAtom(pokemonSearchListState)
  const [activeType, setActiveType] = useState('')
  const [filteredPokemons, setFilteredPokemons] = useState(pokemonList)

  //groupPokemons and memoize
  const pokemonsByType = useMemo(() => {
    const newPokemonsByType: PokemonByType = {}

    pokemonList.forEach((pokemon) => {
      pokemon.types.forEach(({ name }) => {
        if (newPokemonsByType.hasOwnProperty(name)) {
          newPokemonsByType[name]?.push(pokemon)
        } else {
          newPokemonsByType[name] = [pokemon]
        }
      })
    })
    return newPokemonsByType
  }, [pokemonList])

  const pokemonTypes = useMemo(
    () => Object.keys(pokemonsByType).sort(),
    [pokemonsByType],
  )

  const searchPokemon = (pokemonName: string) => {
    setActiveType('')
    setFilteredPokemons(
      pokemonList.filter((pokemon) => pokemon.name.includes(pokemonName)),
    )
  }

  const toggleType = (filterTypeName: string) => {
    if (activeType === filterTypeName) {
      setActiveType('')
      setFilteredPokemons(pokemonList)
    } else {
      const newFilteredPokemons = pokemonsByType[filterTypeName]

      if (newFilteredPokemons) {
        setActiveType(filterTypeName)
        setFilteredPokemons(newFilteredPokemons)
      }
    }
  }

  useEffect(() => {
    setPokemonList(pokemonList)
    setPokemonSearchList(pokemonSearchList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Header />
      <main className='flex grow flex-col items-center gap-10 px-4 pb-10'>
        <SearchBox onSearch={searchPokemon} />
        <div className='grid grid-flow-row grid-cols-5 gap-2 text-xs'>
          {pokemonTypes.map((name) => (
            <button
              key={name}
              onClick={() => toggleType(name)}
              className={`rounded border p-2 shadow-sm ${
                activeType === name ? 'bg-app-tertiary' : ''
              }`}
            >
              {name}
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
  const baseUrl = 'https://pokeapi.co/api/v2/'
  const baseImageUrl =
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'

  //get all 151 classic pokemon
  const pokemonListRaw = await api
    .get<PokemonQuery>('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151')
    .then((response) => {
      return response.data.results
    })

  const allPokemonTypes: PokemonType[] = []
  const pokemonSearchList: PokemonSearch[] = []
  const getAllPokemonData = async (pokemon: PokemonLink) => {
    const pokemonData = await api.get<Pokemon>(pokemon.url).then((response) => {
      return response.data
    })

    const types = pokemonData.types.map(({ type: { name, url }, slot }) => {
      return { name, slot, url: url.replace(baseUrl, '') }
    })

    allPokemonTypes.push(...types)
    pokemonSearchList.push({
      id: pokemonData.id,
      urlName: pokemonData.name,
      searchableName: toTitleCase(pokemonData.name),
    })

    return {
      id: pokemonData.id,
      name: pokemonData.name,
      abilities: pokemonData.abilities.map((ability) => {
        return {
          ...ability,
          ability: {
            name: ability.ability.name,
            url: ability.ability.url.replace(baseUrl, ''),
          },
        }
      }),
      species: {
        ...pokemonData.species,
        url: pokemonData.species.url.replace(baseUrl, ''),
      },
      image: pokemonData.sprites.front_default.replace(baseImageUrl, ''),
      imageHq: pokemonData.sprites.other[
        'official-artwork'
      ].front_default?.replace(baseImageUrl, ''),
      stats: pokemonData.stats.map((stats) => {
        return {
          ...stats,
          stat: {
            name: stats.stat.name,
            url: stats.stat.url.replace(baseUrl, ''),
          },
        }
      }),
      types,
      weight: pokemonData.weight,
      height: pokemonData.height,
    }
  }
  const pokemonDataPromisses = pokemonListRaw.map(getAllPokemonData)
  const pokemonsData: DetailedPokemon[] = await Promise.all(
    pokemonDataPromisses,
  )

  pokemonSearchList.sort((a, b) =>
    a.searchableName < b.searchableName ? -1 : 1,
  )

  return {
    props: {
      compressedPokemons: compress(pokemonsData),
      compressedPokemonSearchList: compress(pokemonSearchList),
    },
    revalidate: 60 * 60 * 24 * 30, // 30 days
  }
}
