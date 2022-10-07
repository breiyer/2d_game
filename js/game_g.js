// Eventos
document.addEventListener('keydown', (event) => {
    const name = event.key;
    const code = event.code;


    // console.log(`Key pressed ${name} \r\n Key code value: ${code}`);


    // Unidades en px
    var moveValue = 3;


    const game = document.querySelector('#gameContainer');
    const surface = document.querySelector('#gameContainer > #surface');
    const player = document.querySelector('#gameContainer > #surface > #player');
    

    const playerStyle = window.getComputedStyle(player);
    const playerPosX = parseInt(playerStyle.getPropertyValue('left'));  
    const playerPosY = parseInt(playerStyle.getPropertyValue('top'));
    const playerWidth = parseInt(playerStyle.getPropertyValue('width'));
    const playerHeight = parseInt(playerStyle.getPropertyValue('height'));
    const playerJump = parseInt(player.getAttribute('jump'));
    const playerAttack = parseInt(player.getAttribute('attack'));
    const playerPushBack = parseInt(player.getAttribute('pushback'));
    const playerLifes = parseInt(player.getAttribute('lifes'));
    // Recordemos que al obtener valores css, estos se presentan en px, si se 
    // establecieron en rem, em o cualquiera otra medida desde el css, js lo pasa a px  


    const surfaceStyle = window.getComputedStyle(surface);
    const surfaceWidth = parseInt(surfaceStyle.getPropertyValue('width'));  
    const LateralLimit = surfaceWidth - playerWidth;




    // Se determina la dirección hacia dónde mover, y se calcula la nueva posición
    if(code == 'ArrowRight' && playerPushBack != 1 && playerLifes >= 1){


        // Cambiamos la animación y dirección, y hacemos scroll para simular movimiento de cámara
        if(playerJump != '1' &&  playerAttack != '1'){  // Solo hace la animación de movimiento, 
        // y cambio de dirección, si no está saltando o atacando
            setAnimation('MoveRight');
            player.setAttribute('side', 'right');
        }else{ moveValue -= 1; }  // Si se está saltando, el desplazamiento debe ser menor
        game.scrollBy(moveValue, 0);

        // Calculamos la nueva posición
        const newPosX = parseInt(playerPosX) + moveValue;

        // Se hace el movimiento sin que salga del terreno.
        // LateralLimit es el tamaño horizontal del terreno restando 
        // el tamaño del jugador, así cuando la nueva posición del 
        // jugador supere el tamaño del terreno, el jugador se mueve justo al limite.
        if(newPosX > LateralLimit){
            player.style.left = LateralLimit + 'px';
        }else{
            player.style.left = newPosX + 'px';
        }


    }else if(code == 'ArrowLeft' && playerPushBack != 1 && playerLifes >= 1){


        // Cambiamos la animación y dirección, y hacemos scroll para simular movimiento de cámara
        if(playerJump != '1' &&  playerAttack != '1'){  // Solo hace la animación de movimiento, 
        // y cambio de dirección, si no está saltando o atacando
            setAnimation('MoveLeft');
            player.setAttribute('side', 'left');
        }else{ moveValue -= 1; }  // Si se está saltando, el desplazamiento debe ser menor
        game.scrollBy(-moveValue, 0);

        // Calculamos la nueva posición
        const newPosX = parseInt(playerPosX) - moveValue;  
        
        // Se hace el movimiento sin que salga del terreno.
        // Cuando la nueva posición del jugador sea un left 
        // negativo, entonces se mueve a left 0 y así queda en 
        // el límite sin salir del terreno.
        if(newPosX < 0){
            player.style.left = '0px';
        }else{
            player.style.left = newPosX + 'px';
        }        


    }else if(code == 'ArrowUp' &&  playerJump != '1' && 
    playerAttack != '1' && playerPushBack != 1 && playerLifes >= 1){

        const playerJumpValue = 40;

        // Colocamos el estado saltando
        player.setAttribute('jump', '1');


        // Cambiamos la animación
        setAnimation('Jump');

        // Calculamos la nueva posición
        const newPosY = playerJumpValue;
        
        // Se hace el movimiento
        player.style.bottom = newPosY + 'px';


        // Movemos al jugador al suelo cuando haya 
        // pasado 1s que es lo que demora la animación 
        // cuando salta el jugador.       
        setTimeout(() => {

            const player = document.querySelector('#gameContainer > #surface > #player');
            player.style.bottom = '0px';


            // Quitamos el estado saltando cuando haya 
            // pasado 1s que es lo que demora la animación 
            // cuando desciende el jugador            
            setTimeout(() => {

                const player = document.querySelector('#gameContainer > #surface > #player');
                player.setAttribute('jump', '0');

                const playerPushBack = parseInt(player.getAttribute('pushback'));
                const playerLifes = parseInt(player.getAttribute('lifes'));
    
                if(playerPushBack != 1 && playerLifes >= 1){
                    setAnimation('Idle');
                }

            }, 800);

        }, 800);
      

    }else if(code == 'Space' &&  playerAttack != '1' && 
    playerPushBack != 1 && playerLifes >= 1){


        // Colocamos el estado atacando
        player.setAttribute('attack', '1');
        // Disparamos el proyectil
        const bulletClass = 'bullet1';
        bulletAttack(player, surface, surfaceWidth, playerPosY, 
        playerPosX, playerWidth, playerHeight, bulletClass);

        // Cambiamos la animación
        setAnimation('Attack');

        // Tras .8s quitamos el estado atacando, es lo que demora 
        // la animación       
        setTimeout(() => {

            const player = document.querySelector('#gameContainer > #surface > #player');
            player.setAttribute('attack', '0');

            setAnimation('Idle');

        }, 800);
      

    }


             





}, false);




document.addEventListener('keyup', () => {

    const player = document.querySelector('#gameContainer > #surface > #player');
    const playerPushBack = parseInt(player.getAttribute('pushback'));
    const playerLifes = parseInt(player.getAttribute('lifes'));

    if(player.getAttribute('jump') != '1' 
    && player.getAttribute('attack') != '1' && 
    playerPushBack != 1 && playerLifes >= 1){
        // Cambiamos la animación
        setAnimation('Idle');
    }

}, false);
