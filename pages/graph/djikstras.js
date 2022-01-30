import PageTitle from '@/components/PageTitle'
import GraphButtons from '@/components/graph/GraphButtons'
import React, { createRef, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { GraphNode, Graph, getRandomInt } from '@/components/graph/Algorithms.ts'

const VISITED_COLOR = 'red'
const VISITED_COLOR_DARK = 'red'
const CURRENT_COLOR = 'rgb(64,64,64,1)'
const CURRENT_COLOR_DARK = 'white'
const PARENT_COLOR = 'yellow'
const PARENT_COLOR_DARK = 'yellow'

// const ANIMATION_SPEED_OFFSET = 1

export default function djikstras() {
  const { theme, resolvedTheme } = useTheme()
  const [animations, setAnimations] = useState([])
  const [nodeStrIdx, setNodeStrIdx] = useState([])
  const [errorState, setErrorState] = useState(false)
  let playAnimation = false
  const [edges, setEdges] = useState([])
  let node
  function handlePlay() {
    playAnimation = true
    console.log('Playing')
  }
  let Sketch = (p) => {
    // Setup
    const N = 5
    let nodeArray = []
    let nodeLocations = []
    let edgePaths = []
    // let edgeWeights = edges.map((e) => e[2])
    // let visited = []
    let selectedNode = null
    let animCtr = 0
    let foundParents = false
    const NODE_RADIUS = 42
    class Node {
      constructor(x, y, value) {
        this.x = x
        this.y = y
        this.value = value
        this.strokeColor = p.color(118, 129, 142)
        this.fillColor = 255
        this.textColor = 0
      }
      setColors(visited, current) {
        if (visited) this.strokeColor = p.color(236, 62, 50)
        if (current) this.strokeColor = p.color(169, 253, 172)
      }
      show() {
        p.strokeWeight(5)
        p.stroke(this.strokeColor)
        p.fill(this.fillColor)
        p.ellipse(this.x, this.y, NODE_RADIUS * 2, NODE_RADIUS * 2)
        p.fill(this.textColor)
        p.strokeWeight(0)
        p.textAlign(p.CENTER)
        p.textSize(20)
        p.text(this.value, this.x, this.y + 5)
      }
      updatePos(x, y) {
        this.x = x
        this.y = y
      }
    }
    function makeCircles() {
      let ctr = 1
      while (ctr < N) {
        console.log('Found:', nodeLocations.length)
        let pX = nodeLocations[ctr - 1][0]
        let pY = nodeLocations[ctr - 1][1]
        let r = NODE_RADIUS
        if (pY + 5 * r < p.height - 20 && pY - 5 * r > 20) {
          for (var x = pX - 4 * r; x <= pX + 4 * r; x++) {
            let c1 = x - (r + 10) < 0
            let c2 = x + (r + 10) > p.width - 20
            if (c1 || c2) continue
            let y = p.ceil(p.sqrt(4 * r * (4 * r) - (x - pX) * (x - pX)) + pY)
            let c3 = y - (r + 10) < 0
            let c4 = y + (r + 10) > p.height - 20
            if (c3 || c4) continue
            let valid = true
            for (var nIdx = 0; nIdx < nodeLocations.length; nIdx++) {
              let d = p.dist(nodeLocations[nIdx][0], nodeLocations[nIdx][1], x, y)
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
          for (var y = pY - 4 * r; y <= pY + 4 * r; y++) {
            let c1 = y - (r + 10) < 0
            let c2 = y + (r + 10) > p.height - 20
            if (c1 || c2) continue
            let x = p.ceil(p.sqrt(4 * r * (4 * r) - (y - pY) * (y - pY)) + pX)
            let c3 = x - (r + 10) < 0
            let c4 = x + (r + 10) > p.width - 20
            if (c3 || c4) continue
            let valid = true
            for (var nIdx = 0; nIdx < nodeLocations.length; nIdx++) {
              let d = p.dist(nodeLocations[nIdx][0], nodeLocations[nIdx][1], x, y)
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
    }
    p.setup = () => {
      p.createCanvas(1080, 600)
      nodeLocations.push([
        p.floor(p.random(500 + 30 + NODE_RADIUS, p.width * 0.2)),
        p.floor(p.random(300 + 30 + NODE_RADIUS, p.height * 0.2)),
      ])
      makeCircles()
      for (var n = 0; n < N; n++) {
        nodeArray.push(new Node(nodeLocations[n][0], nodeLocations[n][1], nodeStrIdx[n]))
        // edgeWeights.push(p.random(1, 10))
        // visited.push(false)
      }
      console.log(animations)
      for (var e = 0; e < edges.length; e++) {
        let n1 = getNode(edges[e][0])
        let n2 = getNode(edges[e][1])
        edgePaths.push([n1, n2, edges[e][2], p.color(11, 5, 0)])
      }
      p.frameRate(5)
    }
    // Anim
    function resetDraw() {
      animCtr = 0
      for (const n of nodeArray) {
        n.strokeColor = p.color(118, 129, 142)
      }
      for (const e of edgePaths) {
        e[3] = p.color(11, 5, 0)
      }
      p.loop()
    }
    function getNode(val) {
      for (var j = 0; j < nodeArray.length; j++) {
        if (nodeArray[j].value === val) return nodeArray[j]
      }
    }
    function selectNode(x, y) {
      let shortD = Infinity
      let retNode = null
      for (var i = 0; i < nodeLocations.length; i++) {
        let d = p.dist(x, y, nodeLocations[i][0], nodeLocations[i][1])
        if (d < shortD) {
          shortD = d
          retNode = nodeArray[i]
        }
      }
      return retNode
    }
    function handleAnimations(animation) {
      if (animation[1] === 'parent') {
        console.log('Parents Found')
        let splitString = animation[0].split(/(\s+)/)
        console.log(splitString)
        console.log(edgePaths)
        let parentNode = getNode(splitString[0])
        let childNode = getNode(splitString[2])
        if (parentNode === undefined || childNode === undefined) {
          console.log('Umm')
          return
        }
        // Resetting Nodes
        if (!foundParents) {
          for (const n of nodeArray) {
            n.strokeColor = p.color(118, 129, 142)
          }
        }
        parentNode.strokeColor = p.color(169, 253, 172)
        childNode.strokeColor = p.color(169, 253, 172)
        let index = edgePaths.findIndex((e) => e[0] === parentNode && e[1] === childNode)
        edgePaths[index][3] = p.color(169, 253, 172)
        foundParents = true
      } else {
        let drawNode = getNode(animation[0])
        if (drawNode === undefined) {
          console.log('Umm')
          return
        }
        if (animation[1] === 'current') {
          drawNode.strokeColor = p.color(236, 62, 50)
        } else if (animation[1] === 'visited') {
          drawNode.strokeColor = p.color(169, 253, 172)
        }
      }
    }
    p.doubleClicked = () => {
      selectedNode = selectNode(p.mouseX, p.mouseY)
    }
    p.touchStarted = () => {
      selectedNode = selectNode(p.mouseX, p.mouseY)
    }
    p.mouseMoved = () => {
      if (selectedNode != null) selectedNode.updatePos(p.mouseX, p.mouseY)
    }
    p.touchMoved = () => {
      if (selectedNode != null) selectedNode.updatePos(p.mouseX, p.mouseY)
    }
    p.mouseClicked = () => {
      selectedNode = null
    }
    p.touchEnded = () => {
      selectedNode = null
    }
    p.draw = () => {
      p.background(220)
      console.log(playAnimation)
      if (playAnimation) {
        handleAnimations(animations[animCtr])
        animCtr++
        if (animCtr > animations.length - 1) p.noLoop()
      }
      for (var x = 0; x < edgePaths.length; x++) {
        drawPath(
          edgePaths[x][0].x,
          edgePaths[x][0].y,
          edgePaths[x][1].x,
          edgePaths[x][1].y,
          edgePaths[x][2],
          edgePaths[x][3]
        )
      }
      for (var j = 0; j < nodeArray.length; j++) {
        nodeArray[j].show()
      }
    }
    function drawPath(x1, y1, x2, y2, weight, c) {
      p.stroke(c)
      p.strokeWeight(weight)
      p.line(x1, y1, x2, y2)
      p.strokeWeight(0)
    }
  }
  useEffect(() => {
    let A = new GraphNode('A')
    let B = new GraphNode('B')
    let C = new GraphNode('C')
    let D = new GraphNode('D')
    let E = new GraphNode('E')
    let graphNodeArray = [A, B, C, D, E]
    //     // for (var a = 0; a < 5; a++) {
    //     //   let g = new GraphNode(String.fromCharCode(65 + a))
    //     //   graphNodeArray.push(g)
    //     // }
    let validGraph = false
    let graphEdges = []
    let graphAnimations = []
    let graphDistances = []
    let ctr = 0
    while (!validGraph && ctr < 10) {
      const G = new Graph(graphNodeArray)
      graphEdges = G.makeAllEdges()
      try {
        let animOP = G.getAnimations(graphNodeArray[0].idx, graphNodeArray[2].idx)
        graphDistances = animOP[0]
        graphAnimations = animOP[1]
        validGraph = true
      } catch {
        validGraph = false
      }
      ctr++
    }
    // G.addEdge(A, B, 6)
    // G.addEdge(A, D, 1)
    // G.addEdge(B, C, 5)
    // G.addEdge(B, E, 2)
    // G.addEdge(D, B, 2)
    // G.addEdge(D, E, 1)
    // G.addEdge(E, C, 5)
    // console.log(graphAnimations)
    if (validGraph && ctr < 11) {
      setAnimations(graphAnimations)
      setEdges(graphEdges)
      setNodeStrIdx(Object.keys(graphDistances))
      node = document.createElement('div')
      document.getElementsByClassName('p5JS')[0].appendChild(node)
    } else {
      setErrorState(true)
    }
  }, [])
  useEffect(() => {
    if (
      !errorState &&
      animations[0] !== undefined &&
      edges[0] !== undefined &&
      nodeStrIdx[0] !== undefined
    ) {
      // P5 Setup
      console.log(nodeStrIdx)
      const p5 = require('p5')
      const myp5 = new p5(Sketch, node)
    }
  }, [animations])
  return (
    <>
      <div className="mt-4 text-center">
        <PageTitle>Djikstras Algorithm</PageTitle>
        <div>{errorState && <p>Error, try refreshing</p>}</div>
        {/* <div>{!errorState && animations.map((a) => <p>{a[0]}</p>)}</div> */}
        <div className="w-full h-auto flex flex-row justify-around items-end p5JS"></div>
        <GraphButtons
          callSort={handlePlay}
          fillNewValues={() => window.location.reload()}
          // resetValues={resetDraw}
        ></GraphButtons>
      </div>
    </>
  )
}
