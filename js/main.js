const newAlbum = document.getElementById("newAlbum");
const newArtist = document.getElementById("newArtist")
const key = "?key=flat_eric";

let hamburger = document.getElementById('hamburgerIcon');

const artistDiv = document.getElementById('artistsWrapper');
const albumDiv = document.getElementById('albumsWrapper');
const trackDiv = document.getElementById('tracksWrapper');
const playlistDiv = document.getElementById('playlistsWrapper');
const formDiv = document.getElementById('formWrapper'); 
const individualAlbumsDiv = document.getElementById('individualAlbums');
const individualArtistsDiv = document.getElementById('individualArtists');

function hideDivs(divsToHide){
    
    for(i = 0; i < divsToHide.length; i++){
        if(!divsToHide[i].classList.contains("hidden")){
            divsToHide[i].classList.add("hidden");
        }
    }
}

function showDivs(divsToShow){
    
    for(i = 0; i < divsToShow.length; i++){
        if(divsToShow[i].classList.contains("hidden")){
            divsToShow[i].classList.remove("hidden");
        }
    }
}

let eventController = (function(){
    let addPlaylistButton = document.getElementById('newPlaylist');
  
    return {
        bindEventListener: function(albumDiv){
            let albumImages = albumDiv.querySelectorAll('img');

            for(let albumImage of albumImages){
                let albumID = albumImage.dataset.id;
                
                albumImage.addEventListener('click', function(){
                    Album.getOne(albumID)
                    .then((album) => {
                    displayModule.displayIndividualAlbum(album);
                    })
                });
            }
        },
        toggleDivs: function(element, divToShow){
            element.addEventListener('click', function(){
               toggleDiv(divToShow);
            });
        },
        addPlaylist: function(){
            let playlistForm = document.getElementById('newPlaylistForm');
            handleFormModule.handleForm(playlistForm);
            addPlaylistButton.addEventListener('click', function(){
                let playlistTitle = document.getElementById('newPlaylistName').value;
                let playlistGenres = document.getElementById('newPlaylistGenres').value;
                let playlistImage = document.getElementById('newPlaylistImage').value;

                let newPlaylist = new Playlist(playlistTitle, playlistGenres, playlistImage);
                newPlaylist.addNew();
             });
        }
    }
}());


function toggleDiv(divToShow){
    divToShow.classList.remove("hidden");
    let divs = [trackDiv, artistDiv, albumDiv, playlistDiv, 
        individualAlbumsDiv, formDiv, individualArtistsDiv];

   
    
    //Filter out the div that will be shown
    const divsToHide = divs.filter(div => div != divToShow);
    //Hide all the other divs
    for(let divToHide of divsToHide){

        if(!divToHide.classList.contains("hidden")){
            divToHide.classList.add("hidden");
        }
    }
    
}

//toggleDiv(albumDiv);

const addNewButton = document.getElementById('addNew');
eventController.toggleDivs(addNewButton, formDiv);

const homeLink = document.getElementById('homeLink');
eventController.toggleDivs(homeLink, albumDiv);

const artistsLink = document.getElementById('artistsLink');
eventController.toggleDivs(artistsLink, artistDiv);

const tracksLink = document.getElementById('tracksLink');
eventController.toggleDivs(tracksLink, trackDiv);

const albumsLink = document.getElementById('albumsLink');
eventController.toggleDivs(albumsLink, albumDiv)

const playlistsLink = document.getElementById('playlistsLink');
eventController.toggleDivs(playlistsLink, playlistDiv);

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
   

    const newAlbumSubmit = document.getElementById("newAlbumSubmit");

    newAlbumSubmit.addEventListener('click', function(){
        const albumTitleValue = document.getElementById("newAlbumTitle").value;
        const albumArtistsValue = document.getElementById("newAlbumArtists").value;
        const albumGenresValue = document.getElementById("newAlbumGenres").value;
        const albumReleaseDateValue = document.getElementById("releaseDate").value;
        const albumSpotifyURL = document.getElementById("newAlbumSpotifyURL").value;
        const albumCoverImage = document.getElementById("newAlbumCover").value; 

        let album = {
            title: albumTitleValue,
            artists: albumArtistsValue,
            releaseDate: albumReleaseDateValue,
            genres: albumGenresValue,
            spotifyURL: albumSpotifyURL,
            coverImage: albumCoverImage
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
    const artistNameValue = document.getElementById("newArtistName").value;
    const artistBirthdayValue = document.getElementById("newArtistBirthday").value;
    const artistGenresValue = document.getElementById("newArtistGenres").value;
    const artistGenderValue = document.getElementById("newArtistGender").value;
    const artistCoverImageValue = document.getElementById("newArtistCoverImage").value;
    const artistCountryBornValue = document.getElementById("newArtistCountryBorn").value;
    const artistSpotifyURLValue = document.getElementById("newArtistSpotifyURL").value;
    const newArtistSubmit = document.getElementById("newArtistSubmit")

    newArtistSubmit.addEventListener('click', function(){
    
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
        return fetch(this.baseUrl + key + '&sort=desc&limit=9')
        .then((response) => response.json())
    }

    getOne(id){
        return fetch(`${this.baseUrl}/${id}${key}`)
        .then((response) => response.json())
    }
    deleteOne(id){
        fetch(`${this.baseUrl}/${id}${key}`, {
            method: 'DELETE',
            headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
          .then((response) => response.json())
          .then((artist) => {
            console.log(artist);
          });
    }
}

let Artist = new ArtistController('https://folksa.ga/api/artists');

Artist.getAll()
.then((artists) => {
    console.log(artists);
    artistDisplayModule.displayArtists(artists);
});

let artistDisplayModule = (function(){
    const artistsOutput = document.getElementById('artistsOutput');
    return {
        displayArtists: function(artists){
        
            for(let i in artists){
                let artistInfo = ``;
                artistInfo += `<div class="artist-wrapper">
                 <div class="cover-image">`;
                if (artists[i].coverImage === "" || artists[i].coverImage === undefined) {
                     artistInfo += `<img src="images/default_album4.png" data-id="${artists[i]._id}">`;
                 } else {
                     artistInfo += `<img src="${artists[i].coverImage}" data-id="${artists[i]._id}">`;
                 }
                artistInfo += `</div><div class="artist-name"><h4>${artists[i].name}</h4></div>
                </div>`;
                artistsOutput.innerHTML += artistInfo;
            }

            let artistImages = artistsOutput.querySelectorAll('img');

            for(let artistImage of artistImages){
                let artistID = artistImage.dataset.id;
                
                artistImage.addEventListener('click', function(){
                    Artist.getOne(artistID)
                    .then((artist) => {
                    artistDisplayModule.displayIndividualArtist(artist);
                    })
                });
            }
            
        },
        displayIndividualArtist: function(artist){
            console.log(artist);
            hideDivs([trackDiv, artistDiv,  playlistDiv, albumDiv, formDiv]);
            showDivs([individualArtistsDiv]);
            individualArtistsDiv.innerHTML = "";
            let artistInfo = ``;
            artistInfo += `<div class="individual-wrapper">
            <div class="cover-image">`;

            if (artist.coverImage === "" || artist.coverImage == undefined) {
                artistInfo += `<img src="images/default_album.png">`;
            } else {
                artistInfo += `<img src="${artist.coverImage}">`;
            }

            artistInfo += `<h4>${artist.name}</h4>
            <button data-id="${artist._id}">Delete Artist</button>
            </div>`;

            artistInfo += `</div>`;
            individualArtistsDiv.innerHTML += artistInfo;

            let individualArtistButton = individualArtistsDiv.querySelector('button');

            individualArtistButton.addEventListener('click', function(){
                let artistID = individualArtistButton.dataset.id;
                Artist.deleteOne(artistID);
                location.reload();
            })
        }
    }
}()); 

/*----- tracks -----*/

class TrackController {
    constructor(baseUrl){
        this.baseUrl = baseUrl;
    }

    getAll(){
        return fetch(this.baseUrl + key + '&sort=desc')
        .then((response) => response.json())
    }

    getOne(id){
        return fetch(`${this.baseUrl}/${id}${key}`)
        .then((response) => response.json())
    }
    deleteOne(id){
        fetch(`https://folksa.ga/api/tracks/${id}${key}`,
        {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        .then((response) => response.json())
        .then((track) => {
            console.log(track);
        });

    }
}

let Tracks = new TrackController('https://folksa.ga/api/tracks');

Tracks.getAll()
.then((tracks) => {
    console.log(tracks);
    Playlists.getAll()
    .then((playlists) => {
        trackDisplayModule.displayTracks(tracks, playlists);
    })
  
});

let trackDisplayModule = (function(){
    const tracksOutput = document.getElementById('tracksOutput');
    return {
        displayTracks: function(tracks, playlists){
            console.log(tracks);
            console.log(playlists);
        
            for(let i in tracks){
                if(tracks[i].artists.length > 0){
                    let trackInfo = ``;
                    trackInfo += `
                    <div class="track-wrapper">
                        <div class="cover-image">`;
                            if (tracks[i].coverImage === "" || tracks[i].coverImage === undefined) {
                                trackInfo += `<img src="images/default_album.png">`;
                            } else {
                                trackInfo += `<img src="${tracks[i].coverImage}">`;
                            }
                            trackInfo += `
                        </div>
                        <div class="track-info-wrapper">
                            <div class="track-name"><h4>${tracks[i].title}</h4></div>
                            <div class="track-genre"><h4> - ${tracks[i].artists[0].name}</h4></div>
                        </div>
                        <div class="add-to-playlist">
                            <div class="playlistDropdown">`;
                            
                            for(let j in playlists){
                                trackInfo += `<ul><li>${playlists[j].title}</li></ul>`;
                            }
                           
                            trackInfo +=  `</div>
                        <button>Add</button>
                        </div>
                    </div>`;
                    tracksOutput.innerHTML += trackInfo;

                }
                
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
        return fetch(this.baseUrl + key + '&populateArtists=true&limit=20&sort=desc')
        .then((response) => response.json())
    }

    getOne(id){
        console.log(`${this.baseUrl}/${id}${key}`);
        return fetch(`${this.baseUrl}/${id}${key}`)
        .then((response) => response.json())
    }

    deleteOne(id){
        fetch(`${this.baseUrl}/${id}${key}`,{
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        .then((response) => response.json())
        .then((album) => {
            console.log(album);
        });
    }
}

class Track{

    constructor(title, albumID, artistID){
        this.title = title;
        this.album = albumID;
        this.artists = artistID;
    }

    addNew(){
        console.log(this);
        
        fetch('https://folksa.ga/api/tracks'+ key,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this)
          })
          .then((response) => response.json())
          .then((postedTrack) => {
            console.log(postedTrack);
          });
    }

}

let Album = new AlbumController('https://folksa.ga/api/albums');

Album.getAll()
.then((albums) => {
    console.log(albums);
    displayModule.displayAlbums(albums);
});


let displayModule = (function(){
   const albumsOutput = document.getElementById('albumsOutput');
    return {
        displayAlbums: function(albums){
        
            for(let i in albums){
                //if(albums[i].artists[0].name !== undefined){

                    let albumInfo = ``;
                    albumInfo += `<div class="album-wrapper">
                    
                    <div class="cover-image" >`;
                    if (albums[i].coverImage === "" || albums[i].coverImage == undefined) {
                        albumInfo += `<img src="images/default_album.png" data-id="${albums[i]._id}">`;
                    } else {
                        albumInfo += `<img src="${albums[i].coverImage}" data-id="${albums[i]._id}">`;
                    }

                    albumInfo += `</div>`;
                    
                    albumInfo += `
                    <h4>${albums[i].title}</h4>
                    <h5></h5>`;
                    
                    albumInfo += `</div>`;
                    //by ${albums[i].artists[0].name}

                    albumsOutput.innerHTML += albumInfo;
                }
            //}
            eventController.bindEventListener(albumsOutput);
        },
        displayIndividualAlbum: function(album){
            toggleDiv(individualAlbumsDiv);
            individualAlbumsDiv.innerHTML = "";
            let albumInfo = ``;
            albumInfo += `<div class="individual-wrapper">
            <div class="individual-flex-wrapper">
            <div class="cover-image">`;
            if (album.coverImage === "" || album.coverImage == undefined) {
                albumInfo += `<img src="images/default_album.png">`;
            } else {
                albumInfo += `<img src="${album.coverImage}">`;
            }
            albumInfo +=
            `</div>
                <div class="album-info">
                    <h4>${album.title}</h4>
                    <h5>by ${album.artists[0].name}</h5>
                </div> 
            </div>

            <div class="add-track-form">
                <form id="addTrackForm">
                <label for="trackTitle">Track Title</label>
                <input type="text" id="trackTitle">
                <button id="addTrack" data-id="${album._id}" data-artistid="${album.artists[0]._id}">Add Track</button>
                </form>
            </div>`;

            albumInfo +=`
            <div class="album-tracks" id="albumTracks">`;
                for (let i=0; i < album.tracks.length; i++) {
                    albumInfo += `<ul><li>${album.tracks[i].title}
                    <button id="deleteTrack" data-id="${album.tracks[i]._id}">delete track</button>
                    </li></ul>`;
                }
            albumInfo += `</div>`;
            albumInfo += `<div class="album-delete-button">
            <button data-id="${album._id}" id="deleteAlbum">Delete Album</button>
            </div>
            </div>`;
            individualAlbumsDiv.innerHTML += albumInfo;

            let newTrackForm = document.getElementById('addTrackForm');
            handleFormModule.handleForm(newTrackForm);

            let deleteAlbumButton = document.getElementById('deleteAlbum');

            deleteAlbumButton.addEventListener('click', function(){
                let albumID = deleteAlbumButton.dataset.id;
                Album.deleteOne(albumID);
                //location.reload();
            })

            let addTrackButton = document.getElementById('addTrack');

            addTrackButton.addEventListener('click', function(){
                let albumID = addTrackButton.dataset.id;
                let artistID = addTrackButton.dataset.artistid;
                let trackTitle = document.getElementById('trackTitle').value;

                let newTrack = new Track(trackTitle, albumID, artistID);
                
                newTrack.addNew();
            })

            let albumTracksDiv = document.getElementById('albumTracks');
            let deleteTrackButtons = albumTracksDiv.querySelectorAll('button');
            for(let deleteTrackButton of deleteTrackButtons){
                deleteTrackButton.addEventListener('click', function(){
                    let trackID = this.dataset.id;
                    Tracks.deleteOne(trackID);
                })
            }
        },
        bindEventListener: function(){
            let albumImages = albumDiv.querySelectorAll('img');

            for(let albumImage of albumImages){
                let albumID = albumImages.dataset.id;
                
                albumImage.addEventListener('click', function(){
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
        return fetch(this.baseUrl + key + '&createdBy=Power Puff Pinglorna')
        .then((response) => response.json())
    }

    getOne(id){
        return fetch(`${this.baseUrl}/${id}${key}`)
        .then((response) => response.json())
    }
    deleteOne(id){

    }
}

class Playlist{

    constructor(title, genres, coverImage){
        this.title = title;
        this.genres = genres;
        this.coverImage = coverImage;
        this.createdBy = "Power Puff Pinglorna";
    }

    addNew(){
        console.log(this);
        
        fetch('https://folksa.ga/api/playlists' + key,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this)
        })
        .then((response) => response.json())
        .then((playlist) => {
            console.log(playlist);
        });
    }
}

let Playlists = new PlaylistController('https://folksa.ga/api/playlists' + key + '&limit=8');

Playlists.getAll()
.then((playlists) => {
    console.log(playlists);
    playlistDisplayModule.displayPlaylists(playlists);
});

let playlistDisplayModule = (function(){
  const playlistOutput = document.getElementById('playlistsOutput');
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
                playlistOutput.innerHTML += playlistInfo;
            }
        }
    }
}()); 

eventController.addPlaylist();