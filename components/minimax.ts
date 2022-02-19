export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) //The maximum is exclusive and the minimum is inclusive
}
export class tictactoe {
  game_matrix: number[][] | string[][]
  player_coin: 'X' | 'O'
  completed: boolean
  ai: tictactoe_ai_player
  minimax_tree: { board: string[]; score: number; children: any }
  constructor(botStarts: boolean, useABPruning: boolean = false) {
    this.game_matrix = this.make_game_matrix()
    this.player_coin = botStarts ? 'O' : 'X'
    this.ai = new tictactoe_ai_player(botStarts ? 'X' : 'O', useABPruning, 3)
    this.completed = false
  }

  make_game_matrix = (): number[][] => {
    let ret = [
      [-2, -2, -2],
      [-2, -2, -2],
      [-2, -2, -2],
    ]
    // return [[-2]*3 for(var i=0;i<;i++)(3)]
    return ret
  }
  get_simple_matrix = (): string[] => {
    let ret: string[] = []
    for (var i = 0; i < this.game_matrix.length; i++) {
      for (var j = 0; j < this.game_matrix[0].length; j++) {
        ret.push(this.game_matrix[i][j] !== -2 ? this.game_matrix[i][j].toString() : '')
      }
    }
    return ret
  }
  get_free_spots = (): number[] => {
    let free_slots: number[] = []
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (this.game_matrix[i][j] === -2) free_slots.push(1 + j + 3 * i)
      }
    }
    return free_slots
  }

  has_won = (): { has_won: boolean; winner: string | number } => {
    for (var i = 0; i < 3; i++) {
      let j = 0
      if (
        this.game_matrix[i][j] === this.game_matrix[i][j + 1] &&
        this.game_matrix[i][j] === this.game_matrix[i][j + 2] &&
        this.game_matrix[i][j] !== -2
      ) {
        return { has_won: true, winner: this.game_matrix[i][j] }
      }
    }
    for (var j = 0; j < 3; j++) {
      let i = 0
      if (
        this.game_matrix[i][j] === this.game_matrix[i + 1][j] &&
        this.game_matrix[i][j] === this.game_matrix[i + 2][j] &&
        this.game_matrix[i][j] !== -2
      ) {
        return { has_won: true, winner: this.game_matrix[i][j] }
      }
    }
    if (
      this.game_matrix[0][0] === this.game_matrix[1][1] &&
      this.game_matrix[0][0] === this.game_matrix[2][2] &&
      this.game_matrix[1][1] !== -2
    ) {
      return { has_won: true, winner: this.game_matrix[0][0] }
    }
    if (
      this.game_matrix[2][0] === this.game_matrix[1][1] &&
      this.game_matrix[2][0] === this.game_matrix[0][2] &&
      this.game_matrix[1][1] !== -2
    ) {
      return { has_won: true, winner: this.game_matrix[2][0] }
    }
    return { has_won: false, winner: null }
  }

  is_finished = (): boolean => {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (this.game_matrix[i][j] === -2) {
          return false
        }
      }
    }
    return true
  }

  update_matrix(index: number, coin: string | number) {
    let lut = {
      1: {
        i: 0,
        j: 0,
      },
      2: {
        i: 0,
        j: 1,
      },
      3: {
        i: 0,
        j: 2,
      },
      4: {
        i: 1,
        j: 0,
      },
      5: {
        i: 1,
        j: 1,
      },
      6: {
        i: 1,
        j: 2,
      },
      7: {
        i: 2,
        j: 0,
      },
      8: {
        i: 2,
        j: 1,
      },
      9: {
        i: 2,
        j: 2,
      },
    }
    this.game_matrix[lut[index]['i']][lut[index]['j']] = coin
    // return game_matrix
  }

  player_move = (
    index: number
  ): {
    success: boolean
    completed: boolean
    error?: boolean
    draw?: boolean
    win?: boolean
    winner?: string
    errormsg?: string
  } => {
    let free_spots = this.get_free_spots()
    if (free_spots.includes(index)) {
      this.update_matrix(index, this.player_coin)
    } else {
      console.log('Invalid Move')
      return {
        success: false,
        completed: this.completed,
        error: true,
        errormsg: 'The spot has already been filled.',
      }
    }
    // this.minimax_tree = this.ai.minimax_tree(this, this.player_coin, 4)
    let win_status = this.has_won()
    if (!win_status['has_won']) {
      if (!this.is_finished()) {
        let next_index = this.ai.get_move(this)
        this.update_matrix(next_index, this.ai.coin)
        let next_win_status = this.has_won()
        if (next_win_status['has_won'] && next_win_status['winner'] === this.ai.coin) {
          // Bot Win
          this.completed = true
          return { success: true, completed: true, win: true, winner: this.ai.coin }
        } else if (this.is_finished()) {
          // Draw
          this.completed = true
          return { success: true, completed: true, draw: true }
        } else {
          return { success: true, completed: false }
        }
      } else {
        // Draw
        this.completed = true
        return { success: true, completed: true, draw: true }
      }
    } else if (win_status['has_won'] && win_status['winner'] === this.player_coin) {
      // Player Win
      this.completed = true
      return { success: true, completed: true, win: true, winner: this.player_coin }
    } else if (win_status['has_won'] && win_status['winner'] === this.ai.coin) {
      // Bot Win
      this.completed = true
      return { success: true, completed: true, win: true, winner: this.ai.coin }
    } else {
      // Error
      console.log('Error')
      return {
        success: false,
        completed: this.completed,
        error: true,
        errormsg: 'Unexpected Error',
      }
    }
    if (this.completed) console.log('Completed')
  }
}
export class tictactoe_ai_player {
  coin: string
  ctr: number
  useABPruning: boolean
  treeDepth: number
  constructor(coin: string, useABPruning: boolean, treeDepth: number = 2) {
    this.coin = coin
    this.ctr = 0
    this.useABPruning = useABPruning
    this.treeDepth = treeDepth
  }

