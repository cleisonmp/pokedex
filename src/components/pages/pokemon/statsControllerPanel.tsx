import { useStatsPanelStore } from '../../../lib/stores/statsPanel'
import { StatToggleButton } from '../../common/pokemonStats/statToggleButton'

export const StatsControllerPanel = () => {
  const {
    typeActive,
    categoryActive,
    baseActive,
    combatActive,
    specialActive,
    weaknessesActive,
    resistancesActive,
    catchActive,
    abilitiesActive,
    evolutionsActive,
  } = useStatsPanelStore()

  return (
    <div className='grid grid-cols-1 gap-[0.375rem] text-xs md:text-sm font-bold md:gap-2'>
      <StatToggleButton isActive={typeActive} text='Type' statId='TYPE' />
      <StatToggleButton
        isActive={categoryActive}
        text='Category'
        statId='CATEGORY'
      />
      <StatToggleButton isActive={baseActive} text='Base' statId='BASE' />
      <StatToggleButton isActive={combatActive} text='Combat' statId='COMBAT' />
      <StatToggleButton
        isActive={specialActive}
        text='Special'
        statId='SPECIAL'
      />
      <StatToggleButton
        isActive={resistancesActive}
        text='Resistances'
        statId='RESISTANCE'
      />
      <StatToggleButton
        isActive={weaknessesActive}
        text='Weaknesses'
        statId='WEAKNESSES'
      />
      <StatToggleButton
        isActive={catchActive}
        text='Catch difficulty'
        statId='CATCH'
      />
      <StatToggleButton
        isActive={abilitiesActive}
        text='Abilities'
        statId='ABILITIES'
      />
      <StatToggleButton
        isActive={evolutionsActive}
        text='Evolutions'
        statId='EVOLUTIONS'
      />
    </div>
  )
}
