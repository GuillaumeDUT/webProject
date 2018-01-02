var Lancement = document.getElementById("Lancement");
var logo=document.getElementById("logo");
var homelogo=document.getElementById("homelogo");
var wrapperHomeContent=document.getElementById('wrapperHomeContent');
var wrapperJeu = document.getElementById('wrapperJeu');
var inputReponse = document.getElementById('inputReponse');
var finJeu = document.getElementById('finJeu');
var skipButton = document.getElementById('skipButton');
var nbTotalMusiques = document.getElementById('nbTotalMusiques');
var scoreFinal = document.getElementById('scoreFinal');
var scoreEnJeu = document.getElementById('scoreEnJeu');
var restart = document.getElementById('restart');
var titreMusique = document.getElementById('titreMusique');
var barreDeProgression = document.getElementById('barreProgressionMusique');

var ytApiKey = "AIzaSyBVzYEFC1rc0Z5YVrEiICQcq0eAAVKsGGY";
var ytPlaylistId ="";
var dataFromAPI = [];
var nbMusiques;
var score = 0;
var indexMusiqueRandom;
var tick;
var arrayPlaylistId={
  "soiree":"PL5cn0JmhPoTETkCGhn2_Sd8sRhe4WWWqV",
  "annee70":"PL5cn0JmhPoTGxEeY0j2798ujchKAt9cBO",
  "jeudimac":"PL5cn0JmhPoTF3gfaxnS1kZ6_hV1yVgMdn",
  "frenchtouch":"PL5cn0JmhPoTEho_XJrfhk1feAyAhiHA81",
  "monbonentendeur":"PL5cn0JmhPoTFcr1R3mQq6wuES4QW72owN",
  "ghibli":"PL5cn0JmhPoTFMl7x_WnknWpx6hGFc7axX",    
};

// PASSER À LA HOMEPAGE
logo.addEventListener('click',function(e){
  console.log("Trolol");
  clearInterval(tickNotes);
  Lancement.style.display = "none";
  wrapperHomeContent.style.display = "block";
})

// REVENIR À LA PAGE DE LANCEMENT

homelogo.addEventListener('click',function(e){
  Lancement.style.display = "block";
  wrapperHomeContent.style.display = "none";
})

// EVENTS LISTENERS 
//pour récup les datas + afficher le Jeu et le lancer selon les cas

wrapperHomeContent.addEventListener('click',function(e){
  //console.log(e.target.getAttribute('value'));
  if(e.target.getAttribute('value')){
    ytPlaylistId=arrayPlaylistId[e.target.getAttribute('value')];
    fetchData();
  }
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
  barreDeProgression.classList.remove("animationProgressionMusique");

  /*if(player.getPlayerState() ==  1){
    nextMusique();
  }*/
  clearInterval(tick);
  musiqueNonTrouvee();
});



restart.addEventListener('click',function(e){
  e.preventDefault();
  finJeu.style.display  = "none";
});




//récup les données
function fetchData(){
  fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId='+ytPlaylistId+'&key='+ytApiKey+'',{mode: 'cors'})
    .then(function(response){

    return response.json();
  })
    .then(function(json){
    console.log(json)
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
  unMute(); 
  if(dataFromAPI[randomMusic] == undefined){
    stopTick();
    finDuJeu()
    return 0;
  }

  player.cueVideoById({
    videoId:dataFromAPI[randomMusic][0],
    startSeconds:40,
    endSeconds:61,
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
  if(player.getCurrentTime() >= 40.01){
    barreDeProgression.classList.remove("animationProgressionMusique");
    barreDeProgression.classList.add("animationProgressionMusique");
  }
  
  if(player.getCurrentTime() >= 60.01){
    barreDeProgression.classList.remove("animationProgressionMusique");
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
  setVolume();
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

function unMute() {
  player.unMute();
}

function setVolume(){  
  var valeurvolume = document.getElementById('inputvolume').value; 
  player.setVolume(Number(valeurvolume));
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



