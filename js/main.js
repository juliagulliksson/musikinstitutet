const key = "?key=flat_eric";

const hamburgerMenu = document.getElementById('hamburgerIcon');
const outputDiv = document.getElementById('output');

/*** Classes ***/

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
        return fetch(`${this.baseUrl}/${id}${key}`, {
            method: 'DELETE',
            headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
          .then((response) => response.json())
    }
}

class Artist {
    constructor(artistName, birthday, genres, gender, countryBorn, spotifyURL, coverImage){
        this.name = artistName;
        this.born = birthday;
        this.genres = genres;
        this.gender = gender;
        this.countryBorn = countryBorn;
        this.spotifyURL = spotifyURL;
        this.coverImage = coverImage;
    }

    addNew(){

        return fetch('https://folksa.ga/api/artists' + key,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this)
        })
            .then((response) => response.json())
            
    }
}

class AlbumController {
    constructor(baseUrl){
        this.baseUrl = baseUrl;
    }

    getAll(){
        return fetch(this.baseUrl + key + '&populateArtists=true&limit=20&sort=desc')
        .then((response) => response.json())
    }

    getOne(id){
        return fetch(`${this.baseUrl}/${id}${key}`)
        .then((response) => response.json())
    }

    deleteOne(id){
        return fetch(`${this.baseUrl}/${id}${key}`,{
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        .then((response) => response.json())
    }

    searchByTitle(title){
        fetch('https://folksa.ga/api/albums' + key + '&title=' + title)
        .then((response) => response.json())
        .then((albums) => {
            console.log(albums);
        });
    }
}

class Album {
    constructor(title, artists, releaseDate, genres, spotifyURL, coverImage){
        this.title = title;
        this.artists = artists;
        this.releaseDate = releaseDate;
        this.genres = genres;
        this.spotifyURL = spotifyURL;
        this.coverImage = coverImage;
    }

    addNew(){
        return fetch('https://folksa.ga/api/albums' + key,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this)
        })
        .then((response) => response.json())
    }
}

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
        return fetch(`https://folksa.ga/api/tracks/${id}${key}`,
        {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        .then((response) => response.json())
    }
}

class Track {

    constructor(title, albumID, artistID){
        this.title = title;
        this.album = albumID;
        this.artists = artistID;
    }

    addNew(){
        return fetch('https://folksa.ga/api/tracks'+ key,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this)
          })
          .then((response) => response.json())
    }
}

class PlaylistController {
    constructor(baseUrl){
        this.baseUrl = baseUrl;
    }

    getAll(){
        return fetch(`${this.baseUrl}${key}&createdBy=Power Puff Pinglorna`)
        .then((response) => response.json())
    }

    getOne(id){
        return fetch(`${this.baseUrl}/${id}${key}`)
        .then((response) => response.json())
    }
    deleteOne(id){

    }

    addTrack(playlistID, trackID){

        return fetch(`https://folksa.ga/api/playlists/${playlistID}/tracks${key}`,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tracks: trackID })
        })
        .then((response) => response.json())
    }
}

class Playlist {

    constructor(title, genres, coverImage){
        this.title = title;
        this.genres = genres;
        this.coverImage = coverImage;
        this.createdBy = "Power Puff Pinglorna";
    }

    addNew(){
        console.log(this);
        
        return fetch('https://folksa.ga/api/playlists' + key,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this)
        })
        .then((response) => response.json())
    }
}

let Albums = new AlbumController('https://folksa.ga/api/albums');

let Artists = new ArtistController('https://folksa.ga/api/artists');

let Tracks = new TrackController('https://folksa.ga/api/tracks');

let Playlists = new PlaylistController('https://folksa.ga/api/playlists' + key + '&limit=8');


