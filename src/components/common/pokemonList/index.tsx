import { useState } from 'react'
import type { DetailedPokemon } from '../../../@types/pokemon'
import { Modal } from '../modal'
import { BasicCard } from '../pokemonCards/basic'
import { DetailCard } from '../pokemonCards/detailed'

type PokemonListProps = {
  allowCatching?: boolean
  pokemons: DetailedPokemon[]
}

export const PokemonList = ({
  allowCatching = true,
  pokemons,
}: PokemonListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPokemon, setCurrentPokemon] = useState<DetailedPokemon>()

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
            <DetailCard
              pokemon={currentPokemon}
              allowCatching={allowCatching}
            />
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
        {pokemons.slice(0, pokemonsToShow).map((pokemon) => (
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
