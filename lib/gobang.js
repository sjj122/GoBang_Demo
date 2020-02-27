const HORIZONTAL_SIZE = 15  // 高有十五格
const VERTICAL_SIZE = 12    // 宽有十二格


class GoBang {
    constructor () {
        this.HORIZONTAL_SIZE = HORIZONTAL_SIZE
        this.VERTICAL_SIZE = VERTICAL_SIZE

        this.players = []                   // 玩家列表
        this.checkerBoard = []              // 棋盘
        this.colorList = ['white', 'black'] // 棋子颜色
        this.gaming = false                 // 游戏是否开始
        this.turn = 'black'                 // 当前的落子颜色
    }

    // 创建玩家
    createPlayer (socket) { // 接受一个玩家的连接
        let playerCount = this.players.length
        if (playerCount >= 2) return false      // 不能超过两人

        let player = {
            socket,
            color: this.colorList.pop() // 拿到颜色然后弹出这个颜色去
        }

        this.players.push(player)
        socket.player = player     // 在socket对象上加一个player属性

        return true
    }

    // 获取当前玩家数量
    getPlayerNum () {
        return this.players.length
    }

    // 初始化棋盘
    init () {
        // 初始化棋盘
        for (let i = -5; i < this.HORIZONTAL_SIZE + 5; ++i) {
            this.checkerBoard[i] = []
            for (let j = -5; j < this.VERTICAL_SIZE + 5; ++j) {
                this.checkerBoard[i][j] = {
                    state: false,       // 标志棋盘是否为空
                    type: true      // 白色就是true， 黑色为false
                }
            }
        }

        this.gaming = true
    }

    // 玩家离开
    leaveGame (socket) {
        if (!socket.player) return;     // 游客就直接离开了

        for (let i = 0; i < this.players.length; ++i) {
            if (this.players[i].color === socket.player.color) {
                this.colorList.push(socket.player.color)
                this.players.splice(i, 1)
                break
            }
        }
    }

    // 客户端落子
    putChess (x, y) {
        this.checkerBoard[x][y].state = true        // 不能在摆放了
        this.checkerBoard[x][y].type = this.turn    // 当前的颜色
        this.toggleTurn()
    }

    //  反转棋子颜色
    toggleTurn () {
        this.turn = (this.turn === 'black') ? 'white' : 'black'
    }

    // 游戏结束
    gameOver (x, y) {
        return this.checkAllDirectionChess(x, y)
    }

    // 共用函数
    checkOneLineChess (tpx, tpy, xplus, yplus, type) {
        let count = 0
        for (let i = 0; i < 10; ++i) {
            if (this.checkerBoard[tpx][tpy].type === type && this.checkerBoard[tpx][tpy].state === true) {
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
    checkAllDirectionChess (x, y) {
        // 左上右下
        if (this.checkOneLineChess(x - 5, y - 5, 1, 1, this.checkerBoard[x][y].type)) return true
        // 从上到下
        if(this.checkOneLineChess(x, y - 5, 0, 1, this.checkerBoard[x][y].type)) return true
        // 右上到左下
        if(this.checkOneLineChess(x - 5, y + 5, 1, -1, this.checkerBoard[x][y].type)) return true
        // 从左到右
        if(this.checkOneLineChess(x - 5, y, 1, 0, this.checkerBoard[x][y].type)) return true

        return false
    }
}

module.exports = GoBang
