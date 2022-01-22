const width = 1080
const height = 800
const N = 12
const NODE_RADIUS = 35
function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) //The maximum is exclusive and the minimum is inclusive
}
function dist(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
}
// function genNearCircleCoords(pX, pY, r) {
//   let validCircle = false
//   let x = 0
//   let y = 0
//   let tries = 0
//   while (!validCircle) {
//     console.log('Looping:', tries)
//     tries++
//     if (tries > 100) break
//     if (tries % 20 == 0) {
//       y = getRandomInt(pY - 4 * r, pY + 4 * r)
//       x = Math.floor(Math.sqrt(4 * r * (4 * r) - (y - pY) * (y - pY)) + pX)
//     } else {
//       x = getRandomInt(pX - 4 * r, pX + 4 * r)
//       y = Math.floor(Math.sqrt(4 * r * (4 * r) - (x - pX) * (x - pX)) + pY)
//     }
//     // console.log(pX, pY, x, y)
//     let c1 = x - (r + 10) < 0
//     let c2 = x + (r + 10) > width - 20
//     let c3 = y - (r + 10) < 0
//     let c4 = y + (r + 10) > height - 20
//     // console.log(c1, c2, c3, c4)
//     // console.log(c1 || c2 || c3 || c4)
//     validCircle = !(c1 || c2 || c3 || c4)
//     // validCircle = !(
//     //   x - (r + 10) < 0 ||
//     //   x + (r + 10) > width - 20 ||
//     //   y - (r + 10) < 0 ||
//     //   y + (r + 10) < height - 20
//     // )
//     // console.log(validCircle)
//   }
//   return [x, y]
// }

function makeCircles() {
  let ctr = 1
  while (ctr < N) {
    // console.log('Found:', nodeLocations.length)
    let pX = nodeLocations[ctr - 1][0]
    let pY = nodeLocations[ctr - 1][1]
    // let nearCircleCoords = genNearCircleCoords(
    //   nodeLocations[ctr - 1][0],
    //   nodeLocations[ctr - 1][1],
    //   NODE_RADIUS
    // )
    let r = NODE_RADIUS
    if (pY + 5 * r < height - 20 && pY - 5 * r > 20) {
      for (var y = pY - 4 * r; y <= pY + 4 * r; y++) {
        let c1 = y - (r + 10) < 0
        let c2 = y + (r + 10) > height - 20
        if (c1 || c2) continue
        let x = Math.floor(Math.sqrt(4 * r * (4 * r) - (y - pY) * (y - pY)) + pX)
        let c3 = x - (r + 10) < 0
        let c4 = x + (r + 10) > width - 20
        if (c3 || c4) continue
        let valid = true
        for (var nIdx = 0; nIdx < nodeLocations.length; nIdx++) {
          d = dist(nodeLocations[nIdx][0], nodeLocations[nIdx][1], x, y)
          if (d < NODE_RADIUS * 4) {
            valid = false
            break
          }
        }
        if (valid) {
          nodeLocations.push([x, y])
          //   console.log('Added', x, y)
          ctr++
          break
        }
      }
    } else {
      for (var x = pX - 4 * r; x <= pX + 4 * r; x++) {
        let c1 = x - (r + 10) < 0
        let c2 = x + (r + 10) > width - 20
        if (c1 || c2) continue
        let y = Math.floor(Math.sqrt(4 * r * (4 * r) - (x - pX) * (x - pX)) + pY)
        let c3 = y - (r + 10) < 0
        let c4 = y + (r + 10) > height - 20
        if (c3 || c4) continue
        let valid = true
        for (var nIdx = 0; nIdx < nodeLocations.length; nIdx++) {
          d = dist(nodeLocations[nIdx][0], nodeLocations[nIdx][1], x, y)
          if (d < NODE_RADIUS * 4) {
            valid = false
            break
          }
        }
        if (valid) {
          nodeLocations.push([x, y])
          //   console.log('Added', x, y)
          ctr++
          break
        }
      }
    }
  }
  // let x = nearCircleCoords[0]
  // let y = nearCircleCoords[1]
  // for (var nIdx = 0; nIdx < nodeLocations.length; nIdx++) {
  //   d = dist(nodeLocations[nIdx][0], nodeLocations[nIdx][1], x, y)
  //   if (d < NODE_RADIUS * 4) {
  //     valid = false
  //     console.log('Overlap')
  //     // return
  //     break
  //   }
  // }
  // if (valid) {
  //   nodeLocations.push([x, y])
  //   ctr++
  // }
}

let nodeLocations = []
let iters = 1000
let success = 0
console.log('Stress Test')
console.log('Iterations:', iters)
console.log('Node Radius:', NODE_RADIUS, ' Nodes:', N)
for (var it = 0; it < iters; it++) {
  nodeLocations.push([getRandomInt(20, width * 0.2), getRandomInt(20, height * 0.2)])
  makeCircles()
  //   console.log(nodeLocations)
  nodeLocations = []
  success++
  console.log('Success:', success)
}
