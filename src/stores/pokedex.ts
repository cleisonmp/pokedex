import { create } from 'zustand'
import type { DetailedPokemon } from '../@types/pokemon'

type PokedexState = {
  pokemons: DetailedPokemon[]
  add: (pokemon: DetailedPokemon) => void
  remove: (id: number) => void
}

export const usePokedexStore = create<PokedexState>()((set) => ({
  pokemons: [],
  add: (pokemon) =>
    set((state) => ({ pokemons: [...state.pokemons, pokemon] })),
  remove: (id) =>
    set((state) => ({
      pokemons: state.pokemons.filter((pokemon) => pokemon.id !== id),
    })),
}))
