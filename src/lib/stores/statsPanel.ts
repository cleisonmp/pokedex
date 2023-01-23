import { create } from 'zustand'

export type StatID =
  | 'TYPE'
  | 'CATEGORY'
  | 'BASE'
  | 'COMBAT'
  | 'SPECIAL'
  | 'WEAKNESSES'
  | 'RESISTANCE'
  | 'CATCH'
  | 'ABILITIES'
  | 'EVOLUTIONS'

type StatsPanelState = {
  typeActive: boolean
  categoryActive: boolean
  baseActive: boolean
  combatActive: boolean
  specialActive: boolean
  weaknessesActive: boolean
  resistancesActive: boolean
  catchActive: boolean
  abilitiesActive: boolean
  evolutionsActive: boolean
  toggleState: (stat: StatID) => void
}

export const useStatsPanelStore = create<StatsPanelState>()((set) => ({
  typeActive: true,
  categoryActive: true,
  baseActive: true,
  combatActive: true,
  specialActive: true,
  weaknessesActive: true,
  resistancesActive: true,
  catchActive: true,
  abilitiesActive: true,
  evolutionsActive: true,

  toggleState: (stat: StatID) =>
    set((state) => {
      switch (stat) {
        case 'TYPE':
          return { typeActive: !state.typeActive }
        case 'CATEGORY':
          return { categoryActive: !state.categoryActive }
        case 'BASE':
          return { baseActive: !state.baseActive }
        case 'COMBAT':
          return { combatActive: !state.combatActive }
        case 'SPECIAL':
          return { specialActive: !state.specialActive }
        case 'WEAKNESSES':
          return { weaknessesActive: !state.weaknessesActive }
        case 'RESISTANCE':
          return { resistancesActive: !state.resistancesActive }
        case 'CATCH':
          return { catchActive: !state.catchActive }
        case 'ABILITIES':
          return { abilitiesActive: !state.abilitiesActive }
        case 'EVOLUTIONS':
          return { evolutionsActive: !state.evolutionsActive }
      }
    }),
}))
