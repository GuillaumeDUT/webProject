var Lancement = document.getElementById("Lancement");
var logo=document.getElementById("logo");
var homelogo=document.getElementById("homelogo");
var wrapperHomeContent=document.getElementById('wrapperHomeContent');
var wrapperJeu = document.getElementById('wrapperJeu');
var inputReponse = document.getElementById('inputReponse');
var finJeu = document.getElementById('finJeu');
var skipButton = document.getElementById('skipButton');
var stopButton = document.getElementById('stopButton');
var nbTotalMusiques = document.getElementById('nbTotalMusiques');
var scoreFinal = document.getElementById('scoreFinal');
var scoreEnJeu = document.getElementById('scoreEnJeu');
var restart = document.getElementById('restart');
var titreMusique = document.getElementById('titreMusique');
var barreDeProgression = document.getElementById('barreProgressionMusique');
var popUp = document.getElementById('enleverModal');
var modal = document.getElementById('modalPopUp');
var image80=document.getElementById('image80');
var image20=document.getElementById('image20');
var image60=document.getElementById('image60');
var image40=document.getElementById('image40');
var form= document.getElementById('form');
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
var n = [
  '',
  ' .d8888b.  888                       888',
  'd88P  Y88b 888                       888',
  'Y88b.      888                       888',
  ' "Y888b.   888888  .d88b.  88888b.   888',
  '    "Y88b. 888    d88""88b 888 "88b  888',
  '      "888 888    888  888 888  888  Y8P',
  'Y88b  d88P Y88b.  Y88..88P 888 d88P',
  ' "Y8888P"   "Y888  "Y88P"  88888P"   888',
  '                           888',
  '                           888',
  '                           888',
  'Tricher c\'est mal, alors arrête de vouloir trouver les infos dans la console. (N\'est ce pas Maximilien ?) '
];
// PASSER À LA HOMEPAGE

popUp.addEventListener('click',function(e){
  e.preventDefault();
  modal.style.display = "none";
});

logo.addEventListener('click',function(e){
  clearInterval(tickNotes);
  Lancement.style.display = "none";
  wrapperHomeContent.style.display = "block";
  for(var i=0;i<n.length;i++){
    console.log(n[i]);
  }
});

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

form.addEventListener('submit',function(e){
  e.preventDefault();
})
//ecoute ce qu'on tape
inputReponse.addEventListener('keyup',function(e){
  e.preventDefault();  
  inputReponse.classList.remove("shake"); 
  //console.log(this.value)
  if (e.keyCode == 13) { 
    if(inputReponse.value == 'vaporwave' || inputReponse.value == 'Vaporwave'  ){
      letsVaporwaveThisShit();
      return 0;
    }
    if ( verifiereponse(dataFromAPI[randomMusic][1],inputReponse.value) >= 0.5) 
    {
      reponseTrouvee();
    }else{
      popUpFaux();
      inputReponse.classList.add("shake");  
    }

    inputReponse.value=""; //Input vidé si mauvaise réponse, ça évite de tt reselectionner ou effacer
  }


});

//event listener pour empêcher l'utilisateur de cliquer plusieurs fois et pour trigger la fonction skip
skipButton.addEventListener('click',function(e){
  e.preventDefault();
  barreDeProgression.classList.remove("animationProgressionMusique");
  clearInterval(tick);
  skipButton.disabled = 'true';
  musiqueNonTrouvee();
});

//trigger la fin du jeu
stopButton.addEventListener('click',function(e){
  e.preventDefault();
  barreDeProgression.classList.remove("animationProgressionMusique");
  clearInterval(tick);
  finDuJeu();
});

//clear l'écran et revient au choix de playlists
restart.addEventListener('click',function(e){
  e.preventDefault();
  finJeu.style.display= "none";
  image20.style.display="none"  ;
  image40.style.display="none"  ;
  image60.style.display="none"  ;
  image80.style.display="none"  ;
});



