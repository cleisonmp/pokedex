import { useState } from 'react'
import type { InferGetStaticPropsType } from 'next'
import { type NextPage } from 'next'
import axios from 'axios'

import type { Pokemon, PokemonSearch, PokemonTypeLink } from '../@types/pokemon'

import { Header } from '../components/common/header'
import { SearchBox } from '../components/common/pokemonSearch'
import { BasicCard } from '../components/common/pokemonCards/basic'
import { Modal } from '../components/common/modal'

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

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  pokemons,
  pokemonTypes,
  pokemonsByType,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPokemon, setCurrentPokemon] = useState<(typeof pokemons)[0]>()
  const [pokemonsToShow, setPokemonsToShow] = useState(10)
  const [activeType, setActiveType] = useState('')
  const [filteredPokemons, setFilteredPokemons] = useState(
    activeType.length > 0 ? pokemonsByType[activeType] : pokemons,
  )

  const hasMorePokemonsToShow = pokemonsToShow < (filteredPokemons?.length ?? 0)

  const searchPokemon = (pokemonName: PokemonSearch) => {
    setActiveType('')
    setFilteredPokemons(
      pokemons.filter((pokemon) => pokemon.name.includes(pokemonName.urlName)),
    )
  }
  const toggleType = (type: string) => {
    if (activeType === type) {
      setActiveType('')
      setFilteredPokemons(pokemons)
    } else {
      setActiveType(type)
      setFilteredPokemons(pokemonsByType[type])
    }
  }
  const loadMorePokemons = () => {
    setPokemonsToShow((prev) => {
      if (hasMorePokemonsToShow) {
        return prev + 10
      }
      return prev
    })
  }

  const openPokemonDetail = (pokemonId: number) => {
    setIsModalOpen(true)
    setCurrentPokemon(pokemons.find((poke) => poke.id === pokemonId))
  }

  return (
    <>
      <Header />
      <Modal
        setIsOpen={setIsModalOpen}
        isOpen={isModalOpen}
        title={currentPokemon?.name.replaceAll('-', ' ') ?? ''}
      >
        <div className='relative flex gap-2'>
          <p className='text-sm text-gray-500'>{currentPokemon?.name}</p>
        </div>
        <button
          type='button'
          className='absolute right-0 top-0 inline-flex -translate-x-2/3 translate-y-1/3 items-center justify-center rounded-full px-1 text-sm font-bold text-red-500 transition-all hover:bg-gray-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-500'
          onClick={() => setIsModalOpen(false)}
        >
          X
        </button>
      </Modal>
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
        <section className='grid grid-cols-2 gap-3'>
          {filteredPokemons?.slice(0, pokemonsToShow).map((pokemon) => (
            <BasicCard
              key={pokemon.id}
              name={pokemon.name}
              image={pokemon.image}
              onClick={() => openPokemonDetail(pokemon.id)}
            />
          ))}
        </section>
        {hasMorePokemonsToShow && (
          <button onClick={loadMorePokemons}>Load more...</button>
        )}
      </main>
    </>
  )
}

export default Home

export const getStaticProps = async () => {
  const pokemonListRaw = await axios
    .get<PokemonQuery>('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=79')
    .then((response) => {
      return response.data.results
    })

  //TODO optimize data removing repeated link contents
  const allPokemonTypes: PokemonTypeLink[] = []
  const getAllPokemonData = async (pokemon: PokemonLink) => {
    const pokemonData = await axios
      .get<Pokemon>(pokemon.url)
      .then((response) => {
        return response.data
      })

    allPokemonTypes.push(...pokemonData.types.map((type) => type.type))

    return {
      url: pokemon.url,
      id: pokemonData.id,
      name: pokemonData.name,
      species: pokemonData.species,
      image: pokemonData.sprites.front_default,
      stats: pokemonData.stats,
      types: pokemonData.types.map((types) => types.type),
      weight: pokemonData.weight,
    }
  }
  const pokemonDataPromisses = pokemonListRaw.map(getAllPokemonData)
  const pokemonsData = await Promise.all(pokemonDataPromisses)
  const uniquePokemonTypes: PokemonTypeLink[] = []

  allPokemonTypes.forEach((type) => {
    if (
      uniquePokemonTypes.findIndex(
        (uniqueType) => uniqueType.name === type.name,
      ) === -1
    ) {
      uniquePokemonTypes.push(type)
    }
  })

  type PokemonByType = {
    [k: string]: Pick<(typeof pokemonsData)[0], 'id' | 'name' | 'image'>[]
  }
  const pokemonsByType: PokemonByType = {}

  uniquePokemonTypes.forEach((uniqueType) => {
    const currentPokemonsByType = pokemonsData.filter((pokemon) =>
      pokemon.types.some((type) => type.name === uniqueType.name),
    )
    pokemonsByType[uniqueType.name] = currentPokemonsByType.map(
      ({ id, name, image }) => {
        return { id, name, image }
      },
    )
  })
  uniquePokemonTypes.sort((a, b) => (a.name < b.name ? -1 : 1))

  return {
    props: {
      pokemons: pokemonsData,
      pokemonTypes: uniquePokemonTypes,
      pokemonsByType,
    },
    revalidate: 60 * 60 * 24 * 30, // 30 days
  }
}
