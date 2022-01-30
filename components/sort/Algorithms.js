export function sortBubble(enumedArray) {
  //   array.sort((a, b) => a - b)
  if (enumedArray.length <= 1) return []
  let animations = []
  for (var i = 0; i < enumedArray.length; i++) {
    for (var j = 0; j < enumedArray.length - i - 1; j++) {
      animations.push([[j, j + 1], 'highlight'])
      if (enumedArray[j][1] > enumedArray[j + 1][1]) {
        let temp = enumedArray[j + 1]
        enumedArray[j + 1] = enumedArray[j]
        enumedArray[j] = temp
        animations.push([[j, j + 1], 'swap'])
      }
      animations.push([[j, j + 1], 'dehighlight'])
    }
  }
  return animations
}

export class MergeSorter {
  constructor() {
    this.animations = []
  }
  merge(eA1, eA2) {
    let ret = []
    while (eA1.length > 0 && eA2.length > 0) {
      let idx1 = eA1[0][0]
      let idx2 = eA2[0][0]
      this.animations.push([[idx1, idx2], 'highlight'])
      if (eA1[0][1] > eA2[0][1]) {
        this.animations.push([[idx1, idx2], 'move'])
        ret.push(eA2[0])
        eA2.shift()
      } else {
        this.animations.push([[idx2, idx1], 'move'])
        ret.push(eA1[0])
        eA1.shift()
      }
      this.animations.push([[idx1, idx2], 'dehighlight'])
    }
    while (eA1.length > 0) {
      ret.push(eA1[0])
      let prevIdx = this.animations[this.animations.length - 1][0][0]
      console.log(prevIdx)
      this.animations.push([[prevIdx, eA1[0][0]], 'move'])
      eA1.shift()
    }
    while (eA2.length > 0) {
      ret.push(eA2[0])
      let prevIdx = this.animations[this.animations.length - 1][0][0]
      console.log(prevIdx)
      this.animations.push([[prevIdx, eA2[0][0]], 'move'])
      eA2.shift()
    }
    return ret
  }
  mergeSort(enumedArray) {
    let n = enumedArray.length
    if (n == 1) {
      return enumedArray
    }
    let lHalf = []
    let rHalf = []
    lHalf = enumedArray.slice(0, n / 2)
    rHalf = enumedArray.slice(n / 2)
    lHalf = this.mergeSort(lHalf)
    rHalf = this.mergeSort(rHalf)
    // console.log('Merging:', lHalf, rHalf)
    return this.merge(lHalf, rHalf)
  }
  sortMerge(enumedArray) {
    if (enumedArray.length <= 1) return []
    this.mergeSort(enumedArray)
    return this.animations
  }
}

function merge(eA1, eA2) {
  let ret = []
  let animations = []
  while (eA1.length > 0 && eA2.length > 0) {
    let idx1 = eA1[0][0]
    let idx2 = eA2[0][0]
    animations.push([[idx1, idx2], 'highlight'])
    if (eA1[0][1] > eA2[0][1]) {
      animations.push([[idx1, idx2], 'swap'])
      ret.push(eA2[0])
      eA2.shift()
    } else {
      ret.push(eA1[0])
      eA1.shift()
    }
    animations.push([[idx1, idx2], 'dehighlight'])
  }
  while (eA1.length > 0) {
    ret.push(eA1[0])
    eA1.shift()
  }
  while (eA2.length > 0) {
    ret.push(eA2[0])
    eA2.shift()
  }
  return ret
}

function mergeSort(enumedArray) {
  let n = enumedArray.length
  if (n == 1) {
    return [enumedArray[0]]
  }
  let lHalf = []
  let rHalf = []
  lHalf = enumedArray.slice(0, n / 2)
  rHalf = enumedArray.slice(n / 2)
  lHalf = mergeSort(lHalf)
  rHalf = mergeSort(rHalf)
  console.log('Merging:', lHalf, rHalf)
  return merge(lHalf, rHalf)
}

export function sortMerge(enumedArray) {
  if (enumedArray.length <= 1) return []
  let animations = mergeSort(enumedArray)[0]
  console.log('Final:', animations)
  return animations
}
