const newAlbum = document.getElementById("newAlbum");
const newArtist = document.getElementById("newArtist")
const key = "?key=flat_eric";

let hamburger = document.getElementById('hamburgerIcon');

const artistDiv = document.getElementById('artistsOutput');
const albumDiv = document.getElementById('albumsOutput');

function hideDivs(divsToHide){
    
    console.log(divsToHide);
    for(i = 0; i < divsToHide.length; i++){
        if(!divsToHide[i].classList.contains("hidden")){
            divsToHide[i].classList.add("hidden");
        }
    }
}

let divArray = [artistDiv, albumDiv];
//hideDivs(divArray);

let handleFormModule = (function(){
    return {
        handleForm: function(element){
            element.addEventListener("submit", function(event){
                event.preventDefault();
             });
        }
    }
}());


handleFormModule.handleForm(newAlbum);

handleFormModule.handleForm(newArtist);


function addNewAlbum(){
    const newAlbumTitle = document.getElementById("newAlbumTitle")
    const newAlbumArtists = document.getElementById("newAlbumArtists")
    const newAlbumSubmit = document.getElementById("newAlbumSubmit")

    newAlbumSubmit.addEventListener('click', function(){
        const albumTitleValue = newAlbumTitle.value;
        const albumArtistsValue = newAlbumArtists.value;

        let album = {
            title: albumTitleValue,
            artists: albumArtistsValue
        }
        
        if(albumTitleValue === "" || albumArtistsValue === ""){
            errorMessageEmptyInputfield();
        }else{
            fetch('https://folksa.ga/api/albums' + key,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(album)
        })
        .then((response) => response.json())
        .then((album) => {
            console.log(album);
        });
    }})
}

function errorMessageEmptyInputfield(){
    console.log("Please make sure all required fields are filled out correctly")
}

addNewAlbum();

function addNewArtist(){
    const newArtistName = document.getElementById("newArtistName")
    const newArtistBirthday = document.getElementById("newArtistBirthday")
    const newArtistGenres = document.getElementById("newArtistGenres")
    const newArtistGender = document.getElementById("newArtistGender")
    const newArtistCoverImage = document.getElementById("newArtistCoverImage")
    const newArtistSubmit = document.getElementById("newArtistSubmit")
    const newArtistCountryBorn = document.getElementById("newArtistCountryBorn")
    const newArtistSpotifyURL = document.getElementById("newArtistSpotifyURL")

    newArtistSubmit.addEventListener('click', function(){
        const artistNameValue = newArtistName.value;
        const artistBirthdayValue = newArtistBirthday.value;
        const artistGenresValue = newArtistGenres.value;
        const artistGenderValue = newArtistGender.value;
        const artistCountryBornValue = newArtistCountryBorn.value;
        const artistSpotifyURLValue = newArtistSpotifyURL.value;
        const artistCoverImageValue = newArtistCoverImage.value;

        let artist = {
            name: artistNameValue,
            born: artistBirthdayValue,
            genres: artistGenresValue,
            gender: artistGenderValue,
            countryBorn: artistCountryBornValue,
            spotifyURL: artistSpotifyURLValue,
            coverImage: artistCoverImageValue
        }

        fetch('https://folksa.ga/api/artists' + key,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(artist)
        })
            .then((response) => response.json())
            .then((artist) => {
                console.log(artist);
                if(artist.new == false){
                    console.log("Artist already exists");
                }
            });
    })
}

addNewArtist();

/*---------- * DISPLAY * ----------*/

/*----- artists -----*/

class ArtistController {
    constructor(baseUrl){
        this.baseUrl = baseUrl;
    }

    getAll(){
        return fetch(this.baseUrl + key)
        .then((response) => response.json())
    }

    getOne(id){
        return fetch(`${this.baseUrl}/${id}${key}`)
        .then((response) => response.json())
    }
    deleteOne(id){

    }
}

let Artist = new ArtistController('https://folksa.ga/api/artists' + key + '&limit=6');

Artist.getAll()
.then((artists) => {
    console.log(artists);
    artistDisplayModule.displayArtist(artists);
});

let artistDisplayModule = (function(){
    return {
        displayArtist: function(artists){
        
            for(let i in artists){
                let artistInfo = ``;
                artistInfo += `<div class="artist-wrapper">
                 <div class="cover-image">`;
                if (artists[i].coverImage === "" || artists[i].coverImage === undefined) {
                     artistInfo += `<img src="images/default_album4.png">`;
                 } else {
                     artistInfo += `<img src="${artists[i].coverImage}">`;
                 }
                artistInfo += `</div><div class="artist-name"><h4>${artists[i].name}</h4></div>
                </div>`;
                artistDiv.innerHTML += artistInfo;
            }
        }
    }
}()); 

/*----- tracks -----*/

class TrackController {
    constructor(baseUrl){
        this.baseUrl = baseUrl;
    }

    getAll(){
        return fetch(this.baseUrl + key)
        .then((response) => response.json())
    }

    getOne(id){
        return fetch(`${this.baseUrl}/${id}${key}`)
        .then((response) => response.json())
    }
    deleteOne(id){

    }
}

let Track = new TrackController('https://folksa.ga/api/tracks');

Track.getAll()
.then((tracks) => {
    console.log(tracks);
    trackDisplayModule.displayTracks(tracks);
});

