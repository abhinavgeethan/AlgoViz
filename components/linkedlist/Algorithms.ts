export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) //The maximum is exclusive and the minimum is inclusive
}
export class ListNode {
  value: string
  next: ListNode
  prev: ListNode
  constructor(idx: string) {
    this.value = idx
    this.next = null
    this.prev = null
  }
}
// interface ParentObject {
//   [key: string]: ListNode
// }
// interface DistanceObject {
//   [key: string]: number
// }
type AnimationsArray = Array<[string, string]>
export class LinkedList {
  //   nodes: ListNode[]
  head: ListNode
  animations: AnimationsArray
  isCyclic: boolean
  cyclePath: ListNode[]
  constructor(headNode: ListNode) {
    // this.nodes = nodeArray
    this.head = headNode
    this.animations = []
    this.isCyclic = false
    this.cyclePath = []
  }
  //   makeAllEdges = (): Array<[string, string, number]> => {
  //     if (this.nodes.length <= 1) return []
  //     let ret: Array<[string, string, number]> = []
  //     for (var i = 0; i < this.nodes.length + 2; i++) {
  //       let i1: number = getRandomInt(0, this.nodes.length - 1)
  //       let i2: number = i1
  //       while (i2 === i1) {
  //         i2 = getRandomInt(0, this.nodes.length - 1)
  //       }
  //       let n1: ListNode = this.nodes[i1]
  //       let n2: ListNode = this.nodes[i2]
  //       let wt: number = getRandomInt(1, 10)
  //       this.addEdge(n1, n2, wt)
  //       ret.push([n1.value, n2.value, wt])
  //     }
  //     return ret
  //   }
  getNode = (idxStr: String): ListNode => {
    let node: ListNode = null
    let curr = this.head
    while (curr.next !== null) {
      if (curr.value === idxStr) node = curr
      curr = curr.next
    }
    return node
  }
  addNode(node: ListNode): void {
    if (this.isCyclic) return
    let curr = this.head
    while (curr.next !== null) {
      curr = curr.next
    }
    curr.next = node
    node.prev = curr
  }
  newNode(val): void {
    let node = new ListNode(val)
    this.addNode(node)
  }
  getTail(): ListNode {
    if (this.isCyclic) return null
    let curr = this.head
    while (curr.next !== null) {
      curr = curr.next
    }
    return curr
  }
  getLength(): number {
    if (this.isCyclic) return Infinity
    let curr = this.head
    let ctr = 0
    while (curr.next !== null) {
      curr = curr.next
      ctr++
    }
    return ctr
  }
  //   addEdge(node1: ListNode, node2: ListNode, weight: number): void {
  //     node1.neighbours.push(node2)
  //     node1.weights.push(weight)
  //   }
  //   getNextNode = (distObj: DistanceObject, unvisited: ListNode[]): ListNode => {
  //     let keys: string[] = Object.keys(distObj)
  //     let minArr: [string, number] = [keys[0], Infinity]
  //     for (var i = 0; i < keys.length; i++) {
  //       let unvisitedStr: string[] = unvisited.map((n) => n.value)
  //       let inBool: boolean = unvisitedStr.includes(keys[i])
  //       if (distObj[keys[i]] <= minArr[1] && inBool) {
  //         minArr = [keys[i], distObj[keys[i]]]
  //       }
  //     }
  //     let nextNode: ListNode = this.getNode(minArr[0][0])
  //     return nextNode
  //   }
  //   getAnimations = (startNode: String, endNode: String): [DistanceObject, AnimationsArray] => {
  //     let sNode: ListNode = this.getNode(startNode)
  //     let eNode: ListNode = this.getNode(endNode)
  //     let [distances, parent] = this.djikstras(sNode)
  //     let curr: string = eNode.value
  //     while (curr != sNode.value) {
  //       let p: ListNode = parent[curr]
  //       this.animations.push([p.value + ' ' + curr, 'parent'])
  //       curr = p.value
  //     }
  //     return [distances, this.animations]
  //   }
  //   djikstras = (startNode: ListNode): [DistanceObject, ParentObject] => {
  //     // Initialise
  //     let distFromStart: DistanceObject = {}
  //     let parent: ParentObject = {}
  //     let visited: ListNode[] = []
  //     let unvisited: ListNode[] = this.nodes
  //     // Initialise Distances
  //     for (var i = 0; i < this.nodes.length; i++) {
  //       if (this.nodes[i] == startNode) {
  //         distFromStart[this.nodes[i].value] = 0
  //       } else {
  //         distFromStart[this.nodes[i].value] = Infinity
  //       }
  //     }
  //     // Main Loop
  //     while (unvisited.length > 0) {
  //       let curNode: ListNode = this.getNextNode(distFromStart, unvisited)
  //       this.animations.push([curNode.value, 'current'])
  //       let nLen: number = curNode.neighbours.length
  //       for (var j = 0; j < nLen; j++) {
  //         let nbr: ListNode = curNode.neighbours[j]
  //         if (visited.includes(nbr)) continue
  //         let distToNbr: number = distFromStart[curNode.value] + curNode.weights[j]
  //         if (distToNbr <= distFromStart[nbr.value]) {
  //           distFromStart[nbr.value] = distToNbr
  //           parent[nbr.value] = curNode
  //         }
  //       }
  //       visited.push(curNode)
  //       this.animations.push([curNode.value, 'visited'])
  //       unvisited.splice(unvisited.indexOf(curNode), 1)
  //     }
  //     return [distFromStart, parent]
  //   }
  makeCyclic(): [string, string] {
    let listLen = this.getLength()
    if (listLen <= 1) return
    let tail = this.getTail()
    let idx = String.fromCharCode(64 + getRandomInt(1, listLen))
    let node = this.getNode(idx)
    tail.next = node
    this.isCyclic = true
    return [tail.value, node.value]
  }
  // getPath(): ListNode[] {
  //   let curr = this.head
  //   let path = []
  //   while (curr.next !== null) {
  //     if (path.includes(curr)) break
  //     path.push(curr)
  //     curr = curr.next
  //   }
  //   return path
  // }
  generatePath(startNode, endNode): void {
    console.log('Called Gen Path')
    let curr = startNode
    console.log(startNode.value)
    while (curr.next !== endNode) {
      this.cyclePath.push(curr)
      curr = curr.next
    }
    this.cyclePath.push(curr)
    this.cyclePath.push(curr.next)
    console.log(this.cyclePath)
  }
  getCycleDetectionAnimations(): AnimationsArray {
    if (!this.detectCycle()) return this.animations
    else {
      let path = this.cyclePath
      path.reverse()
      let end = path[0]
      let retStr = end.value
      for (var i = 1; i < path.length; i++) {
        // if (path[i] === end) break
        retStr += ' ' + path[i].value
      }
      this.animations.push([retStr, 'cyclePath'])
      return this.animations
    }
  }
  // getCycleDetectionAnimations(): AnimationsArray {
  //   if (!this.detectCycle()) return this.animations
  //   else {
  //     let path = this.getPath()
  //     path.reverse()
  //     let end = path[0]
  //     let retStr = end.value
  //     for (var i = 1; i < path.length; i++) {
  //       if (path[i] === end) break
  //       retStr += ' ' + path[i].value
  //     }
  //     this.animations.push([retStr, 'cyclePath'])
  //     return this.animations
  //   }
  // }
  detectCycle(): boolean {
    let slowPtr = this.head
    let fastPtr = this.head
    while (slowPtr.next !== null && fastPtr.next.next !== null) {
      slowPtr = slowPtr.next
      this.animations.push([slowPtr.value, 'slow'])
      fastPtr = fastPtr.next.next
      this.animations.push([fastPtr.value, 'fast'])
      if (slowPtr === fastPtr) {
        this.generatePath(slowPtr, fastPtr)
        return true
      }
    }
    return false
  }
}
