// 初始化
function init() {
    // 初始化棋盘
    for (let i = -5; i < HORIZONTAL_SIZE + 5; ++i) {
        checkerBoard[i] = []
        for (let j = -5; j < VERTICAL_SIZE + 5; ++j) {
            checkerBoard[i][j] = {
                state: 0,       // 标志棋盘是否为空
                type: true      // 白色就是true， 黑色为false
            }
        }
    }
    drawCheckerBoard()
    // 绑定点击事件
    cvs.onclick = putChess
}

// 画棋盘
function drawCheckerBoard() {
    for (let i = 0; i < HORIZONTAL_SIZE; ++i) {
        for (let j = 0; j < VERTICAL_SIZE; ++j) {
            ctx.beginPath()     // 开始一个新的绘图路径

            ctx.strokeStyle = '#000'
            ctx.fillStyle = '#add8e6'
            ctx.fillRect(i * GRID_SIZE, j * GRID_SIZE, GRID_SIZE, GRID_SIZE)
            ctx.strokeRect(i * GRID_SIZE, j * GRID_SIZE, GRID_SIZE, GRID_SIZE)

            ctx.closePath()     // 结束当前的绘图路径
        }
    }
}

// 绘制棋子
function drawArc(x, y) {
    ctx.beginPath()     // 开始一个新的绘图路径

    ctx.strokeStyle = '#000'
    ctx.fillStyle = whiteTurn ? '#fff' : '#000'
    ctx.arc(GRID_SIZE * (x + 0.5), GRID_SIZE * (y + 0.5), (GRID_SIZE / 2) * 0.8, 0, 2 * Math.PI)
    ctx.fill()

    ctx.closePath()     // 结束当前的绘图路径

    // 下过的不能再下
    checkerBoard[x][y].state = true     // 这个地方已落子
    checkerBoard[x][y].type = whiteTurn

    // 白棋下完黑棋下
    whiteTurn = !whiteTurn

    gameOver(x, y)
}

// 落子事件
function putChess(e) {
    let x = e.pageX - cvs.offsetLeft, y = e.pageY - cvs.offsetTop

    // 计算点击在哪个格
    x = parseInt(x / GRID_SIZE)
    y = parseInt(y / GRID_SIZE)

    if (checkerBoard[x][y].state) return;

    drawArc(x, y)
}

// 游戏结束判断（八个方向）
function gameOver(x, y) {
    if(checkAllDirectionChess(x, y)) {
        let winChess = whiteTurn ? '黑棋' : '白棋'
        document.getElementById('tips').innerHTML = `<h3>${winChess}胜</h3>`
        cvs.onclick = null  // 取消事件
    }
    // 提示哪一方下子
    let nowChess = whiteTurn ? '白棋' : '黑棋'
    document.getElementById('tipsTwo').innerHTML = `现在轮到<span style="color:red;">${nowChess}</span>落子`
}

// 共用函数
function checkOneLineChess(tpx, tpy, xplus, yplus, type) {
    let count = 0
    for (let i = 0; i < 10; ++i) {
        if (checkerBoard[tpx][tpy].type === type && checkerBoard[tpx][tpy].state === true) {
            count++
            if (count === 5) {
                return true
            }
        } else {    // 只要有一个断了，那就重新开始
            count = 0
        }
        tpx += xplus
        tpy += yplus
    }
    return false
}

// 判断一个棋子的四个方向
function checkAllDirectionChess(x, y) {
    // 左上右下
    if (checkOneLineChess(x - 5, y - 5, 1, 1, checkerBoard[x][y].type)) return true
    // 从上到下
    if(checkOneLineChess(x, y - 5, 0, 1, checkerBoard[x][y].type)) return true
    // 右上到左下
    if(checkOneLineChess(x - 5, y + 5, 1, -1, checkerBoard[x][y].type)) return true
    // 从左到右
    if(checkOneLineChess(x - 5, y, 1, 0, checkerBoard[x][y].type)) return true

    return false
}

// 判断一个棋子的四个方向
// function checkAllDirectionChess(x, y) {
//     let tpx = x, tpy = y
//     let type = checkerBoard[x][y].type   // 现在要比较的到底是白棋还是黑棋
//     let count = 0                   // 判断 count 是否为 5
//     let i = 0                       // 循环变量
//
//     // 左上右下
//     tpx -= 5
//     tpy -= 5
//     for (i = 0; i < 10; ++i) {
//         if (checkerBoard[tpx][tpy].type === type && checkerBoard[tpx][tpy].state === true) {
//             count++
//             if (count === 5) {
//                 return true
//             }
//         } else {    // 只要有一个断了，那就重新开始
//             count = 0
//         }
//         tpx++
//         tpy++
//     }
//
//     // 从上到下
//     tpx = x
//     tpy = y - 5
//     count = 0
//     for (i = 0; i < 10; ++i) {
//         if (checkerBoard[tpx][tpy].type === type && checkerBoard[tpx][tpy].state === true) {
//             count++
//             if (count === 5) {
//                 return true
//             }
//         } else {    // 只要有一个断了，那就重新开始
//             count = 0
//         }
//         tpy++
//     }
//
//     // 右上到左下
//     tpx = x + 5
//     tpy = y - 5
//     count = 0
//     for (i = 0; i < 10; ++i) {
//         if (checkerBoard[tpx][tpy].type === type && checkerBoard[tpx][tpy].state === true) {
//             count++
//             if (count === 5) {
//                 return true
//             }
//         } else {    // 只要有一个断了，那就重新开始
//             count = 0
//         }
//         tpx--
//         tpy++
//     }
//
//     // 从左到右
//     tpx = x - 5
//     tpy = y
//     count = 0
//     for (i = 0; i < 10; ++i) {
//         if (checkerBoard[tpx][tpy].type === type && checkerBoard[tpx][tpy].state === true) {
//             count++
//             if (count === 5) {
//                 return true
//             }
//         } else {    // 只要有一个断了，那就重新开始
//             count = 0
//         }
//         tpx++
//     }
//
//     return false
// }
