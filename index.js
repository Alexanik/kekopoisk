const { FastMediaClient } = require('electron-fast-media-client')

let kinopoiskMediaClient = new FastMediaClient(
    'https://hd.kinopoisk.ru/',
    'video'
)