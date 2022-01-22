export default function SortButtons({
  fillNewValues,
  callSort,
  resetValues,
  stopAnimation,
  changeSpeed,
}) {
  function handleChangeSpeed(e) {
    e.preventDefault()
    changeSpeed(e.target.value)
  }
  return (
    <div className="w-full m-3">
      <div className="inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          onClick={fillNewValues}
          className="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-l-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
        >
          New Values
        </button>
        <button
          type="button"
          onClick={callSort}
          className="py-2 px-4 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
        >
          Sort
        </button>
        <button
          type="button"
          onClick={resetValues}
          className="py-2 px-4 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={stopAnimation}
          className="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-r-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
        >
          Stop
        </button>
        <div className="w-5"></div>
        <div className="flex items-center">
          <label htmlFor={'speedSlider'} className="mr-1 text-gray dark:text-white">
            Speed
          </label>
          <input
            name={'speedSlider'}
            type={'range'}
            max={'50'}
            min={'0.5'}
            defaultValue={'1'}
            step={'0.5'}
            onChange={handleChangeSpeed}
            className="range range-primary"
          ></input>
        </div>
      </div>
    </div>
  )
}