let displayModule = (function(){
    
    return {
        displayAlbums: function(albums){
            
            outputDiv.innerHTML = "";
            let albumInfo = ``;
            albumInfo += `<div class="albums-wrapper">`;
        
                for(let i in albums){
                    if(albums[i].artists.length > 0){

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
                    }
                }
            albumInfo += `</div>`;
            outputDiv.innerHTML += albumInfo;
            bindEvents.bindAlbumPageEventListeners();
            //eventController.bindEventListener(outputDiv);
        },
        displayIndividualAlbum: function(album){
          
            outputDiv.innerHTML = "";
            let albumInfo = ``;
            albumInfo += 
            `<div class="individual-albums-wrapper">
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
            outputDiv.innerHTML += albumInfo;

            bindEvents.bindIndividualAlbumPageEventListeners();
        },
        bindEventListener: function(){
            let albumImages = albumDiv.querySelectorAll('img');

            for(let albumImage of albumImages){
                let albumID = albumImages.dataset.id;
                
                albumImage.addEventListener('click', function(){
                    Albums.getOne(albumID)
                    .then((album) => {
                    displayModule.displayIndividualAlbum(album);
                    })
                });
            }
            
        },
        displayForms: function(){
            outputDiv.innerHTML = "";
            let formsOutput = ``;
            formsOutput += 
            `<div class="form-wrapper" id="formWrapper">

              <div class="artist-form-wrapper" id="artistFormWrapper">
                <h2>Add New Artist</h2>
                <form id="newArtist">
                    Name<br>
                    <input type="text" id="newArtistName" name="name"><br>

                    Born<br>
                    <input type="date" id="newArtistBirthday" name="born"><br>

                    Genres<br>
                    <input type="text" id="newArtistGenres" name="genres" placeholder="Separate genre with comma"><br>

                    Gender<br>
                    <input type="text" id="newArtistGender" name="gender" placeholder="male, female or other"><br>

                    Country<br>
                    <input type="text" id="newArtistCountryBorn" name="countryBorn"><br>

                    Link to Spotify<br>
                    <input type="text" id="newArtistSpotifyURL" name="spotifyURL"><br>
                
                    Image<br>
                    <input type="text" id="newArtistCoverImage" name="coverImage"><br>
                    <input type="submit" id="newArtistSubmit" value="Save">
                </form>
              </div>

              <div class="album-form-wrapper " id="albumFormWrapper">
                <h2>Add New Album</h2>
                <form id="newAlbum">
                    <label for="newAlbumTitle">Title</label>
                    <input type="text" id="newAlbumTitle"><br>

                    <label for="newAlbumArtists">Artists</label>
                    <input type="text" id="newAlbumArtists"><br>

                    <label for="newAlbumGenres">Genres</label>
                    <input type="text" id="newAlbumGenres">

                    <label for="releaseDate">Release Date</label>
                    <input type="text" id="releaseDate" placeholder="YYYY">

                    <label for="newAlbumSpotifyURL">Link to Spotify</label>
                    <input type="text" id="newAlbumSpotifyURL">
                    
                    <label for="newAlbumCover">Cover Image</label>
                    <input type="text" id="newAlbumCover" placeholder="Link to image host">

                    <input type="submit" id="newAlbumSubmit" value="Save">
                </form>
              </div>

              <div class="playlist-form-wrapper" id="playlistFormWrapper">
                <h2>Add New Playlist</h2>
                <form id="newPlaylistForm">
                    <label for="newPlaylistName">Playlist Name</label>
                    <input type="text" id="newPlaylistName">

                    <label for="newPlaylistImage">Image Link</label>
                    <input type="text" id="newPlaylistImage">

                    <label for="newPlaylistGenres">Playlist Genres</label>
                    <input type="text" id="newPlaylistGenres" placeholder="Separate genre with comma">
                    <button id="newPlaylist">Save</button>
                </form>
              </div>
            </div>`;

            outputDiv.innerHTML += formsOutput;

            bindEvents.bindFormPageEventListeners();

        },
        displayPlaylists: function(playlists){
            outputDiv.innerHTML = "";
            let playlistInfo = ``;
            playlistInfo += `<div class="playlists-wrapper">`
        
            for(let i in playlists){
                playlistInfo += 
                `<div class="playlist-wrapper">
                    <div class="cover-image">`;
                        if (playlists[i].coverImage === "" || playlists[i].coverImage === undefined) {
                            playlistInfo += `<img src="images/default_album.png">`;
                        } else {
                            playlistInfo += `<img src="${playlists[i].coverImage}">`;
                        }
                    playlistInfo += `</div>
                    <div class="playlist-name"><h4>${playlists[i].title}</h4></div>
                    <div class="playlist-creator"><h5>${playlists[i].createdBy}</h5></div>
                    
                </div>
                
                <ul>`;
                for(let j in playlists[i].tracks){
                    playlistInfo += `<li>${playlists[i].tracks[j].title}</li>`
                }

                playlistInfo += `</ul>`;

            }
            playlistInfo += `</div>`;
            outputDiv.innerHTML += playlistInfo;
        },
        displayTracks: function(tracks, playlists){
            console.log(tracks);
            console.log(playlists);
            outputDiv.innerHTML = "";
            let trackInfo = ``;
            trackInfo += `<div class="tracks-wrapper">`;
        
            for(let i in tracks){
                if(tracks[i].artists.length > 0){

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
                            <button>Add To Playlist</button>
                            <div class="playlistDropdown hidden">
                            
                            <ul>`;
                            for(let j in playlists){
                                trackInfo += `
                                <li data-id="${playlists[j]._id}" data-trackid=${tracks[i]._id}>
                                ${playlists[j].title}
                                </li>`;
                            }
                           
                            trackInfo +=  `</ul>
                            </div>
                        </div>
                    </div>`;
                }
            }
            trackInfo += `</div>`;
            outputDiv.innerHTML += trackInfo;
            bindEvents.bindTrackPageEventListeners();
        },
        displayArtists: function(artists){
            outputDiv.innerHTML = "";

            let artistInfo = ``;
            artistInfo += `<div class="artists-wrapper">`;
        
            for(let i in artists){

                artistInfo += `
                <div class="artist-wrapper">
                 <div class="cover-image">`;
                if (artists[i].coverImage === "" || artists[i].coverImage === undefined) {
                     artistInfo += `<img src="images/default_album4.png" data-id="${artists[i]._id}">`;
                 } else {
                     artistInfo += `<img src="${artists[i].coverImage}" data-id="${artists[i]._id}">`;
                 }
                artistInfo += `</div><div class="artist-name"><h4>${artists[i].name}</h4></div>
                </div>`;
                
            }
            artistInfo += `</div>`;
            outputDiv.innerHTML += artistInfo;

            bindEvents.bindArtistPageEventListeners();
            
        },
        displayIndividualArtist: function(artist){
            console.log(artist);
            let artistInfo = ``;
            artistInfo += 
            `<div class="individual-wrapper">
                <div class="cover-image">`;

                    if (artist.coverImage === "" || artist.coverImage == undefined) {
                        artistInfo += `<img src="images/default_album.png">`;
                    } else {
                        artistInfo += `<img src="${artist.coverImage}">`;
                    }

                artistInfo += `</div>
                <h4>${artist.name}</h4>
                <button id="deleteArtist" data-id="${artist._id}">Delete Artist</button>

            </div>`;
            outputDiv.innerHTML = artistInfo;

            bindEvents.bindIndividualArtistPageEventListeners();
        }
    }
}());

