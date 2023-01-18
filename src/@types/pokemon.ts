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
  types: Type[]
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
}

export type Stat = {
  base_stat: number
  effort: number
  stat: {
    name: string
    url: string
  }
}

export type Type = {
  slot: number
  type: { name: string; url: string }
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
