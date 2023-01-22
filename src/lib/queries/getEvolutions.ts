import type {
  DetailedPokemon,
  EvolutionChain,
  SpeciesDetail,
} from '../../@types/pokemon'
import { api } from '../../services/api'
import { getPokemon } from './getPokemon'

export const getEvolutions = async (url: string) => {
  return await api.get<SpeciesDetail>(url).then(async (response) => {
    return await api
      .get<EvolutionChain>(response.data.evolution_chain.url)
      .then(async (chainResponse) => {
        const evolutionsResponse: DetailedPokemon[] = []

        //basePokemon
        evolutionsResponse.push(
          await getPokemon(`pokemon/${chainResponse.data.chain.species.name}`),
        )

        //first evolution
        if (chainResponse.data.chain.evolves_to[0]) {
          evolutionsResponse.push(
            await getPokemon(
              `pokemon/${chainResponse.data.chain.evolves_to[0]?.species.name}`,
            ),
          )
        }

        //second evolution
        if (chainResponse.data.chain.evolves_to[0]?.evolves_to[0]) {
          evolutionsResponse.push(
            await getPokemon(
              `pokemon/${chainResponse.data.chain.evolves_to[0]?.evolves_to[0]?.species.name}`,
            ),
          )
        }

        return {
          evolutions: evolutionsResponse,
          category: response.data.genera.find(
            (gen) => gen.language.name === 'en',
          )?.genus,
        }
      })
  })
}
