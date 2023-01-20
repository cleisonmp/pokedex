import type { Dispatch, SetStateAction } from 'react'

type StatToggleButtonProps = {
  isActive: boolean
  text: string
  toggleState: Dispatch<SetStateAction<boolean>>
}

export const StatToggleButton = ({
  isActive,
  text,
  toggleState,
}: StatToggleButtonProps) => {
  return (
    <button
      className={`h-8 origin-bottom rounded-md border-gray-800 p-1 transition-all ${
        isActive
          ? 'scale-105 border-2 border-b-4 bg-pink-500 p-1 text-white'
          : 'border'
      }`}
      onClick={() => toggleState((prev) => !prev)}
    >
      {text}
    </button>
  )
}
