var cSubmit = document.querySelector("#inputSubmit"); // BOUTTON SUBMIT 
var cPage2 = document.querySelector("#page2"); // MODULE 
var cTexteReady = document.querySelector("#Texte3");
var cSkip = document.getElementById("skip");

var moduleEndOfGame = document.getElementById('moduleEndOfGame');
var foundNbSongs = document.getElementById('foundNbSongs');
var totalNbSongs = document.getElementById('totalNbSongs');

var getBackHomeButton = document.getElementById('getBackToHome');

var progressMusic = document.getElementById('progressionMusique');

var scoreaffichage=document.getElementById("idscore");
var affichetimer=document.querySelector('#count_num');

var ytApiKey = "AIzaSyBVzYEFC1rc0Z5YVrEiICQcq0eAAVKsGGY";
var count = 4; // compteur display
var score=0;


var randomMusic;
var idArrayCopyForRandom = [];


document.addEventListener('DOMContentLoaded',function(){
  cSubmit.style.display="block";

});


var musicToPlayIndex = 0;


var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '360',
    width: '640',
    videoId: 'bYPuz0EYPSo', //
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }

  });

}

var done = false;
//gère les évents des vidéos
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 20000);
    setTimeout(playEachMusic,20000);
    done = true;
  }
  if(event.data == 0){
    cInput.value = "";
    //compteur++;
    cTitreReponse.innerHTML = idArrayCopyForRandom[randomMusic][1];
    setTimeout(playEachMusic,timerBetweenMusic);
  }
}

function stopVideo() {
  player.stopVideo();
}

function unMute() {
  player.unMute();
}

//récup les id des vidéos d'une playlist et son titre et les fout dans un tableau de forme -> ['id','titre]
var idArray = [];
function retrieveIdFromPlaylist(){
  fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLu1XMvYo5guTX7EkuUVX5lf_hedXF4_u-&key='+ytApiKey+'',{mode: 'cors'})
    .then(function(response) {
    return response.json();
  })
    .then(function(json){
    for(i in json.items){
      idArray.push([ json.items[i]['snippet']['resourceId']['videoId'] , json.items[i]['snippet']['title'] ]);
      //console.log(json.items[i]['snippet']['resourceId']['videoId']) //récupère chaque id de chaque vidéo et les push dans le tab d'id
    }
    duplicateFetchArray();
  });

}
retrieveIdFromPlaylist();


function duplicateFetchArray(){
  for(var i = 0;i<idArray.length;i++){
    idArrayCopyForRandom[i] = idArray[i];
  }
}

function anim() {
  cTitreReponse.innerHTML = "";
  if (count > 0 ) {
    count--;
    if(count<=3){
      affichetimer.innerHTML=count;
    }
    setTimeout(anim, 1000);
  }
  if (count==0){
    affichetimer.innerHTML=('G O !'); 
    unMute();
    progressionMusicBar();
    onPlayerReady(player.playVideo());

  }
}

function progressionMusicBar(){
  progressMusic.classList.add("animMusicProgression");
}

var randomMusic;
var firstTime=true;

function playEachMusic(){
  cTitreReponse.innerHTML = "";
  //on queue la vidéo 
  player.setVolume(100);
  if(randomMusic !=  null && firstTime == true){
    idArrayCopyForRandom.splice(randomMusic,1);
    firstTime=false;
  }
  randomMusic = Math.floor(Math.random()* (idArrayCopyForRandom.length - 0)) + 0;

  if(idArrayCopyForRandom[randomMusic] == undefined){
    console.log("fin de la playlist")
    endOfPlaylist();
    //musicToPlayIndex = 0;
    return 0;
  }

  player.cueVideoById({'videoId': idArrayCopyForRandom[randomMusic][0],
                       'startSeconds': 40,
                       'endSeconds': 60,
                       'suggestedQuality': 'large'});
  count = 4;
  progressMusic.classList.remove("animMusicProgression");

  anim();
  //animtest();
  // musicToPlayIndex++;

}


function onPlayerReady(event) {
}



cSkip.addEventListener('click',function(e){
  e.preventDefault();
  idArrayCopyForRandom.splice(randomMusic,1);
  playEachMusic();

});

cSubmit.addEventListener('click',function(e){
  e.preventDefault();
  cPage2.classList.add("displayimportant");
  cTexteReady.classList.add("displayimportant");
  cInput.focus();
  playEachMusic();
  //afficherTab();
});


function afficherTab(){
  console.log(idArray);
  for(var i=0; i<idArray.length;i++){
    console.log(idArray[i]);
  }
}



var compteur=0;
var timerBetweenMusic = 3000;
var cInput = document.getElementById("inputReponse");
var cTitreReponse = document.getElementById("titreReponse");
cInput.addEventListener('keyup',function(e){

  if (e.keyCode == 13) {
    if ( verifiereponse(idArrayCopyForRandom[randomMusic][1],cInput.value) >= 0.5) {
      stopVideo();
      console.log('GG')
      score++;
      scoreaffichage.innerHTML=score;
      cInput.value = "";
      compteur++;
      cTitreReponse.innerHTML = idArrayCopyForRandom[randomMusic][1];
      idArrayCopyForRandom.splice(randomMusic,1);
      setTimeout(playEachMusic,3000);   
    }
    else
    {   
      console.log('Réessayez')
    }

  }

});


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

function endOfPlaylist(){
  cPage2.classList.remove("displayimportant"); 
  cTexteReady.classList.remove("displayimportant");
  moduleEndOfGame.classList.add("displayEndOfGame");
  stopVideo();
  progressMusic.classList.remove("animMusicProgression");
  foundNbSongs.innerHTML = score;
  musicToPlayIndex = 0;
  totalNbSongs.innerHTML = idArray.length;
  duplicateFetchArray();
}

getBackHomeButton.addEventListener('click',function(e){
  e.preventDefault();
  moduleEndOfGame.classList.remove("displayEndOfGame");
});

//console.log(testtimer)
//console.log(count)




