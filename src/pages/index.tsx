import { useEffect, useState } from 'react'
import type { InferGetStaticPropsType } from 'next'
import { type NextPage } from 'next'

import type { Pokemon, PokemonSearch, PokemonTypeLink } from '../@types/pokemon'

import { Header } from '../components/common/header'
import { SearchBox } from '../components/common/pokemonSearch'
import { BasicCard } from '../components/common/pokemonCards/basic'

import axios from 'axios'

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
}) => {
  // const [queryEnabled, setQueryEnabled] = useState(false)
  // const [currentPokemonId, setCurrentPokemonId] = useState('1')
  const [pokemonDisplayableList, setPokemonDisplayableList] = useState<
    typeof pokemons
  >(pokemons.slice(0, 10))
  const [activeTypes, setActiveTypes] = useState<string[]>([])

  // const { data } = useQuery<Pokemon>({
  //   queryKey: ['pokemon', currentPokemonId],
  //   enabled: queryEnabled,
  //   queryFn: () => {
  //     return api
  //       .get<Pokemon>(`pokemon/${currentPokemonId}`)
  //       .then((response) => {
  //         console.log(response.data)

  //         return response.data
  //       })
  //   },
  // })

  const searchPokemon = (pokemon: PokemonSearch) => {
    //setCurrentPokemonId(pokemon.id.toString())
    //setQueryEnabled(true)
    console.log('search ', pokemon)
  }
  const toggleType = (type: string) => {
    if (!activeTypes.includes(type)) {
      setActiveTypes((prev) => [...prev, type])
    } else {
      setActiveTypes((prev) => prev.filter((prevType) => prevType != type))
    }
  }

  useEffect(() => {
    if (activeTypes.length > 0) {
      const newDisplayList = pokemons.filter((pokemon) => {
        return pokemon.types.some((type) => activeTypes.includes(type.name))
      })
      setPokemonDisplayableList(newDisplayList.slice(0, 10))
    } else {
      setPokemonDisplayableList(pokemons.slice(0, 10))
    }
  }, [activeTypes, pokemons])

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
                activeTypes.includes(type.name) ? 'bg-teal-500' : ''
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
        {/* {data && <p>{data.name}</p>} */}
        <section className='grid grid-cols-2 gap-3'>
          {pokemonDisplayableList.map((pokemon) => (
            <BasicCard
              key={pokemon.id}
              name={pokemon.name}
              image={pokemon.image}
            />
          ))}
        </section>
      </main>
    </>
  )
}

export default Home

export const getStaticProps = async () => {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const pokemonListRaw = await axios
    .get<PokemonQuery>('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20')
    .then((response) => {
      return response.data.results
    })

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

  return {
    props: {
      pokemons: pokemonsData,
      pokemonTypes: uniquePokemonTypes,
    },
    revalidate: 60 * 60 * 24 * 30, // 30 days
  }
}
