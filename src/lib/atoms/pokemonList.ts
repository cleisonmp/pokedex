import { atom } from 'jotai'
import type { DetailedPokemon } from '../../@types/pokemon'

export const pokemonListState = atom<DetailedPokemon[]>([])
