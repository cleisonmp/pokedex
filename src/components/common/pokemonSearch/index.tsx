import type { ChangeEventHandler } from 'react'
import { useState } from 'react'
import type { PokemonSearch } from '../../../@types/pokemon'
import { pokemonSearchList } from './data'

type SearchBoxProps = {
  onSearch: (pokemon: PokemonSearch) => void
}

export const SearchBox = ({ onSearch }: SearchBoxProps) => {
  const [value, setValue] = useState('')
  const [showSearchList, setShowSearchList] = useState(false)
  const listItems = pokemonSearchList
    .filter((item) => {
      const searchTerm = value.toLowerCase()
      const fullName = item.searchableName.toLowerCase()
      const pokemonId = item.id

      return (
        (searchTerm && fullName.includes(searchTerm)) ||
        searchTerm === pokemonId.toString()
      )
    })
    .slice(0, 10)

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setValue(event.target.value)
    setShowSearchList(true)
  }

  const searchPokemon = (pokemon: PokemonSearch) => {
    setValue(pokemon.searchableName)
    setShowSearchList(false)
    onSearch(pokemon)
  }

  return (
    <div className='flex flex-col gap-2 text-lg'>
      <h1>Search a Pokémon by name or number id</h1>

      <div className='relative'>
        <input
          type='text'
          className='w-full rounded p-2 text-black'
          value={value}
          onChange={onChange}
        />

        <div className='absolute w-full bg-gray-800'>
          {showSearchList &&
            listItems.map((pokemon) => (
              <div
                onClick={() => searchPokemon(pokemon)}
                className='cursor-pointer p-2'
                key={pokemon.id}
              >
                {pokemon.searchableName}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
