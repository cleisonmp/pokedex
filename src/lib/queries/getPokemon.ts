import { api } from '../../services/api'

import type { DetailedPokemon, Pokemon } from '../../@types/pokemon'

export const getPokemon = async (url: string): Promise<DetailedPokemon> => {
  return await api.get<Pokemon>(url).then((response) => {
    const baseImageUrl =
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'

    return {
      id: response.data.id,
      name: response.data.name,
      abilities: response.data.abilities,
      species: response.data.species,
      image: response.data.sprites.front_default.replace(baseImageUrl, ''),
      imageHq: response.data.sprites.other[
        'official-artwork'
      ].front_default?.replace(baseImageUrl, ''),
      stats: response.data.stats,
      types: response.data.types.map(({ type: { name, url }, slot }) => {
        return { name, slot, url }
      }),
      weight: response.data.weight,
      height: response.data.height,
    }
  })
}
