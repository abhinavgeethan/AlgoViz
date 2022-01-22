// export function sortBubble(enumedArray) {
//   //   array.sort((a, b) => a - b)
//   if (enumedArray.length <= 1) return []
//   let animations = []
//   for (var i = 0; i < enumedArray.length; i++) {
//     for (var j = 0; j < enumedArray.length - i - 1; j++) {
//       animations.push([[j, j + 1], 'highlight'])
//       if (enumedArray[j][1] > enumedArray[j + 1][1]) {
//         let temp = enumedArray[j + 1]
//         enumedArray[j + 1] = enumedArray[j]
//         enumedArray[j] = temp
//         animations.push([[j, j + 1], 'swap'])
//       }
//       animations.push([[j, j + 1], 'dehighlight'])
//     }
//   }
//   return animations
// }

// export class MergeSorter {
//   constructor() {
//     this.animations = []
//   }
//   merge(eA1, eA2) {
//     let ret = []
//     while (eA1.length > 0 && eA2.length > 0) {
//       let idx1 = eA1[0][0]
//       let idx2 = eA2[0][0]
//       this.animations.push([[idx1, idx2], 'highlight'])
//       if (eA1[0][1] > eA2[0][1]) {
//         this.animations.push([[idx1, idx2], 'move'])
//         ret.push(eA2[0])
//         eA2.shift()
//       } else {
//         this.animations.push([[idx2, idx1], 'move'])
//         ret.push(eA1[0])
//         eA1.shift()
//       }
//       this.animations.push([[idx1, idx2], 'dehighlight'])
//     }
//     while (eA1.length > 0) {
//       ret.push(eA1[0])
//       let prevIdx = this.animations[this.animations.length - 1][0][0]
//       console.log(prevIdx)
//       this.animations.push([[prevIdx, eA1[0][0]], 'move'])
//       eA1.shift()
//     }
//     while (eA2.length > 0) {
//       ret.push(eA2[0])
//       let prevIdx = this.animations[this.animations.length - 1][0][0]
//       console.log(prevIdx)
//       this.animations.push([[prevIdx, eA2[0][0]], 'move'])
//       eA2.shift()
//     }
//     return ret
//   }
//   mergeSort(enumedArray) {
//     let n = enumedArray.length
//     if (n == 1) {
//       return enumedArray
//     }
//     let lHalf = []
//     let rHalf = []
//     lHalf = enumedArray.slice(0, n / 2)
//     rHalf = enumedArray.slice(n / 2)
//     lHalf = this.mergeSort(lHalf)
//     rHalf = this.mergeSort(rHalf)
//     // console.log('Merging:', lHalf, rHalf)
//     return this.merge(lHalf, rHalf)
//   }
//   sortMerge(enumedArray) {
//     if (enumedArray.length <= 1) return []
//     this.mergeSort(enumedArray)
//     return this.animations
//   }
// }

// function merge(eA1, eA2) {
//   let ret = []
//   let animations = []
//   while (eA1.length > 0 && eA2.length > 0) {
//     let idx1 = eA1[0][0]
//     let idx2 = eA2[0][0]
//     animations.push([[idx1, idx2], 'highlight'])
//     if (eA1[0][1] > eA2[0][1]) {
//       animations.push([[idx1, idx2], 'swap'])
//       ret.push(eA2[0])
//       eA2.shift()
//     } else {
//       ret.push(eA1[0])
//       eA1.shift()
//     }
//     animations.push([[idx1, idx2], 'dehighlight'])
//   }
//   while (eA1.length > 0) {
//     ret.push(eA1[0])
//     eA1.shift()
//   }
//   while (eA2.length > 0) {
//     ret.push(eA2[0])
//     eA2.shift()
//   }
//   return ret
// }

// function mergeSort(enumedArray) {
//   let n = enumedArray.length
//   if (n == 1) {
//     return [enumedArray[0]]
//   }
//   let lHalf = []
//   let rHalf = []
//   lHalf = enumedArray.slice(0, n / 2)
//   rHalf = enumedArray.slice(n / 2)
//   lHalf = mergeSort(lHalf)
//   rHalf = mergeSort(rHalf)
//   console.log('Merging:', lHalf, rHalf)
//   return merge(lHalf, rHalf)
// }

// export function sortMerge(enumedArray) {
//   if (enumedArray.length <= 1) return []
//   let animations = mergeSort(enumedArray)[0]
//   console.log('Final:', animations)
//   return animations
// }

class GraphNode {
  constructor(idx) {
    this.idx = idx
    this.neighbours = []
    this.weights = []
  }
}
class Graph {
  constructor(nodeArray) {
    this.nodes = nodeArray
  }
  getNode(idxStr) {
    let node = this.nodes.filter((n) => {
      return n.idx === idxStr
    })[0]
    return node
  }
  addNode(node) {
    this.nodes.push(node)
  }
  addEdge(node1, node2, weight) {
    node1.neighbours.push(node2)
    node1.weights.push(weight)
  }
  getNextNode(distObj, unvisited) {
    let keys = Object.keys(distObj)
    let minArr = [keys[0], Infinity]
    for (var i = 0; i < keys.length; i++) {
      let unvisitedStr = unvisited.map((n) => n.idx)
      let inBool = unvisitedStr.includes(keys[i])
      if (distObj[keys[i]] < minArr[1] && inBool) {
        minArr = [keys[i], distObj[keys[i]]]
      }
    }
    let nextNode = this.getNode(minArr[0])
    return nextNode
  }
}
function djikstras(G, startNode) {
  let distFromStart = {}
  let parent = {}
  let visited = []
  let unvisited = G.nodes
  for (var i = 0; i < G.nodes.length; i++) {
    if (G.nodes[i] == startNode) {
      distFromStart[G.nodes[i].idx] = 0
    } else {
      distFromStart[G.nodes[i].idx] = Infinity
    }
  }
  while (unvisited.length > 0) {
    curNode = G.getNextNode(distFromStart, unvisited)
    for (var j = 0; j < curNode.neighbours.length; j++) {
      let nbr = curNode.neighbours[j]
      if (visited.includes(nbr)) continue
      let distToNbr = distFromStart[curNode.idx] + curNode.weights[j]
      if (distToNbr <= distFromStart[nbr.idx]) {
        distFromStart[nbr.idx] = distToNbr
        parent[nbr.idx] = curNode
      }
    }
    visited.push(curNode)
    unvisited.splice(unvisited.indexOf(curNode), 1)
  }
  return [distFromStart, parent]
}

let A = new GraphNode('A')
let B = new GraphNode('B')
let C = new GraphNode('C')
let D = new GraphNode('D')
let E = new GraphNode('E')
let nodeArray = [A, B, C, D, E]
let G = new Graph(nodeArray)
G.addEdge(A, B, 6)
G.addEdge(A, D, 1)
G.addEdge(B, C, 5)
G.addEdge(B, E, 2)
G.addEdge(D, B, 2)
G.addEdge(D, E, 1)
G.addEdge(E, C, 5)
let [distObj, parent] = djikstras(G, A)
let k = Object.keys(distObj)
console.log('Result')
for (var i = 0; i < k.length; i++) {
  if (i > 0) console.log(k[i], distObj[k[i]], parent[k[i]].idx)
  else console.log(k[i], distObj[k[i]])
}
