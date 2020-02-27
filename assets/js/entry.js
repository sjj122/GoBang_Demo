const GRID_SIZE = 40        // 格子大小
const HORIZONTAL_SIZE = 15  // 高有十五格
const VERTICAL_SIZE = 12    // 宽有十二格

const cvs = document.getElementById('cvs')
const ctx = cvs.getContext('2d')

var checkerBoard = []           // 一个棋盘二维数组
var whiteTurn = true            // true 代表白子下，false 黑子下

cvs.width = GRID_SIZE * HORIZONTAL_SIZE
cvs.height = GRID_SIZE * VERTICAL_SIZE

document.getElementById('btn').onclick = function () {
    document.getElementById('tips').innerHTML = ''
    init()
}

init()



// ctx.strokeRect(0, 0, 100, 100)
// ctx.fillRect(100, 100, 100, 100)     填充矩形

// ctx.fillStyle = 'red'
// ctx.arc(100, 100, 50, 0, 2 * Math.PI)   // 0到360度
// // ctx.stroke()
// ctx.fill()