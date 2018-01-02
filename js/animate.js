var logo = document.getElementById('logo');
//var container = document.getElementsByTagName('.containerNotes');
var container = document.getElementById('containerNotes');
var compteur = 0;

var randomPlaceY;
var randomPlaceX;
var randomRotate;
var randomCharacter;
var tickNotes;
var trigger = true;

var arrayChar = ["♩","♪","♫","♬","♭","♮","♯","ø","🎤","🎹","🎸","🎻","📯","🎷","🎺","🎧","🎼","🎶"];

logo.addEventListener('mouseenter',function(e){
  if(trigger){
    tickNotes = setInterval(animate,100);
    trigger=false;
  }else{
    clearInterval(tickNotes);
    trigger = true;
  }
});


function animate(){
  randomPlaceY = Math.floor(Math.random() * (400 - 100) + 100) * (Math.round(Math.random()) * 2 - 1);
  randomPlaceX = Math.floor(Math.random() * (400 - 100) + 100) * (Math.round(Math.random()) * 2 - 1);
  randomRotate = Math.floor(Math.random() * (360 - 10) + 10);
  randomCharacter = Math.floor(Math.random()*arrayChar.length);
  var animation = document.createElement('style');
  animation.setAttribute('id','style'+compteur+'');
  animation.innerHTML ='@keyframes animNote'+compteur+'{0%{opacity:0;left:0;top:0;}20%{opacity:0}25%{opacity:1}80%{opacity:1}100%{opacity:0;left:'+randomPlaceY+'px;top:'+randomPlaceX+'px;transform:rotate('+randomRotate+'deg)}}';
  container.appendChild(animation);

  var child = document.createElement('div');
  child.setAttribute('class','note ');
  child.setAttribute('id','animationNote'+compteur+'')
  child.setAttribute('style','animation-name:animNote'+compteur+';animation-duration:4s;animation-iteration-count:infinite;');
  child.innerHTML=arrayChar[randomCharacter];
  //console.log(child);
  container.appendChild(child);

  var elem = document.getElementById('animationNote'+compteur);
  var style = document.getElementById('style'+compteur);
  //console.log(elem);

  setTimeout(function(){
    elem.parentNode.removeChild(elem);
    style.parentNode.removeChild(style);
    console.log("success")

  },4000);

  compteur++
}