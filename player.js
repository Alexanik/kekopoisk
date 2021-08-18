'use strict'

const EventEmmiter = require('events')
const { globalShortcut } = require('electron')

class Player extends EventEmmiter {
    constructor(window, ipcMain) {
        super()

        this.window = window
        this.ipcMain = ipcMain
        this.state = {}
        this.paused = true
        this.volume = 1
        this.duration = 0
        this.currentTime = 0

        this.ipcMain.on('EVENT_VIDEO', (e, paused, volume, duration, currentTime) => {
            this.duration = duration
            this.currentTime = currentTime

            this.emit('EVENT_VIDEO', paused, volume, duration, currentTime)
        })

        this.ipcMain.on('EVENT_VIDEO_HIDE', (e) => {
            this.emit('EVENT_VIDEO_HIDE')
        })

        this.ipcMain.on('EVENT_VIDEO_VOLUME_CHANGE', (e, volume) => {
            this.volume = volume

            this.emit('EVENT_VIDEO_VALUE_CHANGE')
        })

        this.ipcMain.on('EVENT_VIDEO_TIME_UPDATE', (e, currentTime, duration, paused) => {
            this.duration = duration
            this.currentTime = currentTime
            this.paused = paused

            this.emit('EVENT_VIDEO_TIME_UPDATE', currentTime, duration)
        })

        this.ipcMain.on('EVENT_VIDEO_PAUSE', (e) => {
            this.paused = true

            this.emit('EVENT_VIDEO_PAUSE')
        })

        this.ipcMain.on('EVENT_VIDEO_PLAY', (e) => {
            this.paused = false

            this.emit('EVENT_VIDEO_PLAY')
        })
    }

    play = () => {
        this.window.webContents.send('EVENT_PLAY', null)
    }

    seek = (percents) => {
        let onePercent = this.duration / 100
        let newTime = Math.round(onePercent * percents)

        console.log(`per = ${percents}, op = ${onePercent}, newTime = ${newTime}`)

        this.window.webContents.send('EVENT_SEEK', newTime)

        /*
        this.window.webContents.executeJavaScript(`
            netflixVideoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer
            player = netflixVideoPlayer.getVideoPlayerBySessionId(netflixVideoPlayer.getAllPlayerSessionIds()[0])

            player.seek(${newTime})
        `)
        */
    }
}

module.exports.Player = Player
