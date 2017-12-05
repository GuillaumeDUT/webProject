var cSubmit = document.querySelector("#inputSubmit"); // BOUTTON SUBMIT 
var cModule = document.querySelector("#module1"); // MODULE 
var cTexteReady = document.querySelector("#Texte3");

var affichetimer=document.querySelector('#count_num');

var ytApiKey = "AIzaSyBVzYEFC1rc0Z5YVrEiICQcq0eAAVKsGGY";


var count = 4; // compteur display




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
    console.log(json.items)
  });
}
retrieveIdFromPlaylist();


function anim() {
  if (count > 0 ) {
    //console.log(count);
    count--;
    setTimeout(anim, 1000);
    if(count<=3){
      affichetimer.innerHTML=count;
    }
  }
  if (count==0){
    affichetimer.innerHTML=('G O !');  
    
    cModule.classList.add("displayimportant");
    onPlayerReady(player.playVideo());
  }
}

cSubmit.addEventListener('click',function(e){
  e.preventDefault();
  cTexteReady.classList.add("displayimportant");
  document.querySelector('#inputreponse').focus();


  anim();

  
    player.cueVideoById({'videoId': idArray[2][0],
                          'startSeconds': 40,
                          'endSeconds': 60,
                          'suggestedQuality': 'large'});
  
  //afficherTab();

});





function afficherTab(){
  //console.log("nique");
  console.log(idArray);
  for(var i=0; i<idArray.length;i++){
    console.log(idArray[i]);
  }
}

//retrieveIdFromPlaylist();
