var inputSubmit = document.getElementById("inputSubmit");
var wrapperJeu = document.getElementById('wrapperJeu');
var inputReponse = document.getElementById('inputReponse');
var finJeu = document.getElementById('finJeu');
var skipButton = document.getElementById('skipButton');
var nbTotalMusiques = document.getElementById('nbTotalMusiques');
var scoreFinal = document.getElementById('scoreFinal');
var scoreEnJeu = document.getElementById('scoreEnJeu');
var restart = document.getElementById('restart');
var titreMusique = document.getElementById('titreMusique');

var ytApiKey = "AIzaSyBVzYEFC1rc0Z5YVrEiICQcq0eAAVKsGGY";
var ytPlaylistId ="PLu1XMvYo5guTX7EkuUVX5lf_hedXF4_u-";

var dataFromAPI = [];
var nbMusiques;
var score = 0;
var indexMusiqueRandom;
var tick;



//pour récup les datas + afficher le Jeu et le lancer
inputSubmit.addEventListener('click',function(e){
  e.preventDefault();
  fetchData();

});

//ecoute ce qu'on tape
inputReponse.addEventListener('keyup',function(e){
  e.preventDefault();
  //console.log(this.value)
  if (e.keyCode == 13) {
    if ( verifiereponse(dataFromAPI[randomMusic][1],inputReponse.value) >= 0.5) {
      reponseTrouvee();
    }
  }

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
  titreMusique.innerHTML = ' ';
  randomMusic = Math.floor(Math.random()* (dataFromAPI.length - 0)) + 0;

  if(dataFromAPI[randomMusic] == undefined){
    stopTick();
    finDuJeu()
    return 0;
    console.log('fin du jeu qui reste après le return donc pas normal quoi')
  }

  player.cueVideoById({
    videoId:dataFromAPI[randomMusic][0],
    startSeconds:40,
    endSeconds:60,
    suggestedQuality:'small',
  });

  player.playVideo();
  tick = setInterval(tickPlayer,1000);
  tickPlayer();
}


function nextMusique(){
  dataFromAPI.splice(randomMusic,1);
  jouerMusique();
}

function finDuJeu(){
  stopVideo();
  window.clearInterval(tick);
  wrapperJeu.style.display  = "none";
  scoreFinal.innerHTML = score;
  nbTotalMusiques.innerHTML = nbMusiques;
  finJeu.style.display = "block";
  score = 0;
}


//faut clear la variable tick quand on veut pas que cette fonction recommence
function tickPlayer(){
  player.playVideo();
  if(player.getCurrentTime() > 60){
    console.log('times out')
    clearInterval(tick);
    musiqueNonTrouvee();
    return 0;
  }
  if(player.getPlayerState() ==  3){
    //parfois youtube mets la vidéo en player.getPlayerState -1  ou en 3 du coup faut relancer
    console.log('bug de youcacatube qui met en buffering la vidéo :( ');
    player.seekTo(40);
  }
  console.log('tick');
}


function musiqueNonTrouvee(){
  titreMusique.innerHTML = dataFromAPI[randomMusic][1];
  setTimeout(nextMusique,5000);
}

function reponseTrouvee(){

  player.pauseVideo();
  titreMusique.innerHTML = dataFromAPI[randomMusic][1];
  score++;
  scoreEnJeu.innerHTML = score;
  inputReponse.value = "";
  setTimeout(nextMusique,3000);
}

function stopTick(){
  clearInterval(tick);
}



//############## DISTANCE DE LEVHENMACHIN LA


function verifiereponse(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
                                costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}



