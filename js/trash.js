       // Calculamos la nueva posición, para ello 
        // primero verificamos si al moverse a la derecha 
        // hay contacto con un obstáculo, de ser así: 
        // significa que no podemos atraversar al obstáculo, 
        // así que en vez de cancelar el movimiento, calculamos 
        // la nueva posición de modo que el jugador quede justo 
        // a la izquierda del obstáculo tocándolo por 10 pixeles, ya que 
        // es la reducción de las hitbox del personaje. 
        // De no ser así: simplemente movemos hacia la derecha el 
        // valor de la variable "velocity", que indica cuántos 
        // pixeles avanza por movimieto el jugador.
        const contactWith = Game.contactDetect(this.id, '#gameContainer > #surface > obstacle');
        // console.log(contactWith);


        let newPosX = parseInt(playerPosX) + velocity;

        if(contactWith){

            const element = document.querySelector('#' + contactWith);
            const elementStyle = window.getComputedStyle(element);
            const elementStartX = parseInt(elementStyle.getPropertyValue('left'));
            const playerWidth = parseInt(playerStyle.getPropertyValue('width'));

            newPosX = elementStartX - playerWidth + 10;

            // Si choca con una pared, la variable velocity debe ser 0, 
            // ya que con ella se hace el scroll que simula movimiento de cámara, 
            // entonces ya que no se mueve del sitio el jugador porqué hay 
            // un obstáculo, la cámara tampoco debe moverse.
            velocity = 0;

        }

        // Se hace el movimiento sin que salga del terreno.
        // Cuando la nueva posición del jugador sea fuera del 
        // terreno por la derecha, el jugador se mueve justo al límite. 
        if(newPosX > this.lateralLimit){
            player.style.left = this.lateralLimit + 'px';
        }else{
            player.style.left = newPosX + 'px';
        }
        // Hacemos scroll a la velocidad que se mueve el jugador. 
        console.log(velocity);
        game.scrollBy(velocity, 0);






izquierda












        // Calculamos la nueva posición, para ello 
        // primero verificamos si al moverse a la izquierda 
        // hay contacto con un obstáculo, de ser así: 
        // significa que no podemos atraversar al obstáculo, 
        // así que en vez de cancelar el movimiento, calculamos 
        // la nueva posición de modo que el jugador quede justo 
        // a la derecha del obstáculo tocándolo por 10 pixeles, ya que 
        // es la reducción de las hitbox del personaje. 
        // De no ser así: simplemente movemos hacia la izquierda 
        // con el valor de la variable "velocity", que indica cuántos 
        // pixeles avanza por movimieto el jugador.
        const contactWith = Game.contactDetect(this.id, '#gameContainer > #surface > obstacle');
        console.log(contactWith);


        let newPosX = parseInt(playerPosX) - velocity;

        if(contactWith){

            const element = document.querySelector('#' + contactWith);
            const elementStyle = window.getComputedStyle(element);
            const elementStartX = parseInt(elementStyle.getPropertyValue('left'));
            const elementEndX = elementStartX + parseInt(elementStyle.getPropertyValue('width'));
            const playerWidth = parseInt(playerStyle.getPropertyValue('width'));

            newPosX = elementEndX - 10;

            // Si choca con una pared, la variable velocity debe ser 0, 
            // ya que con ella se hace el scroll que simula movimiento de cámara, 
            // entonces ya que no se mueve del sitio el jugador porqué hay 
            // un obstáculo, la cámara tampoco debe moverse.
            velocity = 0;

        }
            
        // Se hace el movimiento sin que salga del terreno.
        // Cuando la nueva posición del jugador sea un left 
        // negativo, significa que será fuera del terreno por 
        // la izquierda, entonces se mueve a left 0 y así queda en 
        // el límite sin salir del terreno.
        if(newPosX < 0){
            player.style.left = '0px';
        }else{
            player.style.left = newPosX + 'px';
        }
        // Hacemos scroll a la velocidad que se mueve el jugador. 
        game.scrollBy(-velocity, 0);








        gravity 



            // Verificamos si en la próxima posición que tomará 
            // el objeto (debido a la fuerza de la gravedad) este 
            // entra en contacto con un obstáculo, de ser así significa 
            // que al descender se encontró con un obstáculo, por lo cual 
            // no debe descender ya que provocaría que este se solape con 
            // el obstáculo.
        let contactWith = Game.contactDetect(thisObject.id, newPosX, newPosY, '#gameContainer > #surface > obstacle');            
            
        if(contactWith){ 

            // Solo si el objeto está arriba del obstáculo, 
            contactWith = document.querySelector('#' + contactWith);
            const contactWithStyle = window.getComputedStyle(contactWith);
            const contactWithPosY = parseInt(contactWithStyle.getPropertyValue('bottom'));
            // console.log(contactWithPosY, playerPosY);

            if(contactWithPosY < playerPosY){
                thisObject.falling = 0; 
                return; 
            }

        }




setAnimation()

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














