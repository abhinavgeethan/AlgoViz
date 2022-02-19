import PageTitle from '@/components/PageTitle'
import GraphButtons from '@/components/graph/GraphButtons'
import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { tictactoe } from '@/components/minimax.ts'
var T
let minimaxTree = undefined
export default function minimax() {
  const [grid, setGrid] = useState([
    { idx: 1, value: '' },
    { idx: 2, value: '' },
    { idx: 3, value: '' },
    { idx: 4, value: '' },
    { idx: 5, value: '' },
    { idx: 6, value: '' },
    { idx: 7, value: '' },
    { idx: 8, value: '' },
    { idx: 9, value: '' },
  ])
  const [gameCompleted, setGameCompleted] = useState(false)
  const [guide, setGuide] = useState({ type: 'info', msg: 'Your turn' })
  let canvasDiv = useRef(null)

  let Sketch = (p) => {
    class Board {
      constructor(size, coins, x, y, parent = undefined, score = null) {
        this.size = size
        this.grid = coins
        this.x = x
        this.y = y
        this.gridPos = {}
        this.children = []
        this.parent = parent
        this.score = score
      }
      addChild(coins, score) {
        let childSize = this.size / 1.5
        let xCenter = this.x + this.size / 2 - childSize / 2
        this.moveParent(this, this.parent, childSize)
        for (const c of this.children) {
          c.x -= childSize / 2 + childSize / 4
          xCenter += childSize / 2 + childSize / 4
        }
        let child = new Board(childSize, coins, xCenter, this.y + this.size + 80, this, score)
        this.children.push(child)
        return child
      }
      moveParent(me, currParent, currSize) {
        while (currParent !== undefined) {
          let myIndex = currParent.children.findIndex((e) => e === me)
          for (var i = 0; i < currParent.children.length; i++) {
            let child = currParent.children[i]
            let moveFactor = 1.5
            if (i === myIndex) {
              continue
            } else if (i < myIndex) {
              child.x -= currSize / moveFactor
              child.moveChildren(currSize / moveFactor, 'left')
            } else {
              child.x += currSize / moveFactor
              child.moveChildren(currSize / moveFactor, 'right')
            }
          }
          currParent = currParent.parent
          // currSize*=1.5
        }
      }
      moveChildren(moveSize, direction) {
        for (const c of this.children) {
          if (c.children !== []) {
            if (direction === 'left') c.x -= moveSize
            else c.x += moveSize
          }
        }
      }
      calcGridPos() {
        let sector = this.size / 3
        this.gridPos = {
          0: { x: this.x + sector / 2, y: this.y + sector / 2 },
          1: { x: this.x + sector / 2, y: this.y + sector + sector / 2 },
          2: { x: this.x + 2 * sector + sector / 2, y: this.y + sector / 2 },
          3: { x: this.x + sector / 2, y: this.y + 2 * sector + sector / 2 },
          4: { x: this.x + sector + sector / 2, y: this.y + sector + sector / 2 },
          5: { x: this.x + 2 * sector + sector / 2, y: this.y + sector + sector / 2 },
          6: { x: this.x + sector + sector / 2, y: this.y + sector / 2 },
          7: { x: this.x + sector + sector / 2, y: this.y + 2 * sector + sector / 2 },
          8: { x: this.x + 2 * sector + sector / 2, y: this.y + 2 * sector + sector / 2 },
        }
      }
      drawborders() {
        p.stroke(0)
        let sector = this.size / 3
        //     Verticals
        p.line(this.x, this.y, this.x, this.y + this.size)
        p.line(this.x + sector, this.y, this.x + sector, this.y + this.size)
        p.line(this.x + 2 * sector, this.y, this.x + 2 * sector, this.y + this.size)
        p.line(this.x + 3 * sector, this.y, this.x + 3 * sector, this.y + this.size)
        //     Horizontals
        p.line(this.x, this.y, this.x + this.size, this.y)
        p.line(this.x, this.y + sector, this.x + this.size, this.y + sector)
        p.line(this.x, this.y + 2 * sector, this.x + this.size, this.y + 2 * sector)
        p.line(this.x, this.y + 3 * sector, this.x + this.size, this.y + 3 * sector)
      }
      showCoins() {
        p.noStroke()
        this.calcGridPos()
        p.textAlign(p.CENTER)
        p.textSize(this.size / 6)
        for (var i = 0; i < this.grid.length; i++) {
          let gridLoc = this.gridPos[i]
          if (this.grid[i] === 'X') {
            p.fill(255, 0, 0)
          } else {
            p.fill(0)
          }
          p.text(this.grid[i], gridLoc.x, gridLoc.y + this.size / 12)
        }
      }
      show() {
        for (const c of this.children) {
          c.show()
          p.stroke('rgba(0,0,0,0.25)')
          p.line(this.x + this.size / 2, this.y + this.size / 2, c.x + c.size / 2, c.y)
        }
        p.fill(255)
        p.rect(this.x, this.y, this.size, this.size)
        this.drawborders()
        this.showCoins()
        if (this.score !== null)
          p.text(this.score, this.x + this.size / 2, this.y + this.size + this.size / 5)
      }
    }
    let zoom = 1
    let org = []
    let toorg = []
    let b
    let prevTree = undefined
    function loadTree(startNode) {
      if (!startNode.children) return
      let visited = [startNode]
      let q = [startNode]
      b = new Board(120, startNode.board, p.width / 2 - 60, 20, undefined, startNode.score)
      let bq = [b]
      while (q.length !== 0) {
        let node = q.shift()
        let bNode = bq.shift()
        for (const nbr of node.children) {
          if (!visited.includes(nbr)) {
            q.push(nbr)
            visited.push(nbr)
            let bNbr = bNode.addChild(nbr.board, nbr.score)
            bq.push(bNbr)
          }
        }
      }
    }
    p.setup = () => {
      p.createCanvas(900, 600)
      // let thisGrid = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X']
      let currTree = minimaxTree
      // { board: string[]; score: number; children: any }
      if (currTree !== undefined) {
        // b = new Board(120, currTree.board, p.width / 2 - 60, 20, (score = currTree.score))
        // // let n = 7
        // for (var i = 0; i < currTree.children.length; i++) {
        //   let currChild = currTree.children[i]
        //   b.addChild(currChild.board, currChild.score)
        // }
        // for (var i = 0; i < n; i++) {
        //   for (var j = 0; j < n - 1; j++) {
        //     b.children[i].addChild(thisGrid, p.floor(p.random(10)))
        //   }
        // }
        loadTree(currTree)
        prevTree = currTree
      }
      org = [0, 0]
      toorg = org
      p.frameRate(12)
    }
    p.mouseDragged = () => {
      toorg = [org[0] + p.mouseX - p.pmouseX, org[1] + p.mouseY - p.pmouseY]
    }
    p.mouseWheel = (event) => {
      zoom += event.wheelDeltaY / 100
    }
    p.draw = () => {
      p.background(220)
      if (minimaxTree === undefined) {
        b = null
        return
      }
      if (prevTree !== minimaxTree) {
        console.log(minimaxTree)
        loadTree(minimaxTree)
        prevTree = minimaxTree
        console.log('Loading tree')
      }
      org[0] = p.lerp(org[0], toorg[0], 0.9)
      org[1] = p.lerp(org[1], toorg[1], 0.9)
      p.translate(org[0], org[1])
      p.scale(p.lerp(1, zoom, 0.09))
      if (b) b.show()
    }
  }

  useEffect(() => {
    T = new tictactoe(false, false)
    let blankGrid = []
    for (var i = 0; i < T.game_matrix.length; i++) {
      for (var j = 0; j < T.game_matrix[0].length; j++) {
        blankGrid.push({
          idx: T.game_matrix.length * i + j + 1,
          value: T.game_matrix[i][j] === -2 ? '' : T.game_matrix[i][j],
        })
      }
    }
    setGrid(blankGrid)
    const p5 = require('p5')
    const myp5 = new p5(Sketch, canvasDiv.current)
  }, [])
  function handleSquareClick(idx) {
    if (gameCompleted) return
    setGuide({ type: 'info', msg: 'Thinking' })
    let game_status = T.player_move(idx)
    if (game_status.error) {
      console.error(game_status.errormsg)
      setGuide({ type: 'error', msg: game_status.errormsg })
      return
    }
    let blankGrid = []
    for (var i = 0; i < T.game_matrix.length; i++) {
      for (var j = 0; j < T.game_matrix[0].length; j++) {
        blankGrid.push({
          idx: T.game_matrix.length * i + j + 1,
          value: T.game_matrix[i][j] === -2 ? '' : T.game_matrix[i][j],
        })
      }
    }
    setGrid(blankGrid)
    minimaxTree = T.minimax_tree
    if (game_status.completed) {
      setGameCompleted(true)
      if (game_status.win) {
        setGuide({ type: 'win', msg: `${game_status.winner === T.ai.coin ? 'I' : 'You'} Win!` })
      } else {
        setGuide({ type: 'Draw', msg: "It's a Draw." })
      }
    } else setGuide({ type: 'info', msg: 'Your turn' })
  }
  function resetGame() {
    T = new tictactoe(false)
    let blankGrid = []
    for (var i = 0; i < T.game_matrix.length; i++) {
      for (var j = 0; j < T.game_matrix[0].length; j++) {
        blankGrid.push({
          idx: T.game_matrix.length * i + j + 1,
          value: T.game_matrix[i][j] === -2 ? '' : T.game_matrix[i][j],
        })
      }
    }
    setGrid(blankGrid)
    setGameCompleted(false)
    setGuide({ type: 'info', msg: 'Your turn' })
    minimaxTree = undefined
  }
  function handleCheckbox(e) {
    T.ai.useABPruning = e.target.checked
  }
  return (
    <>
      <div className="mt-4 text-center">
        <PageTitle>Minimax</PageTitle>
        <div className="w-full h-auto flex flex-col md:flex-row justify-around items-center p-4">
          <div className="">
            <div className="grid grid-cols-3 mx-auto w-64 border-black dark:border-gray-500 border-solid border-2">
              {grid.map((g) => {
                return (
                  <div
                    key={g.idx}
                    className="h-24 border-solid border-2 border-black dark:border-gray-500 text-center flex justify-center align-middle cursor-pointer"
                    onClick={() => handleSquareClick(g.idx)}
                  >
                    <span
                      className={`${
                        g.value === 'X' ? 'text-red-500' : ''
                      } font-extrabold flex items-center justify-center text-3xl`}
                    >
                      {g.value}
                    </span>
                  </div>
                )
              })}
            </div>
            <div
              className={`w-full border-black border-solid dark:border-gray-500 border-2 py-4 my-4 rounded-md ${
                guide.type === 'error' ? 'text-red-500 border-red-300' : ''
              }`}
            >
              {guide.msg}
            </div>
            <button
              className="bg-gray-300 hover:bg-gray-600 text-gray-800 font-bold py-2 px-4 rounded"
              onClick={() => resetGame()}
            >
              Reset
            </button>
            <div className="mx-auto p-4">
              <label className="inline-flex items-center">
                <input
                  className="text-gray-500 w-6 h-6 mr-2 focus:ring-black border border-gray-300 rounded"
                  type="checkbox"
                  onChange={handleCheckbox}
                />
                Alpha-Beta Pruning
              </label>
            </div>
          </div>
          <div ref={canvasDiv} className="min-w-half p5JS px-4"></div>
        </div>
      </div>
    </>
  )
}
