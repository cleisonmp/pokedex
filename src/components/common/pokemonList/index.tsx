import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import type {
  DetailedPokemon,
  EvolutionChain,
  SpeciesDetail,
} from '../../../@types/pokemon'
import { Modal } from '../modal'
import { BasicCard } from '../pokemonCards/basic'
import { DetailCard } from '../pokemonCards/detailed'
import { PokedexCard } from '../pokemonCards/pokedex'

type PokemonListProps = {
  allowCatching?: boolean
  pokemons: DetailedPokemon[]
  pokedexMode?: boolean
}

export const PokemonList = ({
  allowCatching = true,
  pokemons,
  pokedexMode = false,
}: PokemonListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPokemon, setCurrentPokemon] = useState<DetailedPokemon>()

  const { data: currentPokemonEvolutions } = useQuery({
    queryKey: ['pokemon', 'evolutions', currentPokemon?.id],
    queryFn: async () => {
      if (currentPokemon?.species.url) {
        return await axios
          .get<SpeciesDetail>(currentPokemon?.species.url)
          .then(async (response) => {
            return await axios
              .get<EvolutionChain>(response.data.evolution_chain.url)
              .then((chainResponse) => {
                const basePokemon = pokemons.find(
                  (poke) => poke.name === chainResponse.data.chain.species.name,
                )

                const firstEvolution = pokemons.find(
                  (poke) =>
                    poke.name ===
                    chainResponse.data.chain.evolves_to[0]?.species.name,
                )

                const secondEvolution = pokemons.find(
                  (poke) =>
                    poke.name ===
                    chainResponse.data.chain.evolves_to[0]?.evolves_to[0]
                      ?.species.name,
                )

                const evolutionsResponse: DetailedPokemon[] = []
                basePokemon && evolutionsResponse.push(basePokemon)
                firstEvolution && evolutionsResponse.push(firstEvolution)
                secondEvolution && evolutionsResponse.push(secondEvolution)

                return evolutionsResponse
              })
          })
      }
      return null
    },
  })

  const [pokemonsToShow, setPokemonsToShow] = useState(10)
  const hasMorePokemonsToShow = pokemonsToShow < (pokemons?.length ?? 0)

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
      <Modal setIsOpen={setIsModalOpen} isOpen={isModalOpen} title=''>
        <div className='flex items-center justify-center'>
          {currentPokemon && (
            <div className='flex flex-col gap-2'>
              <DetailCard
                pokemon={currentPokemon}
                allowCatching={allowCatching}
              />
              {currentPokemonEvolutions ? (
                <PokemonList pokemons={currentPokemonEvolutions} />
              ) : (
                <p className='text-lg font-bold text-gray-800'>
                  Loading evolutions...
                </p>
              )}
            </div>
          )}
        </div>
        <button
          type='button'
          className='absolute right-0 top-0 inline-flex -translate-x-2/3 translate-y-1/3 items-center justify-center rounded-full px-1 text-sm font-bold text-red-500 transition-all hover:bg-gray-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-500'
          onClick={() => setIsModalOpen(false)}
        >
          X
        </button>
      </Modal>

      <section className='grid grid-cols-2 gap-3'>
        {pokedexMode
          ? pokemons
              .slice(0, pokemonsToShow)
              .map((pokemon) => (
                <PokedexCard
                  key={pokemon.id}
                  id={pokemon.id}
                  name={pokemon.name}
                  image={pokemon.image}
                  onClick={() => openPokemonDetail(pokemon.id)}
                />
              ))
          : pokemons
              .slice(0, pokemonsToShow)
              .map((pokemon) => (
                <BasicCard
                  key={pokemon.id}
                  name={pokemon.name}
                  image={pokemon.image}
                  onClick={() => openPokemonDetail(pokemon.id)}
                />
              ))}
      </section>
      {hasMorePokemonsToShow && (
        <button
          className='flex select-none items-center justify-center rounded-lg bg-slate-200 py-2 px-4 font-bold text-gray-800 hover:bg-slate-300'
          onClick={loadMorePokemons}
        >
          Load more...
        </button>
      )}
    </>
  )
}