let buttonEvents = (function(){

    return {
        getAlbums: function(){
            Albums.getAll()
            .then((albums) => {
              displayModule.displayAlbums(albums);
            });
        }, 
        getArtists: function(){
            Artists.getAll()
              .then((artists) => {
                  console.log(artists);
                displayModule.displayArtists(artists);
            });
        },
        getPlaylists: function(){
            Playlists.getAll()
              .then((playlists) => {
                console.log(playlists);
                displayModule.displayPlaylists(playlists);
            });
        },
        getTracksAndPlaylists: function(){
            Tracks.getAll()
            .then((tracks) => {
                Playlists.getAll()
                  .then((playlists) => {
                  displayModule.displayTracks(tracks, playlists);
                })
            });
        }, 
        addNewTrack: function(albumID, artistID){
            let trackTitle = document.getElementById('trackTitle').value;

            let newTrack = new Track(trackTitle, albumID, artistID);
            
            newTrack.addNew()
            .then((postedTrack) => {
                console.log(postedTrack);
            });
        },
        addNewPlaylist: function(){
            let playlistTitle = document.getElementById('newPlaylistName').value;
            let playlistGenres = document.getElementById('newPlaylistGenres').value;
            let playlistImage = document.getElementById('newPlaylistImage').value;

            let newPlaylist = new Playlist(playlistTitle, playlistGenres, playlistImage);

            newPlaylist.addNew()
            .then((playlist) => {
                console.log(playlist);
            });
        },
        addNewArtist: function(){
         
            const artistName = document.getElementById("newArtistName").value;
            const birthday = document.getElementById("newArtistBirthday").value;
            const genres = document.getElementById("newArtistGenres").value;
            const gender = document.getElementById("newArtistGender").value;
            const coverImage = document.getElementById("newArtistCoverImage").value;
            const countryBorn = document.getElementById("newArtistCountryBorn").value;
            const spotifyURL = document.getElementById("newArtistSpotifyURL").value;
    
    
            let newArtist = new Artist(artistName, birthday, genres, gender, countryBorn, spotifyURL, coverImage);
            
            newArtist.addNew()
            .then((artist) => {
                console.log(artist);
                if(artist.new == false){
                    console.log("Artist already exists");
                }
            });
        },
        addNewAlbum: function(){
            const title = document.getElementById("newAlbumTitle").value;
            const artists = document.getElementById("newAlbumArtists").value;
            const genres = document.getElementById("newAlbumGenres").value;
            const releaseDate = document.getElementById("releaseDate").value;
            const spotifyURL = document.getElementById("newAlbumSpotifyURL").value;
            const coverImage = document.getElementById("newAlbumCover").value; 
    
            let newAlbum = new Album(title, artists, releaseDate, genres, spotifyURL, coverImage);
        
            if(handleForms.validate([title, artists])){
                newAlbum.addNew()
                .then((album) => {
                    console.log(album);
                });
            }//else{
                //displayError();
            //}
        },
        getIndividualAlbum: function(albumID){
            Albums.getOne(albumID)
              .then((album) => {
                displayModule.displayIndividualAlbum(album);
              })
        },
        getIndividualArtist: function(artistID){
            Artists.getOne(artistID)
              .then((artist) => {
                displayModule.displayIndividualArtist(artist);
              })
        },
        deleteOneAlbum: function(albumID){
            Albums.deleteOne(albumID)
              .then((album) => {
                //buttonEvents.getAlbums();
                console.log(album);
              });
        },
        deleteOneTrack: function(trackID){
            Tracks.deleteOne(trackID)
              .then((track) => {
                console.log(track);
              });
        },
        deleteOneArtist: function(artistID){
            Artists.deleteOne(artistID)
            .then((artist) => {
                console.log(artist);
            });
        },
        addTrackToPlaylist: function(playlistID, trackID){
            Playlists.addTrack(playlistID, trackID)
              /*.then((playlist) => {
                console.log(playlist);
              });*/
        }
    }
}());

