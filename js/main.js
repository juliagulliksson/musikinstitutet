const key = "?key=flat_eric";

let hamburger = document.getElementById('hamburgerIcon');
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

        fetch('https://folksa.ga/api/artists' + key,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this)
        })
            .then((response) => response.json())
            .then((artist) => {
                console.log(artist);
                if(artist.new == false){
                    console.log("Artist already exists");
                }
        });
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

    searchByTitle(title){
        fetch('https://folksa.ga/api/albums' + key + '&title=' + title)
        .then((response) => response.json())
        .then((albums) => {
            console.log(albums);
        });
    }
}

class Track {

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
            eventController.bindEventListener(outputDiv);
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
                Album.deleteOne(albumID)
                .then((album) => {
                    buttonEvents.getAlbums();
                  });
            })

            let addTrackButton = document.getElementById('addTrack');

            addTrackButton.addEventListener('click', buttonEvents.addNewTrack);

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
            
        },
        displayForms: function(){
            outputDiv.innerHTML = "";
            let formsOutput = ``;
            formsOutput += 
            `<div class="form-wrapper" id="formWrapper">
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

                    Linkt to Spotify<br>
                    <input type="text" id="newArtistSpotifyURL" name="spotifyURL"><br>
                
                    Image<br>
                    <input type="text" id="newArtistCoverImage" name="coverImage"><br>
                    <input type="submit" id="newArtistSubmit" value="Save">
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

        }
    }
}());

let buttonEvents = (function(){

    return {
        getAlbums: function(){
            Album.getAll()
            .then((albums) => {
              //console.log(albums);
              displayModule.displayAlbums(albums);
            });
        }, 
        getArtists: function(){
            Artists.getAll()
              .then((artists) => {
                //console.log(artists);
                artistDisplayModule.displayArtists(artists);
            });
        },
        getPlaylists: function(){
            Playlists.getAll()
              .then((playlists) => {
                console.log(playlists);
                playlistDisplayModule.displayPlaylists(playlists);
            });
        },
        getTracksAndPlaylists: function(){
            Tracks.getAll()
            .then((tracks) => {
                //console.log(tracks);
                Playlists.getAll()
                  .then((playlists) => {
                  trackDisplayModule.displayTracks(tracks, playlists);
                })
            });
        }, 
        addNewTrack: function(){
            let albumID = addTrackButton.dataset.id;
            let artistID = addTrackButton.dataset.artistid;
            let trackTitle = document.getElementById('trackTitle').value;

            let newTrack = new Track(trackTitle, albumID, artistID);
            
            newTrack.addNew();
        },
        addNewPlaylist: function(){
            let playlistTitle = document.getElementById('newPlaylistName').value;
            let playlistGenres = document.getElementById('newPlaylistGenres').value;
            let playlistImage = document.getElementById('newPlaylistImage').value;

            let newPlaylist = new Playlist(playlistTitle, playlistGenres, playlistImage);
            newPlaylist.addNew();
        },
        addNewArtist: function(){
         
            const artistName = document.getElementById("newArtistName").value;
            const birthday = document.getElementById("newArtistBirthday").value;
            const genres = document.getElementById("newArtistGenres").value;
            const gender = document.getElementById("newArtistGender").value;
            const coverImage = document.getElementById("newArtistCoverImage").value;
            const countryBorn = document.getElementById("newArtistCountryBorn").value;
            const spotifyURL = document.getElementById("newArtistSpotifyURL").value;
    
    
            let newArtist = new Artist(artistName, birthday, genres, gender, coverImage, countryBorn, spotifyURL);
    
            newArtist.addNew();
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
            const newAlbum = document.getElementById("newAlbum");
            const newArtist = document.getElementById("newArtist");
            const addPlaylistButton = document.getElementById('newPlaylist');
            const newArtistSubmit = document.getElementById("newArtistSubmit");

            handleForms.preventDefault();

            newArtistSubmit.addEventListener('click', buttonEvents.addNewArtist);
            addPlaylistButton.addEventListener('click', buttonEvents.addNewPlaylist);
        }
     
    }

}());

//Bind all the home page nav link buttons to their eventlisteners
bindEvents.bindHomePageEventListeners();
buttonEvents.getAlbums();

let eventController = (function(){
    
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
        search: function(){
            let searchAlbumForm = document.getElementById('searchAlbumForm');
            let searchAlbumButton = document.getElementById('searchAlbumButton');
            handleFormModule.handleForm(searchAlbumForm);
            searchAlbumButton.addEventListener('click', function(){
                let albumSearchField = document.getElementById('albumSearchField').value;
                Album.searchByTitle(albumSearchField);
            });
        }
    }
}());

let Artists = new ArtistController('https://folksa.ga/api/artists');

let handleForms = (function(){
    return {
        preventDefault: function(){
            let forms = document.querySelectorAll('form');
            for(let form of forms){
               
                form.addEventListener("submit", function(event){
                    event.preventDefault();
                 });

            }
            
        }
    }
}());

//handleFormModule.handleForm(newAlbum);

//handleFormModule.handleForm(newArtist);

//eventController.search();


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

//addNewAlbum();

function addNewArtist(){
    

    newArtistSubmit.addEventListener('click', function(){

        

       
        //Will be new object in class Artist
        /*let artist = {
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
            });*/
    })
}

//addNewArtist();

/*---------- * DISPLAY * ----------*/

/*----- artists -----*/




let artistDisplayModule = (function(){
    const artistsOutput = document.getElementById('artistsOutput');
    return {
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

            let artistImages = outputDiv.querySelectorAll('img');

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
            //hideDivs([trackDiv, artistDiv,  playlistDiv, albumDiv, formDiv]);
            //showDivs([individualArtistsDiv]);
            //individualArtistsDiv.innerHTML = "";
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
            outputDiv.innerHTML = artistInfo;

            let deleteArtistButton = outputDiv.querySelector('button');

            deleteArtistButton.addEventListener('click', function(){
                let artistID = individualArtistButton.dataset.id;
                Artists.deleteOne(artistID);
            })
        }
    }
}()); 

/*----- tracks -----*/



let Tracks = new TrackController('https://folksa.ga/api/tracks');

let trackDisplayModule = (function(){
    const tracksOutput = document.getElementById('tracksOutput');
    return {
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
                let playlistDropdownButtons = outputDiv.querySelectorAll('button');
                for(let playlistDropdownButton of playlistDropdownButtons){
                    playlistDropdownButton.addEventListener('click', function(){
                        this.nextElementSibling.classList.toggle('hidden');
                        let playlistOptions = this.nextElementSibling.querySelectorAll('li');
                        for(let playlistOption of playlistOptions){
                            playlistOption.addEventListener('click', function(){
                                let playlistID = playlistOption.dataset.id;
                                let trackID = playlistOption.dataset.trackid;
                                Playlists.addTrack(playlistID, trackID)
                            })
                        }
                    })
                }
        }
    }
}()); 

/*----- albums -----*/




/*----- playlists -----*/

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

    fetch(`https://folksa.ga/api/playlists/${playlistID}/tracks${key}`,{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tracks: trackID })
    })
    .then((response) => response.json())
    .then((playlist) => {
        console.log(playlist);
    });
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

let playlistDisplayModule = (function(){
    return {
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
        }
    }
}()); 

