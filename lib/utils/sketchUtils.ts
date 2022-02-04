function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) //The maximum is exclusive and the minimum is inclusive
}
export function makeLocations(
  N: number,
  nodeRadius: number,
  width: number,
  height: number,
  margin: number = 20
): Array<[number, number]> | boolean {
  let x = margin + nodeRadius
  let y = margin + nodeRadius
  let nodeLocations: Array<[number, number]> = []
  while (x < width && y < height) {
    nodeLocations.push([x, y])
    x += 4 * nodeRadius
    if (x + nodeRadius > width - margin) {
      x = margin + nodeRadius
      y += 4 * nodeRadius
    }
    if (y + nodeRadius > height - margin) break
  }
  if (nodeLocations.length < N) {
    console.error('Not enough space to draw ' + N + ' nodes.')
    return false
  }
  return nodeLocations
}
export function getRandomIndices(N: number, arrayLength: number): Array<number> {
  let ret = []
  while (ret.length < N) {
    let idx = getRandomInt(0, arrayLength - 1)
    if (ret.includes(idx)) continue
    ret.push(idx)
  }
  return ret
}
