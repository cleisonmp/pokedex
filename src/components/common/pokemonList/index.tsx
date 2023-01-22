import { useState } from 'react'
import Link from 'next/link'

import type { DetailedPokemon } from '../../../@types/pokemon'
import { BasicCard } from '../pokemonCards/basic'
import { PokedexCard } from '../pokemonCards/pokedex'
import { Button } from '../button'

type PokemonListProps = {
  allowCatching?: boolean
  pokemons: DetailedPokemon[]
  pokedexMode?: boolean
}

export const PokemonList = ({
  pokemons,
  pokedexMode = false,
}: PokemonListProps) => {
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

  return (
    <>
      <section className='grid grid-cols-2 gap-3'>
        {pokemons.slice(0, pokemonsToShow).map((pokemon) =>
          pokedexMode ? (
            <PokedexCard
              key={pokemon.id}
              id={pokemon.id}
              name={pokemon.name}
              image={pokemon.image}
            />
          ) : (
            <Link href={`/pokemon/${pokemon.name}`} key={pokemon.id}>
              <BasicCard name={pokemon.name} image={pokemon.image} />
            </Link>
          ),
        )}
      </section>
      {hasMorePokemonsToShow && (
        <Button
          text='Load more...'
          size='medium'
          clickHandler={loadMorePokemons}
        />
      )}
    </>
  )
}