let bindEvents = (function(){
    const addNewButton = document.getElementById('addNew');
    const artistsLink = document.getElementById('artistsLink');
    const homeLink = document.getElementById('homeLink');
    const tracksLink = document.getElementById('tracksLink');
    const playlistsLink = document.getElementById('playlistsLink');
    const albumsLink = document.getElementById('albumsLink');

    return {
        bindHomePageEventListeners: function(){
            homeLink.addEventListener('click', buttonEvents.getAlbums);
            
            artistsLink.addEventListener('click', buttonEvents.getArtists);

            tracksLink.addEventListener('click', buttonEvents.getTracksAndPlaylists);

            albumsLink.addEventListener('click', buttonEvents.getAlbums);
            
            playlistsLink.addEventListener('click', buttonEvents.getPlaylists);

            addNewButton.addEventListener('click', displayModule.displayForms);
        },
        bindFormPageEventListeners: function(){
            handleForms.preventDefault();

            const newAlbum = document.getElementById("newAlbum");
            const newArtist = document.getElementById("newArtist");
            const newPlaylistButton = document.getElementById('newPlaylist');
            const newArtistButton = document.getElementById("newArtistSubmit");
            const newAlbumButton = document.getElementById("newAlbumSubmit");

            newArtistButton.addEventListener('click', buttonEvents.addNewArtist);
            newPlaylistButton.addEventListener('click', buttonEvents.addNewPlaylist);
            newAlbumButton.addEventListener('click', buttonEvents.addNewAlbum);
        }, 
        bindAlbumPageEventListeners: function(){
            let albumImages = outputDiv.querySelectorAll('img');

            for(let albumImage of albumImages){
                let albumID = albumImage.dataset.id;
                
                albumImage.addEventListener('click', function(){
                    buttonEvents.getIndividualAlbum(albumID);
                });
            }
        },
        bindArtistPageEventListeners: function(){
            let artistImages = outputDiv.querySelectorAll('img');

            for(let artistImage of artistImages){
                let artistID = artistImage.dataset.id;
                
                artistImage.addEventListener('click', function(){
                  buttonEvents.getIndividualArtist(artistID);
                });
            }
        },
        bindIndividualAlbumPageEventListeners: function(){

            handleForms.preventDefault();
            
            const newTrackForm = document.getElementById('addTrackForm');
            const deleteAlbumButton = document.getElementById('deleteAlbum');
            const albumID = deleteAlbumButton.dataset.id;

            deleteAlbumButton.addEventListener('click', function(){
                buttonEvents.deleteOneAlbum(albumID)
            });

            const addTrackButton = document.getElementById('addTrack');

            let artistID = addTrackButton.dataset.artistid;
            addTrackButton.addEventListener('click', function(){
                buttonEvents.addNewTrack(albumID, artistID);
            });

            const albumTracksDiv = document.getElementById('albumTracks');

            let deleteTrackButtons = albumTracksDiv.querySelectorAll('button');
            for(let deleteTrackButton of deleteTrackButtons){
                deleteTrackButton.addEventListener('click', function(){
                    let trackID = this.dataset.id;
                    buttonEvents.deleteOneTrack(trackID);
                })
            }
        },
        bindIndividualArtistPageEventListeners: function(){
            let deleteArtistButton = document.getElementById('deleteArtist');
            let artistID = deleteArtistButton.dataset.id;

            deleteArtistButton.addEventListener('click', function(){
                buttonEvents.deleteOneArtist(artistID);
            });
        },
        bindTrackPageEventListeners: function(){
            let playlistDropdownButtons = outputDiv.querySelectorAll('button');

            for(let button of playlistDropdownButtons){
                button.addEventListener('click', function(){  
                    this.nextElementSibling.classList.toggle('hidden');
                    let playlistOptions = this.nextElementSibling.querySelectorAll('li');
    
                    for(let playlistOption of playlistOptions){
                        let playlistID = playlistOption.dataset.id;
                        let trackID = playlistOption.dataset.trackid;
                        playlistOption.addEventListener('click', function(){
                            buttonEvents.addTrackToPlaylist(playlistID, trackID);
                        });
                    }
                });
            }
        }
    }

}());


let searchController = (function(){
    return {
        searchForAlbum: function(){
            let searchAlbumForm = document.getElementById('searchAlbumForm');
            let searchAlbumButton = document.getElementById('searchAlbumButton');
            handleForms.preventDefault();
            searchAlbumButton.addEventListener('click', function(){
                let albumSearchField = document.getElementById('albumSearchField').value;
                Albums.searchByTitle(albumSearchField);
            });
        }
    }
}());

let handleForms = (function(){
    return {
        preventDefault: function(){
            let forms = document.querySelectorAll('form');
            for(let form of forms){
                form.addEventListener("submit", function(event){
                    event.preventDefault();
                 });
            }
        },
        validate: function(inputFields){
            for(inputField of inputFields){
                if(inputField == ""){
                    return false;
                }
                if(!inputField.replace(/\s/g, '').length){
                    return false;
                }
                return true;
            }
        }
    }
}());

//Bind all the home page nav link buttons to their eventlisteners
bindEvents.bindHomePageEventListeners();
//Get the albums to display on the front page
buttonEvents.getAlbums();