var logo = document.getElementById('logo');
var container = document.getElementById('containerNotes');
var compteur = 0;
var randomPlaceY;
var randomPlaceX;
var randomRotate;
var randomCharacter;
var tickNotes;
var randomColor;
var trigger = true;
var tabBgAChanger = ['document.body','wrapperJeu','finJeu'];

var arrayChar = ["♩","♪","♫","♬","♭","♮","♯","ø"];


var randomColorMacaron;
var randomPosXMacaron;
var randomPosYMacaron;

logo.addEventListener('mouseenter',function(e){
  /* if(trigger){
    tickNotes = setInterval(animate,100);
    trigger=false;
  }else{
    clearInterval(tickNotes);
    trigger = true;
  }*/
  for(var i =0;i<4;i++){
    animate();
  }
  changeBackground();
});


function animate(){
  //on tire au sort les random coordinates + rotate
  randomPlaceY = Math.floor(Math.random() * (400 - 100) + 100) * (Math.round(Math.random()) * 2 - 1);
  randomPlaceX = Math.floor(Math.random() * (400 - 100) + 100) * (Math.round(Math.random()) * 2 - 1);
  randomRotate = Math.floor(Math.random() * (360 - 10) + 10);
  //on tire au sort l'index du caractère dans le tableau arrayChar
  randomCharacter = Math.floor(Math.random()*arrayChar.length);
  //on créé un elément de style car la class d'animation est différente selon chaque note ( random X,Y et rotate)
  var animation = document.createElement('style');
  animation.setAttribute('id','style'+compteur+'');
  animation.innerHTML ='@keyframes animNote'+compteur+'{0%{opacity:0;left:0;top:0;}20%{opacity:0}25%{opacity:1}80%{opacity:1}100%{opacity:0;left:'+randomPlaceY+'px;top:'+(randomPlaceX-100)+'px;transform:rotate('+randomRotate+'deg)}}';
  container.appendChild(animation);
  //on ajoute l'élément note correspondant au style créé précédemm
  var child = document.createElement('div');
  child.setAttribute('class','note ');
  child.setAttribute('id','animationNote'+compteur+'')
  child.setAttribute('style','animation-name:animNote'+compteur+';animation-duration:4s;animation-iteration-count:infinite;z-index:-2;');
  child.innerHTML=arrayChar[randomCharacter];
  container.appendChild(child);

  var elem = document.getElementById('animationNote'+compteur);
  var style = document.getElementById('style'+compteur);
  //pour finir on delete la note et le style correspondant après 4 secondes
  setTimeout(function(){
    elem.parentNode.removeChild(elem);
    style.parentNode.removeChild(style);
    //console.log("success")

  },4000);

  compteur++
}

function changeBackground(){
  //tire une couleur au hasard en hexadecimal et la set pour chaque layer
  randomColor = Math.floor(Math.random()*16777215).toString(16);
  document.body.style.background =  '#'+randomColor;
  wrapperJeu.style.background =  '#'+randomColor;
  finJeu.style.background =   '#'+randomColor;
}


//quasiment la même methode que pour les notes sauf que là c'est inséré à côté de l'input
function popUpFaux(){
  var macaronFaux = document.createElement('div');
  randomPosXMacaron = Math.floor(Math.random() * (80 - 20) + 20);
  randomPosYMacaron = Math.floor(Math.random() * (80 - 20) + 20);
  macaronFaux.setAttribute('class','macaronFaux wrapperCenter');
  macaronFaux.innerHTML = 'FAUX ! TB1';
  macaronFaux.setAttribute('style','width:100px;height:100px;background-color:#00000020;border-radius:50px;color:white;position:absolute;top:'+randomPosXMacaron+'%;left:'+randomPosYMacaron+'%;line-height:100px;animation-name:fadeMacaron;animation-iteration-count:1;animation-duration:2s;box-shadow:0px 0px 5px white;');
  wrapperScore.appendChild(macaronFaux);

  setTimeout(function(){
    macaronFaux.parentNode.removeChild(macaronFaux);
  },2000);
}

/*
  ######### V A P O R W A V E #########
*/

var vaporshit = document.getElementById('vaporshit');
var tabVaporSongs = ['cU8HrO7XuiE','RQxDM2K-hd0','8GW6sLrK40k'];
var vaporandom;
var vaposong;
var vaporTick
var sadboi = document.getElementById('sadboi');
var figure = document.getElementsByTagName('figure');
var boutonVaporQuit = document.getElementsByName('main > button');


function letsVaporwaveThisShit(){
  vaporandom = Math.floor(Math.random() * 5)
  vaposong = Math.floor(Math.random() * 3);
  finDuJeu();
  vaporshit.style.display = "block";
  player.cueVideoById({videoId:tabVaporSongs[vaposong],
                     startSeconds:0,
                     suggestedQuality:'small'});
  player.unMute();
  
  vaporshit.style.background = 'url("img/vaporshit'+vaporandom+'.gif")';
  document.body.style.background =  'url("img/vaporshit'+vaporandom+'.gif")';
  wrapperJeu.style.background =  'url("img/vaporshit'+vaporandom+'.gif")';
  finJeu.style.background =   'url("img/vaporshit'+vaporandom+'.gif")';
  console.log('V A P O R W A V E       W A S       T H E R E ');
  
  setTimeout(function(){player.playVideo();},1000);
  vaporTick = setInterval(reminderPlayVapor, 2000);
}

function reminderPlayVapor(){
  player.playVideo();
  console.log('vaportick')
}
sadboi.addEventListener('click',function(e){
  e.preventDefault();
  figure[0].style.display = 'block';
});

function deleteCaptitalism(){
  finJeu.style.display = 'none';
  figure[0].style.display = 'none';
  vaporshit.style.display = 'none';
  clearInterval(vaporTick);
  player.stopVideo();
}