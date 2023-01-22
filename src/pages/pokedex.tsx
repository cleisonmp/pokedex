import { type NextPage } from 'next'

import { usePokedexStore } from '../lib/stores/pokedex'

import { Header } from '../components/common/header'
import { PokemonList } from '../components/common/pokemonList'
import { Modal } from '../components/common/modal'
import type { FormEventHandler } from 'react'
import { useRef } from 'react'
import { toTitleCase } from '../lib/utils/toTitleCase'
import { useAtom } from 'jotai'
import { pokemonToEditState, editModalState } from '../lib/atoms/editModal'

const Pokedex: NextPage = () => {
  const { pokemons, update } = usePokedexStore()
  const [isEditing, setIsEditing] = useAtom(editModalState)
  const [pokemonToEdit] = useAtom(pokemonToEditState)

  const inputRef = useRef<HTMLInputElement>(null)

  const handleSave: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    setIsEditing(false)
    const newName = inputRef.current?.value
    if (newName) {
      update(pokemonToEdit.id, newName)
    }
  }

  return (
    <>
      <Modal
        setIsOpen={setIsEditing}
        isOpen={isEditing}
        title='Edit your pokémon name'
      >
        <form className='mt-2 flex flex-col gap-4' onSubmit={handleSave}>
          <div>
            <p className='w-full p-2 text-xs text-gray-800'>
              Current:
              <span className='text-sm font-bold'>
                {toTitleCase(pokemonToEdit.name)}
              </span>
            </p>

            <input
              type='text'
              className='w-full border p-2 text-gray-800'
              ref={inputRef}
              maxLength={25}
            />
          </div>
          <div className='flex w-full justify-center gap-2'>
            <button
              type='submit'
              className='hover:bg-grey inline-flex items-center rounded bg-teal-500 py-2 px-4 font-bold transition-colors hover:bg-teal-700'
            >
              <span>Save</span>
            </button>
            <button
              type='button'
              onClick={() => setIsEditing(false)}
              className='hover:bg-grey inline-flex items-center rounded bg-red-500 py-2 px-4 font-bold transition-colors hover:bg-red-700'
            >
              <span>Cancel</span>
            </button>
          </div>
        </form>
      </Modal>
      <Header />
      <main className='flex grow flex-col items-center gap-2 pb-10'>
        <p className='text-xl font-bold'>Captured Pokémons</p>
        <PokemonList pokemons={pokemons} allowCatching={false} pokedexMode />
      </main>
    </>
  )
}

export default Pokedex
