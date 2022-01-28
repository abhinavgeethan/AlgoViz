export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) //The maximum is exclusive and the minimum is inclusive
}
export class GraphNode {
  idx: string
  neighbours: GraphNode[]
  weights: number[]
  constructor(idx: string) {
    this.idx = idx
    this.neighbours = []
    this.weights = []
  }
}
interface ParentObject {
  [key: string]: GraphNode
}
interface DistanceObject {
  [key: string]: number
}
type AnimationsArray = Array<[string, string]>
export class Graph {
  nodes: GraphNode[]
  animations: AnimationsArray
  constructor(nodeArray: GraphNode[]) {
    this.nodes = nodeArray
    this.animations = []
  }
  makeAllEdges = (): Array<[string, string, number]> => {
    if (this.nodes.length <= 1) return []
    let ret: Array<[string, string, number]> = []
    for (var i = 0; i < this.nodes.length + 2; i++) {
      let i1: number = getRandomInt(0, this.nodes.length - 1)
      let i2: number = i1
      while (i2 === i1) {
        i2 = getRandomInt(0, this.nodes.length - 1)
      }
      let n1: GraphNode = this.nodes[i1]
      let n2: GraphNode = this.nodes[i2]
      let wt: number = getRandomInt(1, 10)
      this.addEdge(n1, n2, wt)
      ret.push([n1.idx, n2.idx, wt])
    }
    return ret
  }
  getNode = (idxStr: String): GraphNode => {
    let node: GraphNode = this.nodes.filter((n) => {
      return n.idx === idxStr
    })[0]
    return node
  }
  addNode(node: GraphNode): void {
    this.nodes.push(node)
  }
  addEdge(node1: GraphNode, node2: GraphNode, weight: number): void {
    node1.neighbours.push(node2)
    node1.weights.push(weight)
  }
  getNextNode = (distObj: DistanceObject, unvisited: GraphNode[]): GraphNode => {
    let keys: string[] = Object.keys(distObj)
    let minArr: [string, number] = [keys[0], Infinity]
    for (var i = 0; i < keys.length; i++) {
      let unvisitedStr: string[] = unvisited.map((n) => n.idx)
      let inBool: boolean = unvisitedStr.includes(keys[i])
      if (distObj[keys[i]] <= minArr[1] && inBool) {
        minArr = [keys[i], distObj[keys[i]]]
      }
    }
    let nextNode: GraphNode = this.getNode(minArr[0][0])
    return nextNode
  }
  getAnimations = (startNode: String, endNode: String): [DistanceObject, AnimationsArray] => {
    let sNode: GraphNode = this.getNode(startNode)
    let eNode: GraphNode = this.getNode(endNode)
    let [distances, parent] = this.djikstras(sNode)
    let curr: string = eNode.idx
    while (curr != sNode.idx) {
      let p: GraphNode = parent[curr]
      this.animations.push([p.idx + ' ' + curr, 'parent'])
      curr = p.idx
    }
    return [distances, this.animations]
  }
  djikstras = (startNode: GraphNode): [DistanceObject, ParentObject] => {
    // Initialise
    let distFromStart: DistanceObject = {}
    let parent: ParentObject = {}
    let visited: GraphNode[] = []
    let unvisited: GraphNode[] = this.nodes
    // Initialise Distances
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i] == startNode) {
        distFromStart[this.nodes[i].idx] = 0
      } else {
        distFromStart[this.nodes[i].idx] = Infinity
      }
    }
    // Main Loop
    while (unvisited.length > 0) {
      let curNode: GraphNode = this.getNextNode(distFromStart, unvisited)
      this.animations.push([curNode.idx, 'current'])
      let nLen: number = curNode.neighbours.length
      for (var j = 0; j < nLen; j++) {
        let nbr: GraphNode = curNode.neighbours[j]
        if (visited.includes(nbr)) continue
        let distToNbr: number = distFromStart[curNode.idx] + curNode.weights[j]
        if (distToNbr <= distFromStart[nbr.idx]) {
          distFromStart[nbr.idx] = distToNbr
          parent[nbr.idx] = curNode
        }
      }
      visited.push(curNode)
      this.animations.push([curNode.idx, 'visited'])
      unvisited.splice(unvisited.indexOf(curNode), 1)
    }
    return [distFromStart, parent]
  }
}

// let A = new GraphNode('A')
// let B = new GraphNode('B')
// let C = new GraphNode('C')
// let D = new GraphNode('D')
// let E = new GraphNode('E')
// let nodeArray = [A, B, C, D, E]
// let G = new Graph(nodeArray)
// G.addEdge(A, B, 6)
// G.addEdge(A, D, 1)
// G.addEdge(B, C, 5)
// G.addEdge(B, E, 2)
// G.addEdge(D, B, 2)
// G.addEdge(D, E, 1)
// G.addEdge(E, C, 5)
// let [distObj, parent] = djikstras(G, A)
// let k = Object.keys(distObj)
// console.log('Result')
// for (var i = 0; i < k.length; i++) {
//   if (i > 0) console.log(k[i], distObj[k[i]], parent[k[i]].idx)
//   else console.log(k[i], distObj[k[i]])
// }
