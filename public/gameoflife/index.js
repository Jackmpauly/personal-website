
class Simulation {
    constructor(rows, cols) {
        this.rows = rows
        this.cols = cols

        this.board = []
        for (let r = 0; r < this.rows; r++) {
            this.board.push(new Array(this.cols).fill(false))
        }
        this._buffer = []
        for (let r = 0; r < this.rows; r++) {
            this._buffer.push(new Array(this.cols).fill(false))
        }
        console.log('Initialized board:', this.board)
    }

    randomizeBoard = () => {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.board[r][c] = Math.random() < 0.5
            }
        }
    }

    countNeighboursOf = (r, c) => {
        return (
            (this.board[r-1]?.[c-1] ? 1 : 0) +
            (this.board[r-1]?.[c]   ? 1 : 0) +
            (this.board[r-1]?.[c+1] ? 1 : 0) +
            (this.board[r]?.[c-1]   ? 1 : 0) +
            (this.board[r]?.[c+1]   ? 1 : 0) +
            (this.board[r+1]?.[c-1] ? 1 : 0) +
            (this.board[r+1]?.[c]   ? 1 : 0) +
            (this.board[r+1]?.[c+1] ? 1 : 0)
        )
    }


    step = () => {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const num = this.countNeighboursOf(r, c)
                if (!this.board[r][c] && num === 3) {
                    this._buffer[r][c] = true
                } else if (this.board[r][c] && (num < 2 || num > 3)) {
                    this._buffer[r][c] = false
                } else {
                    this._buffer[r][c] = this.board[r][c]
                }
            }
        }
        [this.board, this._buffer] = [this._buffer, this.board]
    }
}


const canvas = document.querySelector('canvas')
const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
canvas.width = WIDTH
canvas.height = HEIGHT

const CELL_SIZE = 20
const ROWS = Math.floor(HEIGHT / CELL_SIZE)
const COLS = Math.floor(WIDTH / CELL_SIZE)

const sim = new Simulation(ROWS, COLS)
sim.randomizeBoard()

const ctx = canvas.getContext('2d')

let frameCount = 0
let paused = false

const cellAt = (x, y) => [Math.floor(y / CELL_SIZE), Math.floor(x / CELL_SIZE)]

document.addEventListener('keypress', e => {
    if (e.key == 'p') {
        paused = !paused
    } else {
        console.log('Unhandled key.')
    }
})

canvas.addEventListener('click', e => {
    const [r, c] = cellAt(e.clientX, e.clientY)
    sim.board[r][c] = !sim.board[r][c]
})

function animate() {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    ctx.fillStyle = '#FFF'
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (sim.board[r][c]) {
                ctx.fillRect(c*CELL_SIZE, r*CELL_SIZE, CELL_SIZE, CELL_SIZE)
            }
        }
    }

    if (!paused) {
        sim.step()
    }

    frameCount++
    requestAnimationFrame(animate)
}
requestAnimationFrame(animate)