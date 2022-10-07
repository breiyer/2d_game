// Apagar/encender la música
function toggleMusic(){

    Game.music1.loop = true;

    if(Game.music1.paused){
        // Reproducimos el soundtrack
        Game.music1.play(); 
    }else{ Game.music1.pause(); }  // Lo pausamos

    const musicButton = document.querySelector('#gameInfo > #musicButton');
    musicButton.classList.toggle('active');

}



