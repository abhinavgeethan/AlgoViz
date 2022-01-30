import PageTitle from '@/components/PageTitle'
import DataBar from '@/components/sort/DataBar'
import SortButtons from '@/components/sort/SortButtons'
import { MergeSorter, sortBubble, sortMerge } from '@/components/sort/Algorithms'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

const HIGHLIGHT_COLOR = 'red'
const HIGHLIGHT_COLOR_DARK = 'red'
const DEHIGHLIGHT_COLOR = 'rgb(64,64,64,1)'
const DEHIGHLIGHT_COLOR_DARK = 'white'
const SWAP_COLOR = 'yellow'
const SWAP_COLOR_DARK = 'yellow'

// const ANIMATION_SPEED_OFFSET = 1

function enumArray(array) {
  let newArray = []
  for (var i = 0; i < array.length; i++) {
    newArray.push([i, array[i]])
  }
  return newArray
}
function deEnum(enumedArray) {
  let ret = []
  for (var i = 0; i < enumedArray.length; i++) {
    ret.push(enumedArray[i][1])
  }
  return ret
}
export default function merge() {
  const [values, setValues] = useState([])
  const [resetState, setResetState] = useState([])
  const { theme, resolvedTheme } = useTheme()
  const [animationSpeedOffset, setAnimationSpeedOffset] = useState(20)
  // const [stopAnimation, setStopAnimation] = useState(false)
  function handleAnimations(sortingAnimations) {
    const ANIMATION_SPEED = 1 / sortingAnimations.length + animationSpeedOffset
    const bars = document.getElementsByClassName('array-bar')
    const isDarkMode = theme === 'dark' || resolvedTheme === 'dark'
    // console.log(`${bars[0].style.backgroundColor} is the bg color`)
    for (var i = 0; i < sortingAnimations.length; i++) {
      // if (stopAnimation) break
      const [bar1Index, bar2Index] = sortingAnimations[i][0]
      let bar1Style = bars[bar1Index].style
      let bar2Style = bars[bar2Index].style
      const styling =
        sortingAnimations[i][1] === 'highlight'
          ? isDarkMode
            ? HIGHLIGHT_COLOR_DARK
            : HIGHLIGHT_COLOR
          : sortingAnimations[i][1] === 'swap' || sortingAnimations[i][1] === 'move'
          ? isDarkMode
            ? SWAP_COLOR_DARK
            : SWAP_COLOR
          : isDarkMode
          ? DEHIGHLIGHT_COLOR_DARK
          : DEHIGHLIGHT_COLOR
      setTimeout(() => {
        bar1Style.backgroundColor = styling
        bar2Style.backgroundColor = styling
        if (sortingAnimations[i][1] === 'swap') {
          const tempHeight = bar2Style.height
          bar2Style.height = bar1Style.height
          bar1Style.height = tempHeight
        }
        if (sortingAnimations[i][1] === 'move') {
          bar1Style.height = bar2Style.height
        }
      }, ANIMATION_SPEED * i)
    }
    // Show Completed State
    // setStopAnimation(false)
  }
  function sortValues() {
    const m = new MergeSorter()
    const sortingAnimations = m.sortMerge(enumArray(values.slice()))
    handleAnimations(sortingAnimations)
  }
  // function sortValues() {
  //   const sortingAnimations = sortBubble(enumArray(values.slice()))
  //   handleAnimations(sortingAnimations)
  // }
  function resetValues() {
    setValues(resetState)
  }
  function changeSpeed(value) {
    setAnimationSpeedOffset(value)
  }
  function fillRandomValues() {
    setValues(Array.from({ length: 50 }, () => Math.floor(Math.random() * 650)))
    setResetState(values)
  }
  useEffect(() => {
    fillRandomValues()
    setResetState(values)
  }, [])
  return (
    <>
      <div className="mt-4 text-center">
        <PageTitle>Merge Sort</PageTitle>
        <div className="w-full h-auto flex flex-row justify-around items-end">
          {values &&
            values.map((v, idx) => {
              return (
                <DataBar
                  key={idx}
                  value={v}
                  width={`${100 / values.length - 0.5}%`}
                  showValue={false}
                ></DataBar>
              )
            })}
        </div>
        {animationSpeedOffset}
        <SortButtons
          callSort={sortValues}
          resetValues={resetValues}
          fillNewValues={fillRandomValues}
          // stopAnimation={handleStopAnimation}
          changeSpeed={changeSpeed}
        ></SortButtons>
      </div>
    </>
  )
}
