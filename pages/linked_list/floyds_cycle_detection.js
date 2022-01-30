import PageTitle from '@/components/PageTitle'
import GraphButtons from '@/components/linkedlist/GraphButtons'
import React, { createRef, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { ListNode, LinkedList } from '@/components/linkedlist/Algorithms.ts'

const VISITED_COLOR = 'red'
const VISITED_COLOR_DARK = 'red'
const CURRENT_COLOR = 'rgb(64,64,64,1)'
const CURRENT_COLOR_DARK = 'white'
const PARENT_COLOR = 'yellow'
const PARENT_COLOR_DARK = 'yellow'

// const ANIMATION_SPEED_OFFSET = 1

export default function cycleDetection() {
  const { theme, resolvedTheme } = useTheme()
  const [animations, setAnimations] = useState([])
  const [nodeStrIdx, setNodeStrIdx] = useState([])
  const [errorState, setErrorState] = useState(false)
  let playAnimation = false
  let stepMode = false
  const [edges, setEdges] = useState([])
  let node
  const N = 5
  function handlePlay() {
    playAnimation = true
    console.log('Playing')
  }
  function handleStep() {
    if (!stepMode) stepMode = true
    handlePlay()
  }
  let Sketch = (p) => {
    // Setup
    let nodeArray = []
    let nodeLocations = []
    let edgePaths = []
    let prevSlowNode = null
    let prevFastNode = null
    let selectedNode = null
    let animCtr = 0
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
      // setColors(visited, current) {
      //   if (visited) this.strokeColor = p.color(236, 62, 50)
      //   if (current) this.strokeColor = p.color(169, 253, 172)
      // }
      resetStroke() {
        this.strokeColor = p.color(118, 129, 142)
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
      // console.log(animations)
      for (var n = 0; n < nodeArray.length - 1; n++) {
        let n1 = nodeArray[n]
        let n2 = nodeArray[n + 1]
        edgePaths.push([n1, n2, 5, p.color(11, 5, 0)])
      }
      edgePaths.push([getNode(edges[0]), getNode(edges[1]), 5, p.color(11, 5, 0)])
      console.log('Edge Paths', edgePaths)
      // for (var e = 0; e < edges.length; e++) {
      //   let n1 = getNode(edges[e][0])
      //   let n2 = getNode(edges[e][1])
      //   edgePaths.push([n1, n2, edges[e][2], p.color(11, 5, 0)])
      // }
      p.frameRate(2)
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
      if (animation[1] === 'cyclePath') {
        console.log('Path Found')
        let splitString = animation[0].split(/(\s+)/)
        console.log(splitString)
        console.log(edgePaths)
        let pathNodes = []
        for (var i = 0; i < splitString.length; i += 2) {
          pathNodes.push(getNode(splitString[i]))
        }
        for (const n of nodeArray) {
          n.strokeColor = p.color(118, 129, 142)
        }
        // }
        for (var j = 0; j < pathNodes.length - 1; j++) {
          pathNodes[j].strokeColor = p.color(169, 253, 172)
          pathNodes[j + 1].strokeColor = p.color(169, 253, 172)
          let index = edgePaths.findIndex((e) => e[0] === pathNodes[j + 1] && e[1] === pathNodes[j])
          edgePaths[index][3] = p.color(169, 253, 172)
        }
        p.noLoop()
      } else {
        let drawNode = getNode(animation[0])
        if (drawNode === undefined) {
          console.log('Umm')
          return
        }
        if (animation[1] === 'slow') {
          if (prevSlowNode !== null) prevSlowNode.resetStroke()
          drawNode.strokeColor = p.color(236, 62, 50)
          prevSlowNode = drawNode
        } else if (animation[1] === 'fast') {
          if (prevFastNode !== null) prevFastNode.resetStroke()
          drawNode.strokeColor = p.color(169, 253, 172)
          prevFastNode = drawNode
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
      if (playAnimation) {
        handleAnimations(animations[animCtr])
        animCtr++
        if (animCtr > animations.length - 1) p.noLoop()
        if (stepMode) playAnimation = false
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
    let A = new ListNode('A')
    const L = new LinkedList(A)
    let strIdx = ['A']
    for (var i = 1; i < N; i++) {
      let nodeVal = String.fromCharCode(65 + i)
      L.newNode(nodeVal)
      strIdx.push(nodeVal)
    }
    setNodeStrIdx(strIdx)
    let cycleNodes = L.makeCyclic()
    setEdges(cycleNodes)
    let animOP = L.getCycleDetectionAnimations()
    console.log(animOP)
    if (animOP !== undefined) {
      setAnimations(animOP)
      node = document.createElement('div')
      node.id = 'node'
      document.getElementsByClassName('p5JS')[0].appendChild(node)
    } else setErrorState(true)
  }, [])
  useEffect(() => {
    if (
      !errorState &&
      animations[0] !== undefined
      // edges[0] !== undefined &&
      // nodeStrIdx[0] !== undefined
    ) {
      // P5 Setup
      const p5 = require('p5')
      const myp5 = new p5(Sketch, node)
    }
  }, [animations])
  return (
    <>
      <div className="mt-4 text-center">
        <PageTitle>Floyd's Cycle Detection Algorithm</PageTitle>
        <div>{errorState && <p>Error, try refreshing</p>}</div>
        <div className="w-full h-auto flex flex-row justify-around items-end p5JS"></div>
        <GraphButtons
          callSort={handlePlay}
          fillNewValues={() => window.location.reload()}
          stepSort={handleStep}
          // resetValues={resetDraw}
        ></GraphButtons>
      </div>
    </>
  )
}
