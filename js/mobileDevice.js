function isMobileDevice(){
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        return true;
    }else{
        return false;
    }
}


function quitTouchControl(){

    // Removemos los botones táctiles
    const shoot = document.querySelector('#left.buttonContainer > #shoot');
    const left = document.querySelector('#left.buttonContainer > #left');
    const right = document.querySelector('#right.buttonContainer > #right');
    const up = document.querySelector('#right.buttonContainer > #up');

    shoot.remove();
    left.remove();
    right.remove();
    up.remove();
    

    // Ajustamos la posición del retrato con el arma
    const leftPanel = document.querySelector('#left.buttonContainer');
    leftPanel.style.justifyContent = 'flex-start';
    leftPanel.style.alignItems = 'flex-end';
    const weapon = document.querySelector('#left.buttonContainer > #playerWeapons');
    weapon.style.marginRight = '.5rem';

    return;

}


function fullScreen(){

    return new Promise(function(resolve, reject){

        const element = document.querySelector("#container");

        // Colocamos en modo pantalla completa
        if(element.requestFullscreen){
        	element.requestFullscreen();
        }else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        }else if(element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }else if(element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } 


        // Después de 1s retornamos, 
        // para que le de tiempo para 
        // aplicar la pantalla completa.
        setTimeout(() => { 
            return resolve(1);
        }, 1000);   

    });    

}


function rotateScreen(){

    return new Promise(function(resolve, reject){
        screen.orientation.lock("landscape")
        .then(function() {
            return resolve(1);
        })
        .catch(function(error) {
            return reject(error);
        });
    });      

}



// Detecta si es un dispositivo móvil y 
// hace los ajustes que hagan falta de serlo 
// o no.
function recognizeMobileDevice(){

    return new Promise(function(resolve, reject){

        // Si es un dispositivo móvil, 
        // entonces coloca la pantalla de 
        // dispositivos móviles, y mapea los 
        // controles táctiles.
        // De no ser un dispositivo móvil, 
        // quita los controles táctiles.
        if(isMobileDevice()){

            // Colocamos en pantalla completa
            fullScreen().then(function() {
                // Rotamos la pantalla
                return rotateScreen();
            }).then(function() {
                return resolve(1);
            })
            .catch(function(error) {
                return reject(error);
            });

        }else{ quitTouchControl(); resolve(1); }  // Retiramos los 
        // controles táctiles.

    });


}

