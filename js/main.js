var cSubmit=document.querySelector("#inputSubmit"); // BOUTTON SUBMIT 
var cModule=document.querySelector("#module1"); // MODULE 
var cTexteReady=document.querySelector("#Texte3");
var count = 6;
var affichetimer=document.querySelector('#count_num');
var ytApiKey = "AIzaSyBVzYEFC1rc0Z5YVrEiICQcq0eAAVKsGGY";

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '360',
    width: '640',
    videoId: 'bYPuz0EYPSo',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 60000);
    done = true;
  }
}
function stopVideo() {
  player.stopVideo();
}

function onPlayerReady(event) {

}
cSubmit.addEventListener('click',function(e){
  e.preventDefault();
  cModule.classList.add("displayimportant");
  cTexteReady.classList.add("displayimportant");

  document.querySelector('#inputreponse').focus();

  function anim() {
    if (count > 0 ) {
      //console.log(count);
      count--;
      setTimeout(anim, 700);
      if(count<4){
        affichetimer.innerHTML=count;
      }
    }
    if (count==0){
      affichetimer.innerHTML=(' G O ! ')    
    }
  }
  anim();
  onPlayerReady(player.playVideo())

  //récup le titre d'une vidéo à partir de son ID en utilisant l'api youtube v3 
  fetch('https://www.googleapis.com/youtube/v3/videos?id=bYPuz0EYPSo&key=AIzaSyBVzYEFC1rc0Z5YVrEiICQcq0eAAVKsGGY&part=snippet', {mode: 'cors'})
    .then(function(response) {
    return response.json();
  })
    .then(function(json){
    console.log(json.items[0]["snippet"]["title"])
  });
})