  get_move(game: tictactoe) {
    let free_spots = game.get_free_spots()
    if (free_spots.length === 9) {
      return free_spots[getRandomInt(0, free_spots.length)]
    } else if (free_spots.length === 8) {
      if (
        !free_spots.includes(1) ||
        !free_spots.includes(3) ||
        !free_spots.includes(7) ||
        !free_spots.includes(9)
      ) {
        return 5
      } else if (!free_spots.includes(5)) {
        return 1
      } else if (!free_spots.includes(2) || !free_spots.includes(4)) {
        return 1
      } else {
        return 9
      }
    } else {
      let move: { position: number | null; score: number }
      if (this.useABPruning) {
        console.log('Using AB Pruning')
        game.minimax_tree = this.minimax_AB_tree(game, this.coin, this.treeDepth)
        move = this.minimax_AB(game, this.coin)
      } else {
        game.minimax_tree = this.minimax_tree(game, this.coin, this.treeDepth)
        move = this.minimax(game, this.coin)
      }
      return move['position']
    }
  }

  minimax = (game: tictactoe, player: string): { position: number | null; score: number } => {
    let max_player = this.coin
    let opponent = player === 'O' ? 'X' : 'O'

    if (game.has_won()['winner'] === opponent) {
      return {
        position: null,
        score:
          opponent === max_player
            ? 1 * (game.get_free_spots().length + 1)
            : -1 * (game.get_free_spots().length + 1),
      }
    } else if (game.get_free_spots().length === 0) {
      return { position: null, score: 0 }
    }
    let best_move: { position: number | null; score: number }
    if (player === max_player) {
      best_move = { position: null, score: -Infinity }
    } else {
      best_move = { position: null, score: Infinity }
    }
    for (const spot of game.get_free_spots()) {
      game.update_matrix(spot, player)
      let sim = this.minimax(game, opponent)
      game.update_matrix(spot, -2)
      sim['position'] = spot

      if (player === max_player) {
        if (sim['score'] > best_move['score']) {
          best_move = sim
        }
      } else {
        if (sim['score'] < best_move['score']) {
          best_move = sim
        }
      }
    }
    return best_move
  }

