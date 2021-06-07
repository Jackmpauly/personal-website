class Piece {
    static unicodeChar = str => {
        const color = str[1] == 'w' ? 9812 : 9818
        const kind = 'KQRBNP'.indexOf(str[0])
        return String.fromCharCode(color + kind)
    }
    static fromString = str => new Piece(str[0], str[1])
    constructor(kind, color) {
        if (!'KQRBNP'.includes(kind))
            throw new TypeError(`'${str[0]}' is not a valid kind.`)
        if (!'bw'.includes(color))
            throw new TypeError(`'${str[1]}' is not a valid color.`)
        this.kind = kind
        this.color = color
    }
    toString = () => this.kind + this.color
}

const CYAN   = '#0FF'
const BLUE   = '#00F'
const ORANGE = '#FA0'
const PURPLE = '#F0F'
const YELLOW = '#FF0'
const RED    = '#F00'
const GREEN  = '#0F0'

// Piece types
class Tetromino {
    /**
     * @param {[number, number]} pos
     * @param {Array.<[number, number]>} shape
     * @param {string} color
     */
    constructor(pos, shape, color) {
        this.pos = pos
        this.shape = shape
        this.color = color
    }
}

class S extends Tetromino {
    /**
     * @param {[number, number]} pos 
     */
    constructor(pos) {
        this.pos = pos
        this.shape = [
            [-1, 1],
            [0, 1],
            [0, 0],
            [1, 0]
        ]
        this.color = GREEN
    }

    rotate() {
        this.shape = this.shape.map(([r, c]) => [c, -r])
    }
}

class Z extends Tetromino {
    /**
     * @param {[number, number]} pos 
     */
    constructor(pos) {
        this.pos = pos
        this.shape = [
            [-1, 0],
            [0, 1],
            [0, 0],
            [1, 0]
        ]
        this.color = GREEN
    }

    rotate() {
        this.shape = this.shape.map(([r, c]) => [c, -r])
    }
}


class I extends Tetromino {
    constructor(pos) {

    }
}

class Game {
    static initBoard = () => {
        const board = [

        ]
        return board.map(row =>
            row.map(p => p === '' ?
                null :
                Piece.fromString(p)
            )
        )
    }

    constructor({ rows, cols }) {
        this.rows = rows
        this.cols = cols
        this.board = Array(rows)
        for (let r = 0; r < rows; r++) {
            this.board[r] = Array(cols).fill(null)
        }
    }


}

const ROWS = 20
const COLS = 12
const CELL_SIZE = 20

const SVG = 'http://www.w3.org/2000/svg'
const display = document.createElementNS(SVG, 'svg')
display.setAttribute('width', COLS*CELL_SIZE + 40)
display.setAttribute('height', ROWS*CELL_SIZE + 40)

for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
        const el = document.createElementNS(SVG, 'rect')
        el.setAttribute('fill', (r+c)%2 == 0 ?
            '#222' :
            '#000'
        )
        el.setAttribute('stroke', 'none')
        el.setAttribute('x', CELL_SIZE * c)
        el.setAttribute('y', CELL_SIZE * r)
        el.setAttribute('width', CELL_SIZE)
        el.setAttribute('height', CELL_SIZE)
        display.appendChild(el)
    }
}
// function makePiece(piece, r, c) {
//     const el = document.createElementNS(SVG, 'text')
//     el.appendChild(document.createTextNode(Piece.unicodeChar(piece)))
//     el.setAttribute('width', CELL_SIZE)
//     el.setAttribute('height', CELL_SIZE)
//     el.setAttribute('fill', piece[1] === 'b' ? '#000' : '#FFF')
//     el.setAttribute('x', (c+1/2)*CELL_SIZE)
//     el.setAttribute('y', (r+1)*CELL_SIZE - CELL_SIZE/6)
//     el.style.fontSize = CELL_SIZE
//     el.style.textAnchor = 'middle'
//     el.style.userSelect = 'none'
//     return el
// }

const game = new Game(ROWS, COLS)
console.log(game.board)
// for (let r = 0; r < game.board.length; r++) {
//     for (let c = 0; c < game.board[r].length; c++) {
//         const piece = game.board[r][c]
//         if (piece) {
//             display.appendChild(makePiece(piece.toString(), r, c))
//         }
//     }
// }


const boardContainer = document.getElementById('game-container')
boardContainer.appendChild(display)