var container = document.getElementById("container");

document.addEventListener('keydown', (event) => {
  const keyName = event.key;

  if(keyName == "Control"){
    container.style.backgroundColor = "#000";
  }


});
