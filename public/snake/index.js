const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const CELL_SIZE = 20
const ROWS = Math.floor(canvas.height / CELL_SIZE)
const COLS = Math.floor(canvas.width / CELL_SIZE)
const HOR_MARGIN = canvas.width % CELL_SIZE / 2
const VERT_MARGIN = canvas.height % CELL_SIZE / 2

const UP = [-1, 0]
const DOWN = [1, 0]
const LEFT = [0, -1]
const RIGHT = [0, 1]

const mod = (x, p) => x >= 0 ? x % p : x % p + p

const freshGame = () => ({
    snake: [
        [Math.floor(ROWS / 2), Math.floor(COLS / 2)]
    ],
    direction: RIGHT,
    food: [2, 2],
})

let gameState = freshGame()

function updateGame() {
    const nextHead = [
        mod(gameState.snake[0][0] + gameState.direction[0], ROWS),
        mod(gameState.snake[0][1] + gameState.direction[1], COLS)
    ]
    if (nextHead[0] === gameState.food[0] && nextHead[1] === gameState.food[1]) {
        gameState.snake.unshift(nextHead)
        let newFood
        do {
            newFood = [Math.floor(ROWS*Math.random()), Math.floor(COLS*Math.random())]
        } while (gameState.snake.some(([r, c]) => r === newFood[0] && c === newFood[1]))
        gameState.food = newFood
    } else if (gameState.snake.some(([r, c]) => nextHead[0] === r && nextHead[1] === c)) {
        gameState = freshGame()
    } else {
        gameState.snake.unshift(nextHead)
        gameState.snake.pop()
    }
}

function switchDirection(dir) {
    if (gameState.snake.length > 1) {
        const currDir = [
            gameState.snake[0][0] - gameState.snake[1][0],
            gameState.snake[0][1] - gameState.snake[1][1]
        ]
        if (currDir[0] + dir[0] !== 0 || currDir[1] + dir[1] !== 0) {
            gameState.direction = dir
        }
    } else {
        gameState.direction = dir
    }
}

document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'h':
        case 'ArrowLeft':
        case 'Left':
            switchDirection(LEFT)
            break
        case 'j':
        case 'ArrowDown':
        case 'Down':
            switchDirection(DOWN)
            break
        case 'k':
        case 'ArrowUp':
        case 'Up':
            switchDirection(UP)
            break
        case 'l':
        case 'ArrowRight':
        case 'Right':
            switchDirection(RIGHT)
            break
    }
})

const ctx = canvas.getContext('2d')
let t = 0

function animate() {
    ctx.fillStyle = '#333'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#000'
    ctx.fillRect(HOR_MARGIN, VERT_MARGIN, canvas.width - 2 * HOR_MARGIN,
        canvas.height - 2 * VERT_MARGIN)

    ctx.strokeStyle = '#000'
    ctx.lineWidth = 1

    ctx.fillStyle = '#F00'
    ctx.beginPath()
    ctx.rect(
        HOR_MARGIN + gameState.food[1] * CELL_SIZE,
        VERT_MARGIN + gameState.food[0] * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
    )
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#FF0'
    for (const [r, c] of gameState.snake) {
        ctx.beginPath()
        ctx.rect(HOR_MARGIN + c * CELL_SIZE, VERT_MARGIN + r * CELL_SIZE,
            CELL_SIZE, CELL_SIZE)
        ctx.fill()
        ctx.stroke()
    }

    if (t % 3 === 0)
        updateGame()
    t++
    requestAnimationFrame(animate)
}

requestAnimationFrame(animate)