var cSubmit = document.querySelector("#inputSubmit"); // BOUTTON SUBMIT 
var cModule = document.querySelector("#module1"); // MODULE 
var cTexteReady = document.querySelector("#Texte3");
var cSkip = document.getElementById("skip");
var scoreaffichage=document.getElementById("idscore");
var affichetimer=document.querySelector('#count_num');

var ytApiKey = "AIzaSyBVzYEFC1rc0Z5YVrEiICQcq0eAAVKsGGY";
var count = 4; // compteur display
var score=0;




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
    setTimeout(stopVideo, 60000);
    done = true;
  }
  if(event.data == 0){
    playEachMusic();
  }
}
function stopVideo() {
  player.stopVideo();
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
    //console.log(json.items)
  });
}
retrieveIdFromPlaylist();


function anim() {
  if (count > 0 ) {
    count--;
    setTimeout(anim, 1000);
    if(count<=3){
      affichetimer.innerHTML=count;
    }
  }
  if (count==0){
    affichetimer.innerHTML=('G O !');  

    onPlayerReady(player.playVideo());
  }
}


var musicToPlayIndex = 0;

function playEachMusic(){
  //on queue la vidéo 
  player.cueVideoById({'videoId': idArray[musicToPlayIndex][0],
                       'startSeconds': 40,
                       'endSeconds': 60,
                       'suggestedQuality': 'large'});
  anim();
  musicToPlayIndex++;

}
function onPlayerReady(event) {
}

cSkip.addEventListener('click',musiquesuivante);

function musiquesuivante(e){ 
    if (e)  
      e.preventDefault();
  playEachMusic();
}

cSubmit.addEventListener('click',function(e){
  e.preventDefault();
  cModule.classList.add("displayimportant");
  cTexteReady.classList.add("displayimportant");
  document.querySelector('#inputreponse').focus();
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
var cInput = document.getElementById("inputreponse");
cInput.addEventListener('keyup',function(e){
    
    if (e.keyCode == 13) {
        if ( verifiereponse(idArray[compteur][1],cInput.value) >= 0.5) {
        console.log('GG')
            score++;
            scoreaffichage.innerHTML=score;
            musiquesuivante();
            compteur++;
    }
         else
         {   console.log('Réessayer')
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
//retrieveIdFromPlaylist();