  minimax_AB = (
    game: tictactoe,
    player: string,
    alpha: number = -Infinity,
    beta: number = Infinity
  ): { position: number | null; score: number } => {
    let max_player = this.coin
    let opponent = player === 'O' ? 'X' : 'O'

    if (game.has_won()['winner'] === opponent) {
      return {
        position: null,
        score:
          opponent === max_player
            ? 1 * (game.get_free_spots().length + 1)
            : -1 * (game.get_free_spots().length + 1),
      }
    } else if (game.get_free_spots().length === 0) {
      return { position: null, score: 0 }
    }
    let best_move: { position: number | null; score: number }
    if (player === max_player) {
      best_move = { position: null, score: -Infinity }
    } else {
      best_move = { position: null, score: Infinity }
    }
    for (const spot of game.get_free_spots()) {
      game.update_matrix(spot, player)
      let sim = this.minimax_AB(game, opponent, alpha, beta)
      game.update_matrix(spot, -2)
      sim['position'] = spot

      if (player === max_player) {
        if (sim['score'] > best_move['score']) {
          best_move = sim
        }
        alpha = Math.max(alpha, best_move.score)
        if (beta <= alpha) break
      } else {
        if (sim['score'] < best_move['score']) {
          best_move = sim
        }
        beta = Math.min(beta, best_move.score)
        if (beta <= alpha) break
      }
    }
    return best_move
  }

  minimax_tree = (
    game: tictactoe,
    player: string,
    depth: number
  ): { board: string[]; score: number; children: any } => {
    let max_player = this.coin
    let opponent = player === 'O' ? 'X' : 'O'
    let myBoard = game.get_simple_matrix()

    if (game.has_won()['winner'] === opponent) {
      return {
        board: game.get_simple_matrix(),
        score:
          opponent === max_player
            ? 1 * (game.get_free_spots().length + 1)
            : -1 * (game.get_free_spots().length + 1),
        children: [],
      }
    } else if (game.get_free_spots().length === 0) {
      return { board: myBoard, score: 0, children: [] }
    }
    let myScore = -Infinity
    let myChildren = []
    if (depth > 0) {
      for (const spot of game.get_free_spots()) {
        game.update_matrix(spot, player)
        let ret = this.minimax_tree(game, opponent, depth - 1)
        myScore = Math.max(myScore, ret.score)
        myChildren.push(ret)
        game.update_matrix(spot, -2)
      }
    }
    return { board: myBoard, score: myScore, children: myChildren }
  }

  minimax_AB_tree = (
    game: tictactoe,
    player: string,
    depth: number,
    alpha: number = -Infinity,
    beta: number = Infinity
  ): { board: string[]; score: number; children: any } => {
    let max_player = this.coin
    let opponent = player === 'O' ? 'X' : 'O'
    let myBoard = game.get_simple_matrix()

    if (game.has_won()['winner'] === opponent) {
      return {
        board: game.get_simple_matrix(),
        score:
          opponent === max_player
            ? 1 * (game.get_free_spots().length + 1)
            : -1 * (game.get_free_spots().length + 1),
        children: [],
      }
    } else if (game.get_free_spots().length === 0) {
      return { board: myBoard, score: 0, children: [] }
    }
    let myScore = -Infinity
    let myChildren = []
    if (depth > 0) {
      for (const spot of game.get_free_spots()) {
        game.update_matrix(spot, player)
        let ret = this.minimax_tree(game, opponent, depth - 1)
        if (player === max_player) {
          myScore = Math.max(myScore, ret.score)
          alpha = Math.max(alpha, myScore)
          if (beta <= alpha) break
        } else {
          myScore = Math.min(myScore, ret.score)
          beta = Math.min(beta, myScore)
          if (beta <= alpha) break
        }
        myChildren.push(ret)
        game.update_matrix(spot, -2)
      }
    }
    return { board: myBoard, score: myScore, children: myChildren }
  }
}
