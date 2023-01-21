import { create } from 'zustand'
import type { DetailedPokemon } from '../@types/pokemon'

type PokedexState = {
  pokemons: DetailedPokemon[]
  add: (pokemon: DetailedPokemon) => void
  remove: (id: number) => void
  update: (id: number, newName: string) => void
}

export const usePokedexStore = create<PokedexState>()((set, get) => ({
  pokemons: [],
  add: (pokemon) =>
    set((state) => ({
      pokemons: [...state.pokemons, pokemon].sort((a, b) => a.id - b.id),
    })),
  remove: (id) =>
    set((state) => ({
      pokemons: state.pokemons.filter((pokemon) => pokemon.id !== id),
    })),
  update: (id, newName) => {
    const pokemonToEdit = get().pokemons.find((pokemon) => pokemon.id === id)

    if (pokemonToEdit) {
      const updatedPokemon: DetailedPokemon = {
        ...pokemonToEdit,
        name: newName,
      }
      get().remove(id)
      get().add(updatedPokemon)
    }
  },
}))