let trackDisplayModule = (function(){
    const trackDiv = document.getElementById('tracksOutput');
    return {
        displayTracks: function(tracks){
        
            for(let i in tracks){
                let trackInfo = ``;
                trackInfo += `<div class="track-wrapper">
                 <div class="cover-image">`;
                if (tracks[i].coverImage === "" || tracks[i].coverImage === undefined) {
                     trackInfo += `<img src="images/default_album.png">`;
                 } else {
                     trackInfo += `<img src="${tracks[i].coverImage}">`;
                 }
                trackInfo += `<div class="track-name"><h4>${tracks[i].title}</h4></div>
                <div class="track-genre"><h5>${tracks[i].genres}</h5></div>
                </div></div>`;
                trackDiv.innerHTML += trackInfo;
            }
        }
    }
}()); 

/*----- albums -----*/

class AlbumController {
    constructor(baseUrl){
        this.baseUrl = baseUrl;
    }

    getAll(){
        return fetch(this.baseUrl + key + '&populateArtists=true')
        .then((response) => response.json())
    }

    getOne(id){
        console.log(`${this.baseUrl}/${id}${key}`);
        return fetch(`${this.baseUrl}/${id}${key}`)
        .then((response) => response.json())
    }
}

let Album = new AlbumController('https://folksa.ga/api/albums' + key + '&limit=8');

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
    const individualAlbumsDiv = document.getElementById('individualAlbums');
    return {
        displayAlbums: function(albums){
        
            for(let i in albums){

                let albumInfo = ``;
                albumInfo += `<div class="album-wrapper">
                <h4>${albums[i].title}</h4>
                <div class="cover-image">`;
                if (albums[i].coverImage === "" || albums[i].coverImage == undefined) {
                    albumInfo += `<img src="images/default_album.png">`;
                } else {
                    albumInfo += `<img src="${albums[i].coverImage}">`;
                }
               
                albumInfo += `<h5>${albums[i].artists[0].name}</h5>`;
                albumInfo += `</div><button data-id="${albums[i]._id}">${albums[i].title}</button>
                
                </div>`;

                albumDiv.innerHTML += albumInfo;
            }
            eventController.bindEventListener(albumDiv);
        },
        displayIndividualAlbum: function(album){
            console.log(albumDiv);
            albumDiv.classList.add('hidden');
            let albumInfo = ``;
            albumInfo += `<div class="individual-wrapper">
            <h4>${album.title}</h4>
            <div class="cover-image">`;
            if (album.coverImage === "" || album.coverImage == undefined) {
                albumInfo += `<img src="images/default_album.png">`;
            } else {
                albumInfo += `<img src="${album.coverImage}">`;
            }
            albumInfo += `</div>`;

            for(let i in album.tracks){
                albumInfo += `<li>${album.tracks[i].title}</li>`;

                console.log(album.tracks[i].title);
            }
            albumInfo += `</div>`;
            individualAlbumsDiv.innerHTML += albumInfo;
        },
        bindEventListener: function(){
            let albumButtons = albumDiv.querySelectorAll('button');

            for(let albumButton of albumButtons){
                let albumID = albumButton.dataset.id;
                
                albumButton.addEventListener('click', function(){
                    Album.getOne(albumID)
                    .then((album) => {
                    displayModule.displayIndividualAlbum(album);
                    })
                });
            }
            
        }
    }
}());

let eventController = (function(){
    return {
        bindEventListener: function(albumDiv){
            let albumButtons = albumDiv.querySelectorAll('button');

            for(let albumButton of albumButtons){
                let albumID = albumButton.dataset.id;
                
                albumButton.addEventListener('click', function(){
                    Album.getOne(albumID)
                    .then((album) => {
                    displayModule.displayIndividualAlbum(album);
                    })
                });
            }
        }
    }
}());


/*----- playlists -----*/

class PlaylistController {
    constructor(baseUrl){
        this.baseUrl = baseUrl;
    }

    getAll(){
        return fetch(this.baseUrl + key)
        .then((response) => response.json())
    }

    getOne(id){
        return fetch(`${this.baseUrl}/${id}${key}`)
        .then((response) => response.json())
    }
    deleteOne(id){

    }
}

let Playlist = new PlaylistController('https://folksa.ga/api/playlists' + key + '&limit=8');

Playlist.getAll()
.then((playlists) => {
    console.log(playlists);
    playlistDisplayModule.displayPlaylists(playlists);
});

let playlistDisplayModule = (function(){
    const playlistDiv = document.getElementById('playlistsOutput');
    return {
        displayPlaylists: function(playlists){
        
            for(let i in playlists){
                let playlistInfo = ``;
                playlistInfo += `<div class="playlist-wrapper">
                 <div class="cover-image">`;
                if (playlists[i].coverImage === "" || playlists[i].coverImage === undefined) {
                     playlistInfo += `<img src="images/default_album.png">`;
                 } else {
                     playlistInfo += `<img src="${playlists[i].coverImage}">`;
                 }
                playlistInfo += `<div class="playlist-name"><h4>${playlists[i].title}</h4></div>
                <div class="playlist-creator"><h5>${playlists[i].createdBy}</h5></div>
                </div></div>`;
                playlistDiv.innerHTML += playlistInfo;
            }
        }
    }
}()); 