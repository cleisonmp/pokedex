export type PokemonSearch = {
  id: number
  urlName: string
  searchableName: string
}

export type Pokemon = {
  abilities: Ability[]
  base_experience: number
  height: number
  id: number
  is_default: boolean
  name: string
  order: number
  species: Species
  sprites: Sprites
  stats: Stat[]
  types: PokemonType[]
  weight: number
}

export type Ability = {
  ability: { name: string; url: string }
  is_hidden: boolean
  slot: number
}

export type Sprites = {
  back_default: string
  front_default: string
  other: {
    'official-artwork': {
      front_default: string | null
    }
  }
}

export type Stat = {
  base_stat: number
  effort: number
  stat: {
    name: string
    url: string
  }
}

export type PokemonType = {
  slot: number
  type: PokemonTypeLink
}
export type PokemonTypeLink = {
  name: string
  url: string
}

export type Species = {
  name: string
  url: string
}

export type SpeciesDetail = {
  capture_rate: number
  evolution_chain: { url: string }
  evolves_from_species: Species | null
}

export type EvolutionChain = {
  chain: {
    evolves_to: EvolvesTo[]
    is_baby: boolean
    species: Species //base species
  }
}

export type EvolvesTo = {
  evolves_to: EvolvesTo[]
  species: Species
}

export type DetailedPokemon = {
  url: string
  image: string
  imageHq: string | null
  types: PokemonTypeLink[]
} & Pick<Pokemon, 'id' | 'name' | 'species' | 'stats' | 'weight' | 'height'>
