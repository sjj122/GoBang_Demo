const express = require('express')
const app = express()
const path = require('path')
const GoBang = require('./lib/gobang')
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'assets')))       // 开放静态资源

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

var gobang = new GoBang()

var prevX = -1, prevY = -1    // 保存上一次下子的地方，方便取消高亮

io.on('connection', socket => {
    if (gobang.createPlayer(socket)) {
        // 游戏可以开始了
        if (gobang.getPlayerNum() >= 2) {
            gobang.init()
            broadcast()
        }
        socket.emit('conn', {
            color: socket.player.color,
            num: gobang.getPlayerNum(),
            hs: gobang.HORIZONTAL_SIZE,
            vs: gobang.VERTICAL_SIZE
        })
    } else {
        broadcast()
        // 人满了
        socket.emit('conn', {
            color: 'null',
            num: gobang.getPlayerNum(),
            hs: gobang.HORIZONTAL_SIZE,
            vs: gobang.VERTICAL_SIZE
        })
    }

    socket.on('putChess', (x, y) => {
        // 拿下来的是一个字符，将它取整
        x = parseInt(x)
        y = parseInt(y)

        gobang.putChess(x, y)
        broadcast()            // 每次落子都广播一下

        // 判断游戏是否结束
        if (gobang.gameOver(x, y)) {
            io.emit('gameover', gobang.turn === 'black' ? 'white' : 'black')
        }
    })

    socket.on('savePrev', (x ,y) => {
        prevX = x
        prevY = y
    })

    socket.on('disconnect', () => {
        prevX = -1
        prevY = -1
        gobang.leaveGame(socket)    // 玩家离开游戏
    })

})

function broadcast () {
    io.emit('getCheckerBoard', {
        turn: gobang.turn,
        checkerBoard: gobang.checkerBoard,   // 传棋盘
        prevX,
        prevY
    })
}


server.listen(3000, () => console.log('server is running'))
