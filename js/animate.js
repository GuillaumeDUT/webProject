var logo = document.getElementById('logo');
var container = document.getElementsByTagName('.containerNotes');
logo.addEventListener('hover',function(e){
  container.append('<div class="note animationNote" >♫</div>');
  
});