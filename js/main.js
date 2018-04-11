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
        console.log(`${this.baseUrl}/${id}${key}`);
        return fetch(`${this.baseUrl}/${id}${key}`)
        .then((response) => response.json())
    }
    deleteOne(id){
        return fetch(`https://folksa.ga/api/playlists/${id}${key}`,
        {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        .then((response) => response.json())
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

let Playlists = new PlaylistController('https://folksa.ga/api/playlists');

let displayModule = (function(){
    
    return {
        displayAlbums: function(albums){
            
            outputDiv.innerHTML = "";
            let albumInfo = ``;
            albumInfo += `<div class="albums-wrapper">`;
        
                for(let album of albums){
                    if(album.artists.length > 0){

                        albumInfo += `<div class="album-wrapper">
                        
                        <div class="cover-image" >`;

                        albumInfo += displayModule.returnCorrectImage(album);
                            albumInfo += `</div>
                        <h4>${album.title}</h4>
                        <h5>${album.artists[0].name}</h5>`;
                        
                        albumInfo += `</div>`;
                    }
                }
            albumInfo += `</div>`;
            outputDiv.innerHTML += albumInfo;
            bindEvents.bindAlbumPageEventListeners();
        },
        displayIndividualAlbum: function(album){
          
            outputDiv.innerHTML = "";
            let albumInfo = ``;
            albumInfo += 
            `<div class="individual-albums-wrapper">
                <div class="individual-flex-wrapper">
                    <div class="cover-image">`;

                    albumInfo += displayModule.returnCorrectImage(album);
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
            `<div class="forms-wrapper" id="formWrapper">

              <div class="artist-form-wrapper" id="artistFormWrapper">
                <h2>Add New Artist</h2>
                <form id="newArtist">
                    <label for="newArtistName">Name</label>
                    <input type="text" id="newArtistName">

                    <label for="newArtistBirthday">Born</label>
                    <input type="date" id="newArtistBirthday">

                    <label for="newArtistGenres">Genres</label>
                    <input type="text" id="newArtistGenres" placeholder="Separate genre with comma">

                    <label for="newArtistGender">Gender</label>
                    <input type="text" id="newArtistGender" placeholder="male, female or other">

                    <label for="newArtistCountryBorn">Country Born</label>
                    <input type="text" id="newArtistCountryBorn">

                    <label for="newArtistSpotifyURL">Link to Spotify</label>
                    <input type="text" id="newArtistSpotifyURL" name="spotifyURL">
                
                    <label for="newArtistCoverImage">Image</label>
                    <input type="text" id="newArtistCoverImage" name="coverImage"><br/>
                    <button id="newArtistSubmit">Save</button>
                </form>
              </div>

              <div class="album-form-wrapper" id="albumFormWrapper">
                <h2>Add New Album</h2>
                <form id="newAlbum">
                    <label for="newAlbumTitle">Title</label>
                    <input type="text" id="newAlbumTitle">

                    <label for="newAlbumArtists">Artists</label>
                    <input type="text" id="newAlbumArtists">

                    <label for="newAlbumGenres">Genres</label>
                    <input type="text" id="newAlbumGenres">

                    <label for="releaseDate">Release Date</label>
                    <input type="text" id="releaseDate" placeholder="YYYY">

                    <label for="newAlbumSpotifyURL">Link to Spotify</label>
                    <input type="text" id="newAlbumSpotifyURL">
                    
                    <label for="newAlbumCover">Cover Image</label>
                    <input type="text" id="newAlbumCover" placeholder="Link to image host"><br/>
                    <button id="newAlbumSubmit">Save</button>
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
                    <input type="text" id="newPlaylistGenres" placeholder="Separate genre with comma"><br/>
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
        
            for(let playlist of playlists){
                playlistInfo += `
                <div class="playlist-wrapper">
                    <div class="cover-image">`;

                        playlistInfo += displayModule.returnCorrectImage(playlist);
                        
                        playlistInfo += `</div>
                    <div class="playlist-name"><h4>${playlist.title}</h4></div>
                    <div class="playlist-creator"><h5>${playlist.createdBy}</h5></div>
                   
                </div>`;
            }
            playlistInfo += `</div>`;
            outputDiv.innerHTML += playlistInfo;

            bindEvents.bindPlaylistPageEventListeners();
        },
        displayIndividualPlaylist: function(playlist){
            outputDiv.innerHTML = "";

            let playlistInfo = ``;
            playlistInfo += 
            `<div class="individual-playlist-wrapper">
                <div class="cover-image">`;

                    playlistInfo += displayModule.returnCorrectImage(playlist);

                    playlistInfo += `</div>

                <h4>${playlist.title}</h4>
                <button id="deletePlaylist" data-id="${playlist._id}">Delete Playlist</button>
            </div>`;

            for(let i in playlist.tracks){
                playlistInfo += `<li>${playlist.tracks[i].title} by ${playlist.tracks[i].artists[0].name}</li>`
            }
            outputDiv.innerHTML = playlistInfo;

            bindEvents.bindIndividualPlaylistPageEventListeners();

        },
        displayTracks: function(tracks, playlists){
            outputDiv.innerHTML = "";
            let trackInfo = ``;
            trackInfo += `<div class="tracks-wrapper">`;
        
            for(let track of tracks){
                if(track.artists.length > 0){

                    trackInfo += `
                    <div class="track-wrapper">
                        <div class="cover-image">`;

                        trackInfo += displayModule.returnCorrectImage(track)

                        trackInfo += `
                        </div>
                        <div class="track-info-wrapper">
                            <div class="track-name"><h4>${track.title}</h4></div>
                            <div class="track-genre"><h4> - ${track.artists[0].name}</h4></div>
                        </div>
                        <div class="add-to-playlist">
                            <button>Add To Playlist</button>
                            <div class="playlistDropdown hidden">
                            
                            <ul>`;
                            for(let playlist of playlists){
                                trackInfo += `
                                <li data-id="${playlist._id}" data-trackid=${track._id}>
                                ${playlist.title}
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
        
            for(let artist of artists){

                artistInfo += `
                <div class="artist-wrapper">
                 <div class="cover-image">`;
                    artistInfo += displayModule.returnCorrectImage(artist);
                    artistInfo += `</div>
                <div class="artist-name"><h4>${artist.name}</h4></div>
                </div>`;
                
            }
            artistInfo += `</div>`;
            outputDiv.innerHTML += artistInfo;

            bindEvents.bindArtistPageEventListeners();
            
        },
        displayIndividualArtist: function(artist){
            let artistInfo = ``;
            artistInfo += 
            `<div class="individual-wrapper">
                <div class="cover-image">`;
                    artistInfo += displayModule.returnCorrectImage(artist);
                    artistInfo += `</div>
                <h4>${artist.name}</h4>
                <button id="deleteArtist" data-id="${artist._id}">Delete Artist</button>
            </div>`;
            outputDiv.innerHTML = artistInfo;

            bindEvents.bindIndividualArtistPageEventListeners();
        },
        returnCorrectImage: function(object){
           
            if (object.coverImage === "" || object.coverImage === undefined) {
                return `<img src="images/default_album4.png" data-id="${object._id}">`;
            } else {
                return `<img src="${object.coverImage}" data-id="${object._id}">`;
            }
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

            if(handleForms.validate([trackTitle])){
                newTrack.addNew()
                .then((postedTrack) => {
                    console.log(postedTrack);
                });
            }//else{
                //displayError();
            //}
            
        },
        addNewPlaylist: function(){
            let playlistTitle = document.getElementById('newPlaylistName').value;
            let playlistGenres = document.getElementById('newPlaylistGenres').value;
            let playlistImage = document.getElementById('newPlaylistImage').value;

            let newPlaylist = new Playlist(playlistTitle, playlistGenres, playlistImage);
            if(handleForms.validate([playlistTitle])){
                newPlaylist.addNew()
                  .then((playlist) => {
                   buttonEvents.getPlaylists();
                });
            }//else{
                //displayError();
            //}
            
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
            
            if(handleForms.validate([artistName])){
                newArtist.addNew()
                .then((artist) => {
                    console.log(artist);
                    if(artist.new == false){
                        console.log("Artist already exists");
                    }
                });
            }//else{
                //displayError();
            //}
            
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
        getIndividualPlaylist: function(playlistID){
            Playlists.getOne(playlistID)
            .then((playlist) => {
                console.log(playlist);
                displayModule.displayIndividualPlaylist(playlist);
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
        },
        bindPlaylistPageEventListeners: function(){
            let playlistImages = outputDiv.querySelectorAll('img');

            for(let playlistImage of playlistImages){
                let playlistID = playlistImage.dataset.id;
                
                playlistImage.addEventListener('click', function(){
                    buttonEvents.getIndividualPlaylist(playlistID);
                });
            }
        },
        bindIndividualPlaylistPageEventListeners: function(){
            let deletePlaylistButton = document.getElementById('deletePlaylist');
            let playlistID = deletePlaylistButton.dataset.id;

            deletePlaylistButton.addEventListener('click', function(){
                Playlists.deleteOne(playlistID)
                .then((playlist) => {
                    buttonEvents.getPlaylists();
                });
            });
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