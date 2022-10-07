function setAnimation(animation, thisObject){


    const player = document.querySelector(thisObject.id);
    const playerName = thisObject.name;


    if(animation == 'MoveRight' && thisObject.lifes > 0){
        player.style.transform = "rotateY(0deg)";
        player.style.animation = playerName + 'Move 1s infinite';
    }else if(animation == 'MoveLeft' && thisObject.lifes > 0){
        player.style.transform = "rotateY(180deg)"; 
        player.style.animation = playerName + 'Move 1s infinite';
    }else if(animation == 'Idle' && thisObject.lifes > 0){
        player.style.animation = playerName + 'Idle 1.3s infinite';
    }else if(animation == 'Jump' && thisObject.lifes > 0){
        player.style.animation = playerName + 'Jump 1s infinite';
    }else if(animation == 'Attack' && thisObject.lifes > 0){
        player.style.animation = playerName + 'Attack .5s';
    }else if(animation == 'Hurt' && thisObject.lifes > 0){
        player.style.animation = playerName + 'Hurt .8s';

        // Colocamos el estado hurt
        thisObject.hurt = 1;

        // Quitamos el estado hurt luego de los 
        // 8s que tarda la animación de hurt.
        setTimeout(() => {
            thisObject.hurt = 0;
        }, 800, thisObject);  

    }else if(animation == 'Death'){
        // Agregamos la animación de muerte.
        // También colocamos fijo el último frame de la 
        // animación de muerte, agregando la clase death al player.
        // Y quitamos la barra de vida.
        player.style.animation = playerName + 'Death 1.3s 1';
        player.classList.add("death");
        const lifesBar = document.querySelector(thisObject.id + ' > .lifesBar');
        lifesBar.remove();

        // Quitamos las animaciones luego de los 
        // 1.3s que tarda la animación de muerte.
        // Y si el jugador es el principal, entonces 
        // terminamos el juego.
        setTimeout(() => {

            const player = document.querySelector(thisObject.id);
            player.style.animation = 'none';

            
            // Terminamos el juego
            const objectTag = player.tagName;
            if(objectTag == 'PLAYER'){ Game.finished = true; }

        }, 1300, thisObject);        
        
    }
}


function setBulletAnimation(animation, bulletId){
    const bullet = document.querySelector(bulletId);
    const bulletClass = bullet.className;

    if(animation == 'Explode'){
        // Se coloca un microsegundo de retraso que es lo que demora la transición 
        // de desplazamiento.
        bullet.style.animation = bulletClass + 'Explosion 1s .1s 1';

        // Quitamos la bala del terreno.
        // Se espera 1.1s que es lo que demora la animación de explosión + su delay.
        setTimeout(() => {
            const bullet = document.querySelector(bulletId);
            bullet.style.display = 'none';
            bullet.style.animation = 'none';
            bullet.remove();
        }, 1100, bulletId);

    }
}


function setObstacleAnimation(animation, thisObject){
    const obstacle = document.querySelector(thisObject.id);
    const obstacleClass = obstacle.className;

    if(animation == 'Hurt'){
        obstacle.style.animation = obstacleClass + 'Hurt .5s 1';

        // Quitamos la animación luego de los 
        // 5s que tarda.
        // Por una extraña razón al dejar la animación puesta, 
        // esta se repetía al volver a disparar aunque no se llamase 
        // a la función (también sucedía con las balas, su animación 
        // explode se repetía cuando otras balas explotaban).
        setTimeout(() => {
            document.querySelector(thisObject.id).style.animation = 'none';
        }, 500, thisObject);      


    }else if(animation == 'Death'){
        obstacle.style.display = 'none';
    }
}



function hurtAnimation(thisObject, dmg){
    const object = document.querySelector(thisObject.id);
    const objectTag = object.tagName;

    // Si ya no tiene vidas, retornamos
    if(thisObject.lifes < 1){ return; }

    // Restamos vida al objeto y a su barra de vida
    thisObject.lifes -= dmg;
    removeLife(thisObject);

    // Si el objecto está sin vidas, lo enviamos a su animación death
    if(thisObject.lifes < 1){ 
        if(objectTag == 'PLAYER' || objectTag == 'ENEMY'){ setAnimation('Death', thisObject); }
        else if(objectTag == 'OBSTACLE'){ setObstacleAnimation('Death', thisObject); }        
    }else{
        if(objectTag == 'PLAYER' || objectTag == 'ENEMY'){ setAnimation('Hurt', thisObject); }
        else if(objectTag == 'OBSTACLE'){ setObstacleAnimation('Hurt', thisObject); }      
    }
    
}










