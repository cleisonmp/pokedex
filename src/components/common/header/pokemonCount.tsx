import { usePokedexStore } from '../../../lib/stores/pokedex'

export const PokemonCount = () => {
  const totalPokemonsCatched = usePokedexStore((state) => state.pokemons.length)

  return (
    <>
      {totalPokemonsCatched > 0 && (
        <div className='absolute right-0 top-0 -translate-y-1/2 translate-x-2/3 rounded-full bg-app-tertiary px-2 text-sm'>
          {totalPokemonsCatched}
        </div>
      )}
    </>
  )
}
