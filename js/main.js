
const newAlbum = document.getElementById("newAlbum");

newAlbum.addEventListener("submit", function(event){
    event.preventDefault();
 });


function addNewAlbum(){
    const newAlbumTitle = document.getElementById("newAlbumTitle")
    const newAlbumArtists = document.getElementById("newAlbumArtists")
    const newAlbumSubmit = document.getElementById("newAlbumSubmit")

    newAlbumSubmit.addEventListener('click', function(){
        let albumTitleValue = newAlbumTitle.value;
        let albumArtistsValue = newAlbumArtists.value;
        
        if(albumTitleValue === "" || albumArtistsValue === ""){
            console.log("NEJJJ")
        }else{
        console.log(albumArtistsValue);
        console.log(albumTitleValue);
    }})
}

addNewAlbum();

const key = "key=flat_eric";

class ArtistController {
    constructor(baseUrl){
        this.baseUrl = baseUrl;
        this.key = '?key=flat_eric';
    }

    getAll(){
        return fetch(this.baseUrl + this.key)
        .then((response) => response.json())
    }
    getOne(id){
        return fetch(`${this.baseUrl}/${id}${this.key}`)
        .then((response) => response.json())
    }
    deleteOne(id){

    }
}

let Artist = new ArtistController('https://folksa.ga/api/artists');
/*Artist.getAll()
.then((data) => console.log(data));

Artist.getOne('5aae2d13b9791d0344d8f717')
.then((data) => console.log(data.name));*/

class AlbumController {
    constructor(baseUrl){
        this.baseUrl = baseUrl;
    }

    getAll(){
        return fetch(this.baseUrl + this.key)
        .then((response) => response.json())
    }

    getOne(id){
        return fetch(`${this.baseUrl}/${id}${this.key}`)
        .then((response) => response.json())
    }
}

let Album = new AlbumController('https://folksa.ga/api/albums?' + key + '&limit=9');


//Album.getOne('5abe82c8f6e25413a2407fe2')
//.then((data) => console.log(data));

Album.getAll()
.then((albums) => {
    console.log(albums);
    displayModule.displayAlbums(albums);
});

class displayAlbums{
    constructor(title, id, artists){
        this.title = title;
        this.id = id;
        this.artists = artists;
    }

    displayOne(){
        console.log(this.title);
    }
}

let displayModule = (function(){
    const albumDiv = document.getElementById('albumsOutput');
    return {
        displayAlbums: function(albums){
        
            for(let i in albums){

                let albumInfo = ``;
                albumInfo += `<div class="album-wrapper">
                <h4>${albums[i].title}</h4>
                <div class="cover-image">`;
                if (albums[i].coverImage === "") {
                    albumInfo += `<img src="images/default_album.png"><br/>`;
                } else {
                    albumInfo += `<img src="${albums[i].coverImage}"><br/>`;
                }
               
                albumInfo += `</div><button data-id="${albums[i]._id}">${albums[i].title}</button>
                
                </div>`;

                albumDiv.innerHTML += albumInfo;
            }

        }
    }
}());


/*--- Emmelie Testing ---*/
class PlaylistController {
    constructor(baseUrl){
        this.baseUrl = baseUrl;
        this.key = key; 
    }

    getAll(){
        return fetch(this.baseUrl + this.key)
        .then((response) => response.json())
    }

    getOne(id){
        return fetch(`${this.baseUrl}/${id}${this.key}`)
        .then((response) => response.json())
    }
    deleteOne(id){

    }
}

let Playlist = new PlaylistController('https://folksa.ga/api/playlists?' + key + '&limit=9');

Playlist.getAll()
.then((playlists) => {
    console.log(playlists);
    playlistDisplayModule.displayPlaylists(playlists);
});

class displayPlaylists{
    constructor(title, id, artists){
        this.id = id;
        this.title = title; 
        this.artists = artists;
        this.tracks = tracks;
    }

    displayOne(){
        console.log(this.title);
    }
}

let playlistDisplayModule = (function(){
    const playlistDiv = document.getElementById('playlistsOutput');
    return {
        displayPlaylists: function(playlists){
        
            for(let i in playlists){

                let playlistInfo = ``;
                playlistInfo += `<div class="playlist-wrapper">
                <h4>${playlists[i].title}</h4>
                <div class="cover-image-playlist">`;
                if (playlists[i].coverImage === "") {
                    playlistInfo += `<img src="images/default_album.png"><br/>`;
                } else {
                    playlistInfo += `<img src="${playlists[i].coverImage}"><br/>`;
                }
               
                playlistInfo += `</div><button data-id="${playlists[i]._id}">${playlists[i].title}</button>
                
                </div>`;

                playlistDiv.innerHTML += playlistInfo;
            }
        }
    }
}());