//récup les données
function fetchData(){
  fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId='+ytPlaylistId+'&key='+ytApiKey+'',{mode: 'cors'})
    .then(function(response){
    return response.json();
  })
    .then(function(json){
    wrapperJeu.style.display ="block";
    //on effectue une copie des données pour pouvoir y accèder autre part que dans la réponse (vu  que c'est asyncrone)
    for(i in json.items){
      for(var j=0;j<json.items[i]['snippet']['title'].length;j++){
        if(json.items[i]['snippet']['title'][j] == '('){
          json.items[i]['snippet']['title'] = json.items[i]['snippet']['title'].slice(0,j);
        }
      }
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
//fin fonctions obligatoires de l'api Iframe


function jeu(){
  nbMusiques = dataFromAPI.length;   
  scoreEnJeu.innerHTML = "0";
  jouerMusique();
}

//on enlève l'attribut disabled du button pour qu'on puisse de nouveau skip + on tire au sort la prochaine musique et on la cue avec les paramètres de début et de fin de vidéo. Ensuite on lance l'itération chaque seconde de la fonction tickPlayer
function jouerMusique(){
  titreMusique.innerHTML = '';
  skipButton.removeAttribute('disabled');
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
    endSeconds:60,
    suggestedQuality:'small',
  });
  player.playVideo();
  barreDeProgression.classList.add("animationProgressionMusique");    
  tick = setInterval(tickPlayer,1000);
  tickPlayer();
}

//enlève la musique du tableau qui joue en aléatoire + trigger la prochaine musique
function nextMusique(){
  barreDeProgression.classList.add("animationProgressionMusique");
  dataFromAPI.splice(randomMusic,1);
  jouerMusique();
}

//on stop la vidéo, clear l'itération chaque seconde et on affiche la fin du jeu avec le score + la bannière en fonction du ratio. Puisque parfois l'api bug  et continue de relancer la vidéo, on mute le player au cas où
function finDuJeu(){

  clearInterval(tick);
  stopVideo();
  dataFromAPI = [];
  wrapperJeu.style.display  = "none";
  scoreFinal.innerHTML = score;
  nbTotalMusiques.innerHTML = nbMusiques;
  ratiotrouvees();
  finJeu.style.display = "block";
  score = 0;
  player.mute()
}


//faut clear la variable tick quand on veut pas que cette fonction recommence

function tickPlayer(){
  player.playVideo();
  //si on a dépassé le temps 
  if(player.getCurrentTime() >= 59){
    barreDeProgression.classList.remove("animationProgressionMusique");
    //console.log('times out')
    clearInterval(tick);
    musiqueNonTrouvee();
    return 0;
  }
  if(player.getPlayerState() ==  3){
    //parfois youtube mets la vidéo en player.getPlayerState -1  ou en 3 du coup faut relancer
    //console.log('bug de youcacatube qui met en buffering la vidéo :( ');
    player.seekTo(40);
  }
  setVolume();
}

function musiqueNonTrouvee(){
  titreMusique.innerHTML = dataFromAPI[randomMusic][1];
  setTimeout(nextMusique,5000);
}

//on affiche le titre, augmente le score et trigger la fonction prochaine musique 3s après
function reponseTrouvee(){
  player.pauseVideo();
  barreDeProgression.classList.remove("animationProgressionMusique");
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

function ratiotrouvees(){
  var ratio=((score/nbMusiques)*100);
  if ((ratio>=0 && ratio<=20) == true){
    image20.style.display="block"
  }
  if( (ratio<=40 && ratio>20) == true){
    image40.style.display="block"
  }
  if ((ratio>40 && ratio<=60) == true ){
    image60.style.display="block"
  }
  if ((ratio>60) == true){
    image80.style.display="block"    
  }
  console.log(ratio);
}
//############## DISTANCE DE LEVHENMACHIN  (check la distance de caractères entre la réponse et l'input par le joueur)


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



