// Dependecies
import {
    forEach,
    split
} from 'lodash'
// styles
import '../sass/index.scss'
// card images
import images from '../images/*.png'
// custom scripts
import {
    shuffledCards,
    gettransitionEnd
} from './utils'

/* Game Object */
const Game = {
    // selectors
    cards: document.querySelectorAll('.card'),
    cardsFront: document.querySelectorAll('.front'),
    playerMoves: document.querySelector('#playerMoves'),
    playerTime: document.querySelector('#playerTime'),
    restartBtn: document.querySelector('#restart'),
    scoreModal: document.querySelector('#scoreModal'),
    timeBadge: document.querySelector('#timeBadge'),
    moveBadge: document.querySelector('#moveBadge'),
    restartBtnModal: document.querySelector('#restartModal'),
    boardLock: false,
    flipedCardsCache: [],
    moveCounter: 0,
    pairMatched: 0,
    timer: null,
    timestring: '',
    gameTime: {
        hour: 0,
        minute: 0,
        second: 0
    },

    /* methods */
    start: function() {
        this.loadCardImages()
        this.setEvents()
        console.log('Game Start')
    },
    restart: function() {
        Game.resetBoard(() => {
            if (!Game.scoreModal.classList.contains('hide')) {
                Game.hideModal()
                window.setTimeout(() => {
                    Game.scoreModal.classList.add('hide')
                    Game.scoreModal.classList.remove('fade-out')
                }, 600)
            }
            Game.start()
        })
    },
    resetBoard: function(cb) {
        this.resetTimer()
        this.resetMoveCounter()
        this.resetCards(this.cards, cb)
    },
    resetCards: function(cards, cb) {
        forEach(cards, card => {
            card.firstElementChild.innerHTML = ''
            if (card.classList.contains('flip-card')) {
                card.classList.remove('flip-card')
            }
        })
        setTimeout(() => {
            forEach(cards, card => {
                if (card.classList.contains('hide-card')) {
                    card.classList.remove('hide-card')
                }
            })
            cb()
        }, 500)
    },
    loadCardImages: function() {
        let shuffleImagesList = shuffledCards()
        forEach(this.cardsFront, (front, i) => {
            let img = document.createElement('img')
            img.src = images[shuffleImagesList[i]]
            let name = split(shuffleImagesList[i], '-')[0]
            front.setAttribute('data-name', name)
            front.appendChild(img)
        })
    },
    setEvents: function() {
        forEach(this.cards, card => {
            card.addEventListener('click', this.flipCard)
        })
        this.restartBtn.addEventListener('click', this.restart)
        this.restartBtnModal.addEventListener('click', this.restart)
    },
    flipCard: function() {
        if (Game.boardLock || this.classList.contains('flip-card')) {
            console.info('card already fliped or board locked');
            return
        }
        // start timer on first flip
        if (Game.moveCounter === 0) {
            Game.startTimer()
        }
        this.classList.add('flip-card')
        Game.addMove()
        Game.flipedCardsCache.push(this)
        if (Game.flipedCardsCache.length === 2) {
            Game.toggleBoardLock()
            window.setTimeout(() => {
                Game.isMatch() ? Game.matche() : Game.unmatch()
            }, 500)
        }
    },
    isMatch: function() {
        return this.flipedCardsCache[0].firstElementChild.dataset.name ===
        this.flipedCardsCache[1].firstElementChild.dataset.name
    },
    matche: function() {
        this.hideMatched()
        this.clearCardsCache()
    },
    unmatch: function() {
        this.flipBack()
        this.clearCardsCache()
    },
    flipBack: function() {
        forEach(this.flipedCardsCache, card => {
            card.classList.remove('flip-card')
        })
    },
    hideMatched: function() {
        forEach(this.flipedCardsCache, card => {
            card.classList.add('hide-card')
        })
        this.pairMatched++
        if (this.pairMatched === 12) {
            this.populateModal()
            this.showModal()
            console.log('Game Over')
        }
    },
    populateModal: function() {
        this.timeBadge.textContent = this.timestring
        this.moveBadge.textContent = this.moveCounter
    },
    showModal: function() {
        this.scoreModal.classList.remove('hide')
        this.scoreModal.classList.add('fade-in')
        window.scrollTo(0,0)
    },
    hideModal: function() {
        this.scoreModal.classList.remove('fade-in')
        this.scoreModal.classList.add('fade-out')
    },
    startTimer: function() {
        this.timer = window.setTimeout(this.counter, 1000)
    },
    counter: function() {
        Game.gameTime['second']++
        if (Game.gameTime['second'] >= 60) {
            Game.gameTime['minute']++
            Game.gameTime['second'] = 0
        }
        if (Game.gameTime['minute'] >= 60) {
            Game.gameTime['hour']++
            Game.gameTime['minute'] = 0
        }
        let hours = Game.gameTime['hour'] < 10 ? `0${Game.gameTime['hour']}` : Game.gameTime['hour']
        let minutes = Game.gameTime['minute'] < 10 ? `0${Game.gameTime['minute']}` : `${Game.gameTime['minute']}`
        let seconds = Game.gameTime['second'] < 10 ? `0${Game.gameTime['second']}` : `${Game.gameTime['second']}`

        Game.timestring = hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`
        Game.playerTime.textContent = Game.timestring
        Game.startTimer()
    },
    resetTimer: function() {
        clearTimeout(this.timer)
        this.gameTime['hour'] = 0
        this.gameTime['minute'] = 0
        this.gameTime['second'] = 0
        Game.playerTime.textContent = '00:00'
    },
    addMove: function() {
        this.moveCounter++
        this.playerMoves.textContent = this.moveCounter
    },
    resetMoveCounter: function() {
        this.moveCounter = 0
        this.pairMatched = 0
        this.playerMoves.textContent = this.moveCounter
    },
    clearCardsCache: function() {
        window.setTimeout(() => {
            this.flipedCardsCache = []
            this.toggleBoardLock()
        }, 500)
    },
    toggleBoardLock: function() {
        this.boardLock = !this.boardLock
    }

}

document.addEventListener('DOMContentLoaded', function(e) {
    Game.start()
})
