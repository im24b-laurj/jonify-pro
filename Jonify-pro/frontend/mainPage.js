
const playlists = await getPlaylists()

let isSeeking = false
const audio = document.getElementById('audio-player')

const progress_bar = document.getElementById('progress-bar')
progress_bar.addEventListener('input', () => {
    isSeeking = true


})
progress_bar.addEventListener('change', () => {
    audio.currentTime = progress_bar.value
    isSeeking = false
    console.log(progress_bar.value + 'bar value')
    console.log(audio.currentTime + 'current Time')
})
audio.addEventListener('loadedmetadata', () => {
    progress_bar.max = Math.floor(audio.duration)
    const time_in_seconds = Math.floor(audio.duration)
    const minutes = Math.floor(time_in_seconds / 60)
    const seconds = time_in_seconds - minutes * 60
    document.getElementById('total-time').innerText = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`
})




audio.addEventListener('timeupdate', () => {
    const time_in_seconds = Math.floor(audio.currentTime)
    const minutes = Math.floor(time_in_seconds / 60)
    const seconds = time_in_seconds - minutes * 60
    if (!isSeeking) {
    document.getElementById('current-time').innerText = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`
        progress_bar.value = time_in_seconds}







})

window.openPlaylistModal= function() {
    document.getElementById('playlist-modal').style.display = 'flex'
}

window.closePlaylistModal = function() {
    document.getElementById('playlist-modal').style.display = 'none'
}


window.createPlaylist = async function() {
    const name = document.getElementById('playlist-name-input').value
    await fetch('http://localhost:3000/playlists', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: name})
    })
    closePlaylistModal()
    location.reload()
}


window.openAddToPlaylistModal = function(songId) {
    var html = ''
    for (const p of playlists.playlists) {
        html += `<div class="playlist-choice" onclick="addSongToPlaylist(${p.id}, ${songId})">${p.name}</div>`
    }
    document.getElementById('playlist-choices').innerHTML = html
    document.getElementById('add-to-playlist-modal').style.display = 'flex'
}

window.closeAddToPlaylistModal = function() {
    document.getElementById('add-to-playlist-modal').style.display = 'none'
}

window.addSongToPlaylist = async function(playlistId, songId) {
    await fetch('http://localhost:3000/playlists/song', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({playlistId: playlistId, songId: songId})
    })
    closeAddToPlaylistModal()
    alert('Song added to playlist')
}

window.showPlaylistSongs = async function(id) {
    const playlist = playlists.playlists.find(p => p.id === id)
    document.getElementById('playlist-title').innerText = playlist.name
    var songs = await getSongsOfPlaylist(id)
    if (!songs.success) {
        document.getElementById('songs-body').innerHTML = '<tr><td colspan="5">No songs found</td></tr>'
        return
    }
    var html_songs = ``

    var index = 0
    for (const i of songs.songs) {
        index += 1

        const diff = new Date() - new Date(i.time_added);
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(minutes / 60)
        const minutes_only = minutes - hours * 60
        const minutes_long = Math.floor(i.duration / 60)
        const remaining_seconds = Math.floor(i.duration - minutes_long * 60)


        html_songs += `<tr>
            <td class="song-number">${index}</td>
            <td onclick="playSong(${i.id}, '${i.title}', '${i.artist}')">
                <div class="song-title-cell">
                    <img src="http://localhost:3000/api/songs/cover/${i.id}" />
                    <div>
                        <div class="song-title">${i.title}.</div>
                        <div class="song-artist">${i.artist}j</div>
                    </div>
                </div>
            </td>
            <td>${i.album}</td>
            <td>${hours}:${minutes_only}</td>
            <td><button class="add-to-playlist-btn" onclick="openAddToPlaylistModal(${i.id})">+</button></td>
            <td class="song-duration">${minutes_long}:${remaining_seconds}</td>
        </tr>`
    }
        document.getElementById('songs-body').innerHTML = html_songs
    }


    var html_playlist = `<div><h2>Playlists</h2><div>`
    for (const i of playlists.playlists) {

        html_playlist += `<a class="playlist-item" onclick="showPlaylistSongs(${i.id})">
        <img src="/images/Playboi-Carti.webp"/>
        <div class="playlist-item-info">
            <span class="playlist-item-title">${i.name}</span>
            <span class="playlist-item-subtitle">Playlist • Jonas</span>
        </div>
    </a>`


    }
document.getElementById('playlists').innerHTML = html_playlist




    async function getPlaylists() {
        const playlists_ = await fetch('http://localhost:3000/playlists')
        return await playlists_.json();
    }

    async function getSongsOfPlaylist(playlistId) {
        const songs = await fetch(`http://localhost:3000/playlists/${playlistId}/songs`)
        return await songs.json();

    }

    window.playSong = async function(id, title, artist) {
        const audio = document.getElementById('audio-player')
        audio.src = `http://localhost:3000/stream/${id}`

        document.getElementById('player-cover').src = `http://localhost:3000/api/songs/cover/${id}`
        document.getElementById('player-title').innerHTML = `<span id="player-title" class="player-title">${title}</span>`
        document.getElementById('player-artist').innerHTML = `<span id="player-artist" class="player-artist">${artist}</span>`
        audio.play()
    }

    window.play_button = async function() {
        const audio = document.getElementById('audio-player')
        if (audio.paused) {
            audio.play()
            document.getElementById('play-btn').innerText = `⏸`


        } else {
            audio.pause()
            document.getElementById('play-btn').innerText = `▶`
        }

    }




