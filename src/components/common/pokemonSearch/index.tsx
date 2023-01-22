import type { ChangeEventHandler } from 'react'
import { useState } from 'react'

import { useAtom } from 'jotai'
import { FaSearch } from 'react-icons/fa'

import { pokemonSearchListState } from '../../../lib/atoms/pokemonSearchList'

type SearchBoxProps = {
  onSearch: (pokemonName: string) => void
}

export const SearchBox = ({ onSearch }: SearchBoxProps) => {
  const [value, setValue] = useState('')
  const [showSearchList, setShowSearchList] = useState(false)
  const [pokemonSearchList] = useAtom(pokemonSearchListState)

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

  const searchPokemon = (pokemonName: string) => {
    setValue(pokemonName)
    setShowSearchList(false)
    onSearch(pokemonName)
  }

  return (
    <form
      className='flex flex-col gap-2 text-lg'
      onSubmit={(e) => {
        e.preventDefault()
        searchPokemon(value)
      }}
    >
      <h1>Search a Pokémon by name or number id</h1>

      <div className='relative'>
        <div className='w-full flex items-center'>
          <input
            type='text'
            className='w-full rounded p-2 text-black shadow-sm'
            value={value}
            onChange={onChange}
            onBlur={() => setShowSearchList(false)}
          />
          <button className='p-1 ' type='submit' title='Search'>
            <FaSearch className='w-8 h-8' />
          </button>
        </div>
        <div className='absolute w-full bg-app-backgroundDark'>
          {showSearchList &&
            listItems.map((pokemon) => (
              <div
                onMouseDown={() => searchPokemon(pokemon.urlName)}
                className='cursor-pointer p-2'
                key={pokemon.id}
              >
                {pokemon.searchableName}
              </div>
            ))}
        </div>
      </div>
    </form>
  )
}
