const addNewButton = document.getElementById("addNew");
const newAlbum = document.getElementById("newAlbum");

newAlbum.addEventListener("submit", function(event){
    event.preventDefault();
 });

addNewButton.addEventListener('click', function(){
    console.log("Hellu");
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
