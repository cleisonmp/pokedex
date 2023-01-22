import { api } from '../../services/api'

import type { Ability, AbilityDetail } from '../../@types/pokemon'

export const getAbilitiesDetails = async (abilities: Ability[]) => {
  const abilitiesPromisses = abilities.map(async (ability) => {
    return await api
      .get<AbilityDetail>(ability.ability.url)
      .then((response) => {
        return { ...response.data, slot: ability.slot }
      })
  })

  const abilitiesData = await Promise.all(abilitiesPromisses)

  return abilitiesData
    .map(({ id, name, effect_entries, slot }) => {
      const effect =
        effect_entries.find((entry) => entry.language.name === 'en')?.effect ??
        ''
      return { id, name, effect, slot }
    })
    .sort((a, b) => a.slot - b.slot)
}
