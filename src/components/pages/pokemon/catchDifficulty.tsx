type CatchDifficultyProps = {
  barSize: number
}
export const CatchDifficulty = ({ barSize }: CatchDifficultyProps) => {
  return (
    <div>
      <span className='text-xs md:text-sm font-bold'>Catch difficulty</span>
      <div className='relative flex h-6 w-full overflow-hidden rounded-lg border border-gray-700 bg-gray-200'>
        <div className='absolute -left-1 h-full w-[110%] rounded-lg bg-gradient-to-r from-green-500 to-red-500'></div>
        <div
          className='absolute -right-1 h-full rounded-r-lg bg-gray-200'
          style={{ width: `${barSize}%` }}
        ></div>
      </div>
    </div>
  )
}
