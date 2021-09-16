const mod = (n, p) => n >= 0 ? n % p : n % p + p

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

    getCellWrapped = (r, c) => {
        const row = this.board[mod(r, this.board.length)]
        return row[mod(c, row.length)]
    }

    countNeighboursOf = (r, c) => (
        (this.board[r-1]?.[c-1] ? 1 : 0) +
        (this.board[r-1]?.[c]   ? 1 : 0) +
        (this.board[r-1]?.[c+1] ? 1 : 0) +
        (this.board[r]?.[c-1]   ? 1 : 0) +
        (this.board[r]?.[c+1]   ? 1 : 0) +
        (this.board[r+1]?.[c-1] ? 1 : 0) +
        (this.board[r+1]?.[c]   ? 1 : 0) +
        (this.board[r+1]?.[c+1] ? 1 : 0)
    )

    countNeighboursWrappedOf = (r, c) => (
        Number(this.getCellWrapped(r-1, c-1)) +
        Number(this.getCellWrapped(r-1, c)) +
        Number(this.getCellWrapped(r-1, c+1)) +
        Number(this.getCellWrapped(r, c-1)) +
        Number(this.getCellWrapped(r, c+1)) +
        Number(this.getCellWrapped(r+1, c-1)) +
        Number(this.getCellWrapped(r+1, c)) +
        Number(this.getCellWrapped(r+1, c+1))
    )

    step = () => {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const num = this.countNeighboursWrappedOf(r, c)
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

let frameCount = 0
let paused = true

const cellAt = (x, y) => [Math.floor(y / CELL_SIZE), Math.floor(x / CELL_SIZE)]

document.addEventListener('keypress', e => {
    switch (e.key) {
        case 'p':
            paused = !paused
            break
        case 'r':
            sim.randomizeBoard()
            break
        case 's':
            if (paused) sim.step()
            break
    }
})

canvas.addEventListener('click', e => {
    const [r, c] = cellAt(e.clientX, e.clientY)
    sim.board[r][c] = !sim.board[r][c]
})

const ctx = canvas.getContext('2d')
ctx.textAlign = 'center'
ctx.translate(
    (WIDTH - COLS*CELL_SIZE) / 2,
    (HEIGHT - ROWS*CELL_SIZE) / 2
)

function animate() {
    ctx.fillStyle = '#090D0C'
    ctx.fillRect(-20, -20, WIDTH+20, HEIGHT+20)

    ctx.fillStyle = '#01301F'
    const FONT = 'monospace'
    const BIG_FONT_HEIGHT = 275
    ctx.font = `${BIG_FONT_HEIGHT}px ${FONT}`
    ctx.fillText('LIFE', WIDTH/2, HEIGHT/2 + BIG_FONT_HEIGHT/2 - 75)

    const LINE_HEIGHT = 40
    const FONT_HEIGHT = 35
    ctx.font = `${FONT_HEIGHT}px ${FONT}`
    ctx.fillText('Press \'r\' to randomize.', WIDTH/2, HEIGHT/2 + BIG_FONT_HEIGHT/2)
    ctx.fillText('Press \'p\' to play/pause.', WIDTH/2, HEIGHT/2 + BIG_FONT_HEIGHT/2 + 1*LINE_HEIGHT)
    ctx.fillText('Press \'s\' to step while paused.', WIDTH/2, HEIGHT/2 + BIG_FONT_HEIGHT/2 + 2*LINE_HEIGHT)
    ctx.fillText('Click to revive/kill cell.', WIDTH/2, HEIGHT/2 + BIG_FONT_HEIGHT/2 + 3*LINE_HEIGHT)

    ctx.fillStyle = '#C1FAD6'
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