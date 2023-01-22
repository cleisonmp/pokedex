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
  types: PokemonApiType[]
  weight: number
}

export type Ability = {
  ability: { name: string; url: string }
  is_hidden: boolean
  slot: number
}

export type AbilityDetail = {
  effect_entries: AbilityEffects[]
  id: number
  name: string
}

export type AbilityEffects = {
  effect: string
  language: { name: string; url: string }
  short_effect: string
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

export type PokemonApiType = {
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
  genera: Genera[]
}

export type Genera = {
  genus: string
  language: {
    name: string
    url: string
  }
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

export type TypeDetails = {
  id: number
  name: string
  damage_relations: DamageRelations
}

export type DamageRelations = {
  double_damage_from: DamageLink[]
  double_damage_to: DamageLink[]
  half_damage_from: DamageLink[]
  half_damage_to: DamageLink[]
}

export type DamageLink = {
  name: string
  url: string
}

export type DetailedPokemon = {
  url: string
  image: string
  imageHq: string | null
  types: PokemonType[]
} & Pick<
  Pokemon,
  'id' | 'name' | 'abilities' | 'species' | 'stats' | 'weight' | 'height'
>

export type PokemonType = {
  slot: number
  name: string
  url: string
}
