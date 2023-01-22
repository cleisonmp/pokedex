import { api } from '../../services/api'

import type { TypeDetails } from '../../@types/pokemon'

export const getDamageRelations = async (url: string) => {
  const typeData = await api.get<TypeDetails>(url).then((response) => {
    return response.data
  })
  const resistances: string[] = []
  const weaknesses: string[] = []
  resistances.push(
    ...typeData.damage_relations.half_damage_from.map((half) => half.name),
  )
  weaknesses.push(
    ...typeData.damage_relations.double_damage_from.map((half) => half.name),
  )

  return {
    resistances: resistances.sort(),
    weaknesses: weaknesses.sort(),
  }
}
