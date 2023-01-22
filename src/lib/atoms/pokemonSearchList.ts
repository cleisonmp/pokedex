import { atom } from 'jotai'
import type { PokemonSearch } from '../../@types/pokemon'

export const pokemonSearchListState = atom<PokemonSearch[]>([])
