import { atom } from 'jotai'

export const editModalState = atom(false)
export const pokemonToEditState = atom({ id: 0, name: '' })
