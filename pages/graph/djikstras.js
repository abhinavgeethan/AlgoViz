import PageTitle from '@/components/PageTitle'
import SortButtons from '@/components/sort/SortButtons'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

const HIGHLIGHT_COLOR = 'red'
const HIGHLIGHT_COLOR_DARK = 'red'
const DEHIGHLIGHT_COLOR = 'rgb(64,64,64,1)'
const DEHIGHLIGHT_COLOR_DARK = 'white'
const SWAP_COLOR = 'yellow'
const SWAP_COLOR_DARK = 'yellow'

// const ANIMATION_SPEED_OFFSET = 1

export default function bubble() {
  const { theme, resolvedTheme } = useTheme()
  useEffect(() => {}, [])
  return (
    <>
      <div className="mt-4 text-center">
        <PageTitle>Djikstras Algorithm</PageTitle>
        <div className="w-full h-auto flex flex-row justify-around items-end"></div>
        {/* <SortButtons
          callSort={sortValues}
          resetValues={resetValues}
          fillNewValues={fillRandomValues}
          // stopAnimation={handleStopAnimation}
          changeSpeed={changeSpeed}
        ></SortButtons> */}
      </div>
    </>
  )
}
