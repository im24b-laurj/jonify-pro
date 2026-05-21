const playlists = await getPlaylists()

window.showPlaylistSongs = async function(id) {
    html_songs = `<div><h2>Songs</h2><div>`
    var songs = await getSongsOfPlaylist(id)
    console.log(songs)

    for (const i of songs.songs) {html_songs += `<div class="playlist-item">${i.title}</div>`}document.getElementById('maincontih').innerHTML = html_songs}
    var index = 0
    for (const i of songs.songs) {
        index += 1
        html_songs += `<tr>
            <td class="song-number">${index}</td>
            <td>
                <div class="song-title-cell">
                    <img class="song-cover" src="..."/>
                    <div>
                        <div class="song-title">Song Title</div>
                        <div class="song-artist">Artist</div>
                    </div>
                </div>
            </td>
            <td>Album</td>
            <td>Date</td>
            <td class="song-duration">3:45</td>
        </tr>`
    }
var html_songs = `<div><h2>Songs</h2><div>`
var html_playlist = `<div><h2>Playlists</h2><div>`
for (const i of playlists.playlists) {
    var id = i.id
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
