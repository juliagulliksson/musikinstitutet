
const newAlbum = document.getElementById("newAlbum");

newAlbum.addEventListener("submit", function(event){
    event.preventDefault();
 });


function addNewAlbum(){
    const newAlbumTitle = document.getElementById("newAlbumTitle")
    const newAlbumArtists = document.getElementById("newAlbumArtists")
    const newAlbumSubmit = document.getElementById("newAlbumSubmit")

    newAlbumSubmit.addEventListener('click', function(){
        const albumTitleValue = newAlbumTitle.value;
        const albumArtistsValue = newAlbumArtists.value;

        let album = {
            title: albumTitleValue,
            artist: albumArtistsValue
        }
        
        if(albumTitleValue === "" || albumArtistsValue === ""){
            console.log("NEJJJ")
        }else{
            fetch('https://folksa.ga/api/albums?key=flat_eric',{
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

let Album = new AlbumController('https://folksa.ga/api/albums?' + key + '&limit=90');


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

