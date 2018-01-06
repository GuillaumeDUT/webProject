var logo = document.getElementById('logo');
//var container = document.getElementsByTagName('.containerNotes');
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

var arrayChar = ["♩","♪","♫","♬","♭","♮","♯","ø","🎤","🎹","🎸","🎻","📯","🎷","🎺","🎧","🎼","🎶"];


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
  randomPlaceY = Math.floor(Math.random() * (400 - 100) + 100) * (Math.round(Math.random()) * 2 - 1);
  randomPlaceX = Math.floor(Math.random() * (400 - 100) + 100) * (Math.round(Math.random()) * 2 - 1);
  randomRotate = Math.floor(Math.random() * (360 - 10) + 10);
  randomCharacter = Math.floor(Math.random()*arrayChar.length);
  var animation = document.createElement('style');
  animation.setAttribute('id','style'+compteur+'');
  animation.innerHTML ='@keyframes animNote'+compteur+'{0%{opacity:0;left:0;top:0;}20%{opacity:0}25%{opacity:1}80%{opacity:1}100%{opacity:0;left:'+randomPlaceY+'px;top:'+(randomPlaceX-100)+'px;transform:rotate('+randomRotate+'deg)}}';
  container.appendChild(animation);

  var child = document.createElement('div');
  child.setAttribute('class','note ');
  child.setAttribute('id','animationNote'+compteur+'')
  child.setAttribute('style','animation-name:animNote'+compteur+';animation-duration:4s;animation-iteration-count:infinite;z-index:-2;');
  child.innerHTML=arrayChar[randomCharacter];
  //console.log(child);
  container.appendChild(child);

  var elem = document.getElementById('animationNote'+compteur);
  var style = document.getElementById('style'+compteur);
  //console.log(elem);

  setTimeout(function(){
    elem.parentNode.removeChild(elem);
    style.parentNode.removeChild(style);
    //console.log("success")

  },4000);

  compteur++
}

function changeBackground(){
  randomColor = Math.floor(Math.random()*16777215).toString(16);
 // console.log(randomColor);


  document.body.style.background =  'radial-gradient(circle at center, #'+randomColor+', #000000)';
  wrapperJeu.style.background =  'radial-gradient(circle at center, #'+randomColor+', #000000)';
  finJeu.style.background =  'radial-gradient(circle at center, #'+randomColor+', #000000)';
}



function popUpFaux(){
  var macaronFaux = document.createElement('div');
  randomPosXMacaron = Math.floor(Math.random() * (80 - 20) + 20);
  randomPosYMacaron = Math.floor(Math.random() * (80 - 20) + 20);
  
  macaronFaux.setAttribute('class','macaronFaux wrapperCenter');
  macaronFaux.innerHTML = 'FAUX ! TB1';/*
  randomColorMacaron = Math.floor(Math.random()*16777215).toString(16); */
  //randomColorMacaron = randomColor;
  //console.log(randomColorMacaron)
  
  macaronFaux.setAttribute('style','width:100px;height:100px;background-color:#00000020;border-radius:50px;color:white;position:absolute;top:'+randomPosXMacaron+'%;left:'+randomPosYMacaron+'%;line-height:100px;animation-name:fadeMacaron;animation-iteration-count:1;animation-duration:2s;box-shadow:0px 0px 5px white;');
  wrapperScore.appendChild(macaronFaux);
  
  setTimeout(function(){
    
    macaronFaux.parentNode.removeChild(macaronFaux);


  },2000);
}

