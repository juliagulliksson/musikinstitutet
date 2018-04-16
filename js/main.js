const hamburgerMenu = document.getElementById('hamburgerIcon');

/*** Classes ***/

//Universal class to make fetch requests

class FetchController {
    constructor(baseUrl, additionalUrlParameters){
        this.baseUrl = baseUrl;
        this.additionalUrlParameters = additionalUrlParameters;
        this.key = "?key=flat_eric";
    }

    getAll(){
        return fetch(`${this.baseUrl}${this.key}${this.additionalUrlParameters}`)
        .then((response) => response.json())
    }

    getOne(id){
        return fetch(`${this.baseUrl}/${id}${this.key}`)
        .then((response) => response.json())
    }

    deleteOne(id){
        return fetch(`${this.baseUrl}/${id}${this.key}`, {
            method: 'DELETE',
            headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
          .then((response) => response.json())
    }

     search(searchBy, searchWord){
        return fetch(`${this.baseUrl}${this.key}&${searchBy}=${searchWord}&populateArtists=true`)
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

        return fetch('https://folksa.ga/api/artists?key=flat_eric',{
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

class Album {
    constructor(title, artists, releaseDate, genres, spotifyURL, coverImage, ratings){
        this.title = title;
        this.artists = artists;
        this.releaseDate = releaseDate;
        this.genres = genres;
        this.spotifyURL = spotifyURL;
        this.coverImage = coverImage;
        this.ratings = ratings; 
    }

    addNew(){
        return fetch('https://folksa.ga/api/albums?key=flat_eric',{
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

class Track {

    constructor(title, albumID, artistID, ratings){
        this.title = title;
        this.album = albumID;
        this.artists = artistID;
        this.ratings = ratings; 
    }

    addNew(){
        return fetch('https://folksa.ga/api/tracks?key=flat_eric',{
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

class Playlist {

    constructor(title, genres, coverImage){
        this.title = title;
        this.genres = genres;
        this.coverImage = coverImage;
        this.createdBy = "Power Puff Pinglorna";
    }

    addNew(){
        return fetch('https://folksa.ga/api/playlists?key=flat_eric',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this)
        })
        .then((response) => response.json())
    }

    addTrack(playlistID, trackID){
        return fetch(`https://folksa.ga/api/playlists/${playlistID}/tracks?key=flat_eric`,{
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

class Comment {
    constructor(playlistID, commentText, username){
        this.playlist = playlistID;
        this.body = commentText;
        this.username = username;
    }

    addToPlaylist(){
        return fetch(`https://folksa.ga/api/playlists/${this.playlist}/comments?key=flat_eric`,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this)
        })
        .then((response) => response.json())
    }

    deleteOne(commentID){
        return fetch(`https://folksa.ga/api/comments/${commentID}?key=flat_eric`, {
            method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            })
            .then((response) => response.json())
    }
}

class FormHandler {
    
    preventDefault(){
        let forms = document.querySelectorAll('form');
        for(let form of forms){
            form.addEventListener("submit", function(event){
                event.preventDefault();
             });
        }
    }

    validate(inputFields){
        for(let inputField of inputFields){
            if(inputField == ""){
                //Input field is empty
                return false;
            }
            if(!inputField.replace(/\s/g, '').length){
                //Input field contains only whitespace
                return false;
            }
            return true;
        }
    }

    validateSearchForms(searchValue){

        if(handleForms.validate([searchValue])){
            //Radio buttons
            const searchByTitle = document.getElementById('searchByTitle');
            const searchByGenre = document.getElementById('searchByGenre');

            if (searchByTitle.checked) {
                return searchByTitle.value;
            } else if (searchByGenre.checked) {
                return searchByGenre.value;
            } else {
                //Neither of the radio buttons are checked
                return false;
            }
        } else {
            return false;
        }
    }
  
}

const handleForms = new FormHandler();

const displayModule = (function(){
    const outputDiv = document.getElementById('output');
    
    return {
        displayAlbums: function(albums){
            
            let albumInfo = ``;
            albumInfo += `
                <div class="search-albums">
                    <form id="searchAlbumForm">
                        <input type="text" id="albumSearchField" placeholder="Search for albums here">
                        <input type="radio" value="title" id="searchByTitle">
                        <label for="searchByTitle">Title</label>
                        <input type="radio" value="genres" id="searchByGenre">
                        <label for="searchByGenre">Genre</label>
                        <button id="searchAlbumButton">Search</button>
                    </form>
                </div>
            <div class="albums-wrapper">
            `;
        
                for(let album of albums){
                    if(album.artists.length > 0){

                        albumInfo += `
                    <div class="album-wrapper">    
                        <div class="cover-image" >`;

                        albumInfo += displayModule.returnCorrectImage(album);
                            albumInfo += `</div>
                        <h4>${album.title}</h4>
                        <h5>${album.artists[0].name}</h5>`;
                        
                        albumInfo += `
                    </div>`;
                    }
                }
            albumInfo += `</div>`;
            outputDiv.innerHTML = albumInfo;
        },
        displayIndividualAlbum: function(album){
    
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
                        <h5>by ${album.artists[0].name}</h5>`;
                        if(album.genres.length > 0 && album.releaseDate != null){
                            albumInfo += `<h6>${album.genres} • ${album.releaseDate}</h6>`;
                        }
                        albumInfo += `
                        <div class="playlist-rating-form">`;
                            if(album.ratings.length > 0){
                                let ratingValueArray = album.ratings;
                                const reducer = (accumulator, currentValue) => accumulator + currentValue;
                                const value = ratingValueArray.reduce(reducer);
                                const ratingValue = value / ratingValueArray.length; 
                                console.log(ratingValue);
                            albumInfo +=`
                            <h6>Average Rating: ${Math.round(ratingValue * 10) / 10}</h6>`;
                            }
                            albumInfo +=`
                            <input type="number" id="playlistRatingControl" step="1" max="10" placeholder="Rate this album 1 - 10">
                            <button id="voteAlbum" data-id="${album._id}">Vote</button>
                        </div>
                    </div>`;
                       
                albumInfo += `</div> 
                </div>
                <div class="add-track-form">
                    <form id="addTrackForm">
                    <label for="trackTitle">Add Track</label>
                    <input type="text" id="trackTitle" placeholder="Title">
                    <button id="addTrack" data-id="${album._id}" data-artistid="${album.artists[0]._id}">Save</button>
                    </form>
                </div>`;

                albumInfo +=`
                <div class="album-tracks" id="albumTracks">
                    <ul id="albumTracksList">`;
                        for (let i=0; i < album.tracks.length; i++) {
                            albumInfo += `<li>${album.tracks[i].title}
                            <button data-id="${album.tracks[i]._id}">Delete Track</button>
                            </li>`;
                        }
                    albumInfo += `</ul>
                </div>`;
                albumInfo += `
                <div class="album-delete-button">
                    <button data-id="${album._id}" id="deleteAlbum">Delete Album</button>
                </div>
            </div>`;
          
            outputDiv.innerHTML = albumInfo;
        },
        displayForms: function(){
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

            outputDiv.innerHTML = formsOutput;
        },
        displayPlaylists: function(playlists){
            let playlistInfo = ``;
            playlistInfo += `
            <div class="search-playlist">
                <form id="searchPlaylistForm">
                    <input type="text" id="playlistSearchField" placeholder="Search for playlists here">
                    <input type="radio" value="title" id="searchByTitle">
                    <label for="searchByTitle">Title</label>
                    <input type="radio" value="genres" id="searchByGenre">
                    <label for="searchByGenre">Genre</label>
                    <button id="searchPlaylistButton">Search</button>
                </form>
            </div>

            <div class="playlists-wrapper">
            `;
        
            for(let playlist of playlists){
                playlistInfo += `
                <div class="playlist-wrapper">
                    <div class="cover-image">`;
                        playlistInfo += displayModule.returnCorrectImage(playlist);
                        playlistInfo += `</div>
                    <div class="playlist-wrap-info">
                        <div class="playlist-name"><h4>${playlist.title}</h4></div>
                        <h5>Created by</h5>
                        <div class="playlist-creator"><h5>${playlist.createdBy}</h5></div>
                    </div>
                </div>`;
            }
            playlistInfo += `</div>`;
            outputDiv.innerHTML = playlistInfo;
        },
        displayIndividualPlaylist: function(playlist, comments){

            let playlistInfo = ``;
            playlistInfo += `
            <div class="individual-playlist-wrapper">
                <div class="individual-playlist-flex-wrapper">
                    <div class="cover-image">`;
                        playlistInfo += displayModule.returnCorrectImage(playlist);
                        playlistInfo += `
                    </div>
                    <div class="playlist-info">
                        <h4>${playlist.title}</h4>
                        <h5>Created By ${playlist.createdBy}</h5>
                        <h6>${playlist.genres}</h6>
                        <div class="playlist-rating-form">`;
                            let ratingValueArray = playlist.ratings;
                            const reducer = (accumulator, currentValue) => accumulator + currentValue;
                            const value = ratingValueArray.reduce(reducer);
                            const ratingValue = value / ratingValueArray.length; 
                            console.log(ratingValue);
                            playlistInfo +=`
                            <h6>Average Rating: ${ratingValue}</h6>
                            <input type="number" id="playlistRatingControl" step="1" max="10" placeholder="Rate this album 1 - 10">
                            <button id="voteAlbum" data-id="${playlist._id}">Vote</button>
                        </div>
                    </div>
                </div>`; 
             
                playlistInfo += `
                <div class="playlist-tracks" id="playlistTracks>
                    <ul id="playlistTracksList">`;
                    for(let i in playlist.tracks){
                        playlistInfo += `<li>${playlist.tracks[i].title} - ${playlist.tracks[i].artists[0].name}
                        </li>`;
                    }
                playlistInfo += `</ul>
                </div>`;

          

                playlistInfo += `
                <div class="playlist-delete-button">
                    <button data-id="${playlist._id}" id="deletePlaylist">Delete Playlist</button>
                </div>`;

                playlistInfo += `
                <div class="comment-form">
                    <h3>Leave a comment</h3>
                    <form>
                        <label for="username">Usename</label>
                        <input type="text" id="username">
                        <label for="commentField">Comment</label>
                        <textarea id="commentField"></textarea>
                        <button id="commentButton" data-id="${playlist._id}">Send</button>
                    </form>
                </div>`;
                playlistInfo += `
                <div class="playlist-comments" id="commentDiv">
                    <h3>Comments:</h3>
                    <ul>`;
                        for(let i in comments){
                            playlistInfo += `
                            <div class="comment">
                                <li><h6>${comments[i].username}</h6>
                                <p>${comments[i].body}</p>
                                <button data-id="${comments[i]._id}">Delete</button>
                                </li>
                            </div>`;
                        }
                    
                    playlistInfo += `
                    </ul>
                </div>
            </div>`; 
            outputDiv.innerHTML = playlistInfo;
            console.log(comments);

        },
        displayTracks: function(tracks, playlists){

            let trackInfo = ``;
            trackInfo += `
            <div class="search-tracks">
                <form id="searchTrackForm">
                    <input type="text" id="trackSearchField" placeholder="Search for tracks here">
                    <input type="radio" value="title" id="searchByTitle">
                    <label for="searchByTitle">Title</label>
                    <input type="radio" value="genres" id="searchByGenre">
                    <label for="searchByGenre">Genre</label>
                    <input type="submit" id="searchTrackButton" value="Search">
                </form>
            </div>
            
            <div class="tracks-wrapper">`;
        
            for(let track of tracks){
                if(track.artists.length > 0){

                    trackInfo += `
                    <div class="track-wrapper">
                        <div class="cover-image">`;

                        trackInfo += displayModule.returnCorrectImage(track)

                        trackInfo += `
                        </div>
                        <div class="track-info-wrapper">
                            <div class="track-title"><h4>${track.title}</h4></div>
                            <div class="track-artist"><h4> - ${track.artists[0].name}</h4></div>
                    
                            <div class="add-to-playlist">
                                <button>. . .</button>

                            <div class="playlist-dropdown hidden">
                            <h4>Add track to playlist</h4>
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
                        </div>
                    </div>`;
                }
            }
            trackInfo += `</div>`;
            outputDiv.innerHTML = trackInfo;
        },
        displayArtists: function(artists){

            let artistInfo = ``;
            artistInfo += `
                <div class="search-artists">
                    <form id="searchartistForm">
                        <input type="text" id="artistSearchField" placeholder="Search for artists here">
                        <input type="radio" value="name" id="searchByTitle">
                        <label for="searchByTitle">Name</label>
                        <input type="radio" value="genres" id="searchByGenre">
                        <label for="searchByGenre">Genre</label>
                        <button id="searchArtistButton">Search</button>
                    </form>
                </div>
            <div class="artists-wrapper">
            `;

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
            outputDiv.innerHTML = artistInfo;
        },
        displayIndividualArtist: function(artist){
            let artistInfo = ``;
            artistInfo += 
            `<div class="individual-artists-wrapper">
                <div class="cover-image">`;
                    artistInfo += displayModule.returnCorrectImage(artist);
                    artistInfo += `</div>
                <h4>${artist.name}</h4>
                <button id="deleteArtist" data-id="${artist._id}">Delete Artist</button>
            </div>`;
            outputDiv.innerHTML = artistInfo;
        },
        displayNewTrack: function(track){
            let tracklist = document.getElementById('albumTracksList');
            let newTrack = document.createElement('li');
            newTrack.textContent = track.title;
            let deleteButton = document.createElement('button');
            deleteButton.textContent = "Delete Track";
            deleteButton.dataset.id = track._id;
            newTrack.appendChild(deleteButton);
            tracklist.appendChild(newTrack);
            bindEvents.bindIndividualAlbumPageEventListeners();
        },
        returnCorrectImage: function(obj){
           
            if (obj.coverImage === "" || obj.coverImage === undefined) {
                return `<img src="images/default_album4.png" data-id="${obj._id}">`;
            } else {
                return `<img src="${obj.coverImage}" data-id="${obj._id}">`;
            }
        },

    }
}());

let buttonEvents = (function(){

    const ArtistsFetch = new FetchController('https://folksa.ga/api/artists', '&sort=desc&limit=20');

    const AlbumsFetch = new FetchController('https://folksa.ga/api/albums', '&populateArtists=true&limit=20&sort=desc');

    const PlaylistsFetch = new FetchController('https://folksa.ga/api/playlists', '&createdBy=Power Puff Pinglorna');

    const TracksFetch = new FetchController('https://folksa.ga/api/tracks', '&sort=desc&limit=30');

    return {
        getAlbums: function(){
            AlbumsFetch.getAll()
              .then((albums) => {
                displayModule.displayAlbums(albums);
                bindEvents.bindAlbumPageEventListeners();
            });
        }, 
        getArtists: function(){
            ArtistsFetch.getAll()
              .then((artists) => {
                  console.log(artists);
                  displayModule.displayArtists(artists);
                  bindEvents.bindArtistPageEventListeners();
            });
        },
        getPlaylists: function(){
            PlaylistsFetch.getAll()
              .then((playlists) => {
                console.log(playlists);
                displayModule.displayPlaylists(playlists);
                bindEvents.bindPlaylistPageEventListeners();
            });
        },
        getTracksAndPlaylists: function(){
            TracksFetch.getAll()
            .then((tracks) => {
                PlaylistsFetch.getAll()
                  .then((playlists) => {
                  displayModule.displayTracks(tracks, playlists);
                  bindEvents.bindTrackPageEventListeners();
                })
            });
        }, 
        addNewTrack: function(albumID, artistID){
            let trackTitle = document.getElementById('trackTitle').value;

            let newTrack = new Track(trackTitle, albumID, artistID);

            if(handleForms.validate([trackTitle])){
                newTrack.addNew()
                .then((postedTrack) => {
                    displayModule.displayNewTrack(postedTrack);
                    console.log(postedTrack);
                });
            }else{
                //displayError();
            }
            
        },
        addNewPlaylist: function(){
            let playlistTitle = document.getElementById('newPlaylistName').value;
            let playlistGenres = document.getElementById('newPlaylistGenres').value;
            let playlistImage = document.getElementById('newPlaylistImage').value;

            let newPlaylist = new Playlist(playlistTitle, playlistGenres, playlistImage);
            if(handleForms.validate([playlistTitle])){
                newPlaylist.addNew()
                  .then((playlist) => {
                   buttonEvents.getIndividualPlaylist(playlist._id);
                });
            }else{
                //displayError();
            }
            
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
                    buttonEvents.getIndividualArtist(artist._id);
                    if(artist.new == false){
                        console.log("Artist already exists");
                    }
                });
            }else{
                //displayError();
            }
            
        },
        addNewAlbum: function(){
            const title = document.getElementById("newAlbumTitle").value;
            const artists = document.getElementById("newAlbumArtists").value;
            const genres = document.getElementById("newAlbumGenres").value;
            const releaseDate = document.getElementById("releaseDate").value;
            const spotifyURL = document.getElementById("newAlbumSpotifyURL").value;
            const coverImage = document.getElementById("newAlbumCover").value; 
           
            if(handleForms.validate([title, artists])){
                let newAlbum = new Album(title, artists, releaseDate, genres, spotifyURL, coverImage);
                newAlbum.addNew()
                .then((album) => {
                    buttonEvents.getIndividualAlbum(album._id);
                });
            }else{
                //displayError();
            }
        },
        getIndividualAlbum: function(albumID){
            AlbumsFetch.getOne(albumID)
              .then((album) => {
                displayModule.displayIndividualAlbum(album);
                bindEvents.bindIndividualAlbumPageEventListeners();
              })
        },
        getIndividualArtist: function(artistID){
            ArtistsFetch.getOne(artistID)
              .then((artist) => {
                displayModule.displayIndividualArtist(artist);
                bindEvents.bindIndividualArtistPageEventListeners();
              });
        },
        getIndividualPlaylist: function(playlistID){
            PlaylistsFetch.getOne(playlistID)
            .then((playlist) => {
                fetch(`https://folksa.ga/api/playlists/${playlistID}/comments?key=flat_eric`)
                    .then((response) => response.json())
                    .then((comments) => {
                        console.log(comments);
                        console.log(playlist);
                        displayModule.displayIndividualPlaylist(playlist, comments);
                        bindEvents.bindIndividualPlaylistPageEventListeners();
                    });
            });
        },
        deleteOneAlbum: function(albumID){
            AlbumsFetch.deleteOne(albumID)
              .then((album) => {
                buttonEvents.getAlbums();
                console.log(album);
              });
        },
        deleteOneTrack: function(trackID, listItem, list){
            TracksFetch.deleteOne(trackID)
              .then((track) => {
                //Remove the track from the DOM
                list.removeChild(listItem);
              });
        },
        deleteOneArtist: function(artistID){
            ArtistsFetch.deleteOne(artistID)
            .then((artist) => {
                buttonEvents.getArtists();
                console.log(artist);
            });
        },
        deleteOneComment: function(commentID){
            let comment = new Comment();
            comment.deleteOne(commentID)
            .then((comment) => {
                console.log(comment);
            });
        },
        addTrackToPlaylist: function(playlistID, trackID){
            let newTrack = new Playlist();
            newTrack.addTrack(playlistID, trackID)
              .then((playlist) => {
                console.log(playlist);
              });
        },
        searchForAlbums: function(searchOption, title){
            AlbumsFetch.search(searchOption, title)
              .then((albumsSearchResults) =>{
                    displayModule.displayAlbums(albumsSearchResults);
                    bindEvents.bindAlbumPageEventListeners();
              });
        },
        searchForArtists: function(searchOption, name){
            ArtistsFetch.search(searchOption, name)
              .then((artistSearchResults) =>{
                  console.log(artistSearchResults);
                    displayModule.displayArtists(artistSearchResults);
                    bindEvents.bindArtistPageEventListeners();
              });
        },
        searchForTracks: function(searchOption, title){
            TracksFetch.search(searchOption, title)
              .then((tracksSearchResults) => {
                PlaylistsFetch.getAll()
                  .then((playlists) => {
                    displayModule.displayTracks(tracksSearchResults, playlists);
                    bindEvents.bindTrackPageEventListeners();
                })   
              })
        },
        searchForPlaylists: function(searchOption, title){
            PlaylistsFetch.search(searchOption, title)
              .then((playlistSearchResults) => {
                  console.log(playlistSearchResults);
                  displayModule.displayPlaylists(playlistSearchResults);
                  bindEvents.bindPlaylistPageEventListeners();
              })
        },
        addCommentToPlaylist: function(playlistID){
            const commentText = document.getElementById('commentField').value;
            const username = document.getElementById('username').value;
            
            if(handleForms.validate([commentText, username])){

                let newComment = new Comment(playlistID, commentText, username);
                console.log(newComment);
                newComment.addToPlaylist()
                .then((playlist) => {
                    console.log(playlist);
                  });
            } else {
                //displayError();
            }
        }
    }
}());

//A module to bind the buttons/images to the events that are present in buttonEvents
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

            addNewButton.addEventListener('click', function(){
                displayModule.displayForms();
                bindEvents.bindFormPageEventListeners();
            });
        },
        bindFormPageEventListeners: function(){
            const newAlbum = document.getElementById("newAlbum");
            const newArtist = document.getElementById("newArtist");
            const newPlaylistButton = document.getElementById('newPlaylist');
            const newArtistButton = document.getElementById("newArtistSubmit");
            const newAlbumButton = document.getElementById("newAlbumSubmit");

            handleForms.preventDefault();

            newArtistButton.addEventListener('click', buttonEvents.addNewArtist);
            newPlaylistButton.addEventListener('click', buttonEvents.addNewPlaylist);
            newAlbumButton.addEventListener('click', buttonEvents.addNewAlbum);
        }, 
        bindAlbumPageEventListeners: function(){
            const searchAlbum = document.getElementById('searchAlbumButton');

            
            searchAlbum.addEventListener('click', function(){
                const albumSearchValue = document.getElementById('albumSearchField').value;
            
                let searchOption = handleForms.validateSearchForms(albumSearchValue);
                if(!searchOption){     //Search form is not correct
                    //displayError();
                } else {    //Form is correct, send the value of searchOption to the function
                    buttonEvents.searchForAlbums(searchOption, albumSearchValue);
                }
                
            });

            handleForms.preventDefault();

            const albumImages = document.querySelectorAll('img');

            for(let albumImage of albumImages){
                let albumID = albumImage.dataset.id;
                
                albumImage.addEventListener('click', function(){
                    buttonEvents.getIndividualAlbum(albumID);
                });
            }
        },
        bindArtistPageEventListeners: function(){
            const searchArtist = document.getElementById('searchArtistButton');
            searchArtist.addEventListener('click', () => {
                const artistSearchValue = document.getElementById('artistSearchField').value;
                let searchOption = handleForms.validateSearchForms(artistSearchValue);
                if(!searchOption){     //Search form is not correct
                    //displayError();
                } else {    //Form is correct, send the value of searchOption to the function
                    buttonEvents.searchForArtists(searchOption, artistSearchValue);
                }
            });

            let artistImages = document.querySelectorAll('img');

            for(let artistImage of artistImages){
                let artistID = artistImage.dataset.id;
                
                artistImage.addEventListener('click', function(){
                  buttonEvents.getIndividualArtist(artistID);
                });
            }

            handleForms.preventDefault();
        },
        bindIndividualAlbumPageEventListeners: function(){
            const newTrackForm = document.getElementById('addTrackForm');
            const deleteAlbumButton = document.getElementById('deleteAlbum');
            const albumID = deleteAlbumButton.dataset.id;

            handleForms.preventDefault();

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
                    let listItem = this.parentElement;
                    let list = listItem.parentElement;
                    buttonEvents.deleteOneTrack(trackID, listItem, list);
                });
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
            handleForms.preventDefault();
            const searchTrack = document.getElementById('searchTrackButton');
            searchTrack.addEventListener('click', () => {
                const trackSearchValue = document.getElementById('trackSearchField').value;

                let searchOption = handleForms.validateSearchForms(trackSearchValue);
                if(!searchOption){     //Search form is not correct
                    //displayError();
                } else {    //Form is correct, send the value of searchOption to the function
                    buttonEvents.searchForTracks(searchOption, trackSearchValue);
                }
            
            });

            

            let playlistDropdownButtons = document.querySelectorAll('button');

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
            handleForms.preventDefault();
            const searchPlaylist = document.getElementById('searchPlaylistButton');

            searchPlaylist.addEventListener('click', () => {
                const playlistSearchValue = document.getElementById('playlistSearchField').value;
                let searchOption = handleForms.validateSearchForms(playlistSearchValue);
                if (!searchOption) {     //Search form is not correct
                    //displayError();
                } else {    //Form is correct, send the value of searchOption to the function
                    buttonEvents.searchForPlaylists(searchOption, playlistSearchValue);
                }
            });

            let playlistImages = document.querySelectorAll('img');

            for(let playlistImage of playlistImages){
                let playlistID = playlistImage.dataset.id;
                
                playlistImage.addEventListener('click', function(){
                    buttonEvents.getIndividualPlaylist(playlistID);
                });
            }
        },
        bindIndividualPlaylistPageEventListeners: function(){
            handleForms.preventDefault();
            let deletePlaylistButton = document.getElementById('deletePlaylist');
            let playlistID = deletePlaylistButton.dataset.id;

            deletePlaylistButton.addEventListener('click', () => {
                PlaylistsFetch.deleteOne(playlistID)
                .then((playlist) => {
                    buttonEvents.getPlaylists();
                });
            });

            const commentDiv = document.getElementById('commentDiv');
            const deleteCommentButtons = commentDiv.querySelectorAll('button');
            for(deleteCommentButton of deleteCommentButtons){
                deleteCommentButton.addEventListener('click', function(){
                    let commentID = this.dataset.id;
                    buttonEvents.deleteOneComment(commentID);
                });
            }

            const commentButton = document.getElementById('commentButton');
            commentButton.addEventListener('click', () => {
                const playlistID = commentButton.dataset.id;
                buttonEvents.addCommentToPlaylist(playlistID);
            })
        }
    }
}());

//Bind all the home page nav link buttons to their eventlisteners
bindEvents.bindHomePageEventListeners();
//Get the albums to display on the front page
buttonEvents.getAlbums();