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

class Game {
    /** @returns {[[Piece|null]]} */
    static initBoard = () => {
        const board = [
            ['Rb','Bb','Nb','Qb','Kb','Nb','Bb','Rb'],
            ['Pb','Pb','Pb','Pb','Pb','Pb','Pb','Pb'],
            ['',  '',  '',  '',  '',  '',  '',  ''],
            ['',  '',  '',  '',  '',  '',  '',  ''],
            ['',  '',  '',  '',  '',  '',  '',  ''],
            ['',  '',  '',  '',  '',  '',  '',  ''],
            ['Pw','Pw','Pw','Pw','Pw','Pw','Pw','Pw'],
            ['Rw','Bw','Nw','Qw','Kw','Nw','Bw','Rw'],
        ]
        return board.map(row =>
            row.map(p => p === '' ?
                null :
                Piece.fromString(p)
            )
        )
    }
    constructor() {
        this.board = Game.initBoard()
    }
}

const SVG = 'http://www.w3.org/2000/svg'
const board = document.createElementNS(SVG, 'svg')
const size = 500
board.setAttribute('width', size)
board.setAttribute('height', size)
const colWidth  = size / 8
const rowHeight = size / 8

for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
        const el = document.createElementNS(SVG, 'image')
        el.setAttribute('href', (r+c)%2 == 0 ?
            '../assets/light-tile.jpeg' :
            '../assets/dark-tile.png'
        )
        el.setAttribute('x', colWidth * c)
        el.setAttribute('y', rowHeight * r)
        el.setAttribute('width', colWidth)
        el.setAttribute('height', rowHeight)
        board.appendChild(el)
    }
}
function makePiece(piece, r, c) {
    const el = document.createElementNS(SVG, 'text')
    el.appendChild(document.createTextNode(Piece.unicodeChar(piece)))
    el.setAttribute('width', colWidth)
    el.setAttribute('height', rowHeight)
    el.setAttribute('fill', piece[1] === 'b' ? '#000' : '#FFF')
    el.setAttribute('x', (c+1/2)*colWidth)
    el.setAttribute('y', (r+1)*rowHeight - rowHeight/6)
    el.style.fontSize = rowHeight
    el.style.textAnchor = 'middle'
    el.style.userSelect = 'none'
    return el
}
const game = new Game()
for (let r = 0; r < game.board.length; r++) {
    for (let c = 0; c < game.board[r].length; c++) {
        const piece = game.board[r][c]
        if (piece) {
            board.appendChild(makePiece(piece.toString(), r, c))
        }
    }
}


const boardContainer = document.getElementById('chessboard-container')
boardContainer.appendChild(board)