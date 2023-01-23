import type { StatID } from '../../../lib/stores/statsPanel'
import { useStatsPanelStore } from '../../../lib/stores/statsPanel'

type StatToggleButtonProps = {
  isActive: boolean
  text: string
  statId: StatID
}

export const StatToggleButton = ({
  isActive,
  text,
  statId,
}: StatToggleButtonProps) => {
  const toggleState = useStatsPanelStore((state) => state.toggleState)

  return (
    <button
      className={`flex items-center justify-center h-7 origin-bottom rounded-md border-gray-800 p-1 transition-all ${
        isActive
          ? 'scale-105 border-2 border-b-4 bg-pink-500 p-1 text-white'
          : 'border'
      }`}
      onClick={() => toggleState(statId)}
    >
      {text}
    </button>
  )
}
