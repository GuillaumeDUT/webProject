var inputSubmit = document.getElementById("inputSubmit");
var wrapperJeu = document.getElementById('wrapperJeu');
var inputReponse = document.getElementById('inputReponse');
var finJeu = document.getElementById('finJeu');
var skipButton = document.getElementById('skipButton');
var nbTotalMusiques = document.getElementById('nbTotalMusiques');
var scoreFinal = document.getElementById('scoreFinal');
var restart = document.getElementById('restart');

var ytApiKey = "AIzaSyBVzYEFC1rc0Z5YVrEiICQcq0eAAVKsGGY";
var ytPlaylistId ="PLu1XMvYo5guTX7EkuUVX5lf_hedXF4_u-";

var dataFromAPI = [];
var nbMusiques;
var score = 0;
var indexMusiqueRandom;

//pour récup les datas + afficher le Jeu et le lancer
inputSubmit.addEventListener('click',function(e){
  e.preventDefault();
  fetchData();

});

//ecoute ce qu'on tape
inputReponse.addEventListener('keyup',function(e){
  e.preventDefault();
  //console.log(this.value)

});

skipButton.addEventListener('click',function(e){
  e.preventDefault();
  nextMusique();
});

restart.addEventListener('click',function(e){
  e.preventDefault();
  finJeu.style.display  = "none";
})


//récup les données
function fetchData(){
  fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId='+ytPlaylistId+'&key='+ytApiKey+'',{mode: 'cors'})
    .then(function(response){

    return response.json();
  })
    .then(function(json){
    wrapperJeu.style.display ="block";
    //on effectue une copie des données pour pouvoir y accèder autre part que dans la réponse (vu  que c'est asyncrone)
    for(i in json.items){
      dataFromAPI.push([ json.items[i]['snippet']['resourceId']['videoId'] , json.items[i]['snippet']['title'] ]);
    }
    jeu();
  });

}
//fonctions obligatoires pour l'utilisation de l'api Iframe
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '360',
    width: '640',
    videoId: '',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}
function onPlayerReady(event) {
  event.target.playVideo();
}
// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 20000);
    done = true;
  }
}
function stopVideo() {
  player.stopVideo();
}


function jeu(){
  nbMusiques = dataFromAPI.length;
  jouerMusique();

}

function jouerMusique(){

  randomMusic = Math.floor(Math.random()* (dataFromAPI.length - 0)) + 0;

  if(dataFromAPI[randomMusic] == undefined){
    finDuJeu()
    return 0;
  }
  
  player.cueVideoById({
    videoId:dataFromAPI[randomMusic][0],
    startSeconds:40,
    endSeconds:50,
    suggestedQuality:'small',
  });
  
  player.playVideo();
}


function nextMusique(){
  dataFromAPI.splice(randomMusic,1);
  jouerMusique();
}

function finDuJeu(){
  stopVideo();
  wrapperJeu.style.display  = "none";
  scoreFinal.innerHTML = score;
  nbTotalMusiques.innerHTML = nbMusiques;
  finJeu.style.display = "block";
  score = 0;
  
}






