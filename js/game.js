class Surface{

    static id = '#surface';
    static surface = document.querySelector(this.id);
    static surfaceStyle = window.getComputedStyle(this.surface);
    static surfaceWidth = parseInt(this.surfaceStyle.getPropertyValue('width'));  
    

}

class Game{

    // Si muere el jugador o consigue su objetivo, 
    // entonces el juego se termina.
    static finished = false;

    static players = new Map();  // Contiene a los 
    // jugadores controlables.
    static enemies = new Map();  // Contiene a los 
    // jugadores bot.
    static obstacles = new Map();  // Contiene a los 
    // obstáculos.
    static bullets = new Map();  // Contiene a las 
    // balas disparadas.
    static level = 0;  // Nivel del juego
    static time = 0;  // Tiempo transcurrido


    static music1 = new Audio('/2d_game/sounds/soundtracks/dova_DETROIT BEAT_1.mp3');
    

    
    static contactDetect(thisObject, newPosX, newPosY, groupToScan){

        // Recibe un objeto y un grupo de objetos.
        // Detecta si el objeto está en contacto con 
        // algún objeto del grupo de objetos.
        const target = document.querySelector(thisObject.id);  // Objeto
        groupToScan = document.querySelectorAll(groupToScan);  // Grupo de objetos


        const targetStyle = window.getComputedStyle(target);    
        // Para saber si hay contacto entre el objeto y los otros objetos: 
        // Primero, se obtiene el dominio del objeto en el terreno, es decir, 
        // se calcula la porción específica de espacio que ocupa el objeto 
        // en el terreno de juego, para ello se identifica desde dónde empieza 
        // su dominio en el eje X y, dónde termina, lo mismo para el eje Y.
        // Las variables "hitBox" son para reducir las Hitbox de los objetos.
        let hitBoxSX = thisObject.hitBoxSX;
        let hitBoxEX = thisObject.hitBoxEX;
        let hitBoxSY = thisObject.hitBoxSY;
        let hitBoxEY = thisObject.hitBoxEY;
        if(thisObject.side == 'left'){
            hitBoxSX = thisObject.hitBoxEX;
            hitBoxEX = thisObject.hitBoxSX;
        }
        
        const targetStartX = newPosX + hitBoxSX;  
        const targetEndX = newPosX + parseInt(targetStyle.getPropertyValue('width')) - hitBoxEX;
        const targetEndY = newPosY + parseInt(targetStyle.getPropertyValue('height')) - hitBoxEY;
        const targetStartY = newPosY + hitBoxSY;

    
        var cont = 0;
        // Recorremos los objetos con los cuales se quiere saber si hay contacto
        for(let element of groupToScan){
            
            const elementId = element['id']; 
            const objectTag = element.tagName;
            const objectId = element.getAttribute('id');
            let thisObject = '1';
            
            // Si no le quedan vidas al objeto, entonces, 
            // no lo tomamos en cuenta y retornamos.
            if(objectTag == 'PLAYER'){ thisObject = Game.players.get('#' + objectId); }
            else if(objectTag == 'ENEMY'){ thisObject = Game.enemies.get('#' + objectId); }
            else if(objectTag == 'OBSTACLE'){ thisObject = Game.obstacles.get('#' + objectId); }
            else if(objectTag == 'BULLET'){ thisObject = Game.bullets.get('#' + objectId); }
            else{ console.log('Tag ', objectTag, ' unclassified') }  // Si no se identifica 
            // el objeto
            if(thisObject.lifes < 1){ continue; }
            
            
            
            // Para saber si hay contacto entre el objeto y los otros objetos: 
            // Segundo, se va obteniendo el dominio de los objetos en el terreno, 
            // al igual que se hizo con el objeto. También se toman en cuenta 
            // las Hitbox de los objetos.

            let hitBoxSX = thisObject.hitBoxSX;
            let hitBoxEX = thisObject.hitBoxEX;
            let hitBoxSY = thisObject.hitBoxSY;
            let hitBoxEY = thisObject.hitBoxEY;
            if(thisObject.side == 'left'){
                hitBoxSX = thisObject.hitBoxEX;
                hitBoxEX = thisObject.hitBoxSX;
            }

            const elementStyle = window.getComputedStyle(element);        
            const elementStartX = parseInt(elementStyle.getPropertyValue('left')) + hitBoxSX;  
            const elementEndX = elementStartX + parseInt(elementStyle.getPropertyValue('width')) - hitBoxEX;
            const elementEndY = parseInt(elementStyle.getPropertyValue('bottom')) + parseInt(elementStyle.getPropertyValue('height')) - hitBoxSY;
            const elementStartY = parseInt(elementStyle.getPropertyValue('bottom')) + hitBoxEY;            
    
    
            // Para saber si hay contacto entre el objeto y los otros objetos: 
            // Tercero, ya que conocemos el dominio en el terreno del 
            // objeto y los objetos, ahora para saber si hay contacto solo 
            // debemos saber si sus dominios conciden en algún punto, es decir, 
            // si están superpuestos en el terreno (si se están tocando). 
            // Para ello primero verificamos si en el eje X sus dominios se 
            // superponen, por lo que aplicamos 3 reglas básicas: 
            // (obstáculo se refiere a un objeto del grupo de objetos)
            // 1) Si el inicio en X del obstáculo está  
            // atrás del inicio en X del objeto, y además 
            // el fin en X del obstáculo está adelante de 
            // del inicio en X del objeto, quiere decir que 
            // el inicio en X del objeto está en medio del 
            // inicio y fin en X del obstáculo, lo que quiere  
            // decir que en el eje X coinciden. 
            // 2) Si el inicio en X del obstáculo está  
            // adelante de el inicio en X del objeto, y 
            // el inicio en X del obstáculo está detrás de 
            // el fin en X del objeto, quiere decir que 
            // el inicio en X del obstáculo está en medio de 
            // el inicio y fin en X del objeto, lo que quiere  
            // decir que en el eje X coinciden. 
            // 3) Si el inicio en X del obstáculo está  
            // adelante de el inicio en X del objeto, y 
            // el fin en X del obstáculo está detrás de 
            // el fin en X del objeto, quiere decir que 
            // el inicio y fin en X del obstáculo están entre 
            // el inicio y fin en X del objeto, lo que quiere  
            // decir que en el eje X coinciden.
            if((elementStartX <= targetStartX && elementEndX >= targetStartX) || 
               (elementStartX >= targetStartX && elementStartX <= targetEndX) ||  
               (elementStartX >= targetStartX && elementEndX <= targetEndX)){
    
                // Ahora, para calcular si en el eje Y coinciden, se hace lo mismo 
                // Si coinciden en el eje X y Y, quiere decir que hay contacto 
                if((elementStartY <= targetStartY && elementEndY >= targetStartY) || 
                   (elementStartY >= targetStartY && elementStartY <= targetEndY) ||  
                   (elementStartY >= targetStartY && elementEndY <= targetEndY)){
                    
                    return elementId;

                }                

            }

        }
        return false;

    }


    
    static keepPerspective(thisObject){

        // Se encarga de que el objeto que recibe, siempre 
        // se mantenga (preferiblemente) en el centro del juego 
        // que es visible para el usuario, es decir, funciona 
        // simulando la cámara que persigue a los jugadores para 
        // que podamos ver el juego desde su perspectiva.

        const player = document.querySelector(thisObject.id);
        const playerStyle = window.getComputedStyle(player);
        const playerPosX = parseInt(playerStyle.getPropertyValue('left'));

        const game = document.querySelector('#gameContainer');
        const gameStyle = window.getComputedStyle(game);
        const gameHalfWidth = parseInt(gameStyle.getPropertyValue('width')) / 2;
        // const gameCamera = game.scrollLeft;



        // Para lograr simular la cámara que sigue al jugador, 
        // lo que hacemos es tomar el valor de la mitad del 
        // div contenedor del juego, el cual hace de cámara. 
        // Ahora, para hacer el scroll adecuado al div del juego, 
        // lo que hacemos es calcuar la diferencia entre la posición 
        // en X del jugador y la mitad del div contenedor del juego, 
        // y ese será el valor del scroll. 
        // De esta forma, el scroll siempre mantendrá alejado del jugador 
        // la mitad del div contenedor del juego, por lo que el jugador 
        // estará en el centro de la cámara (div contenedor del juego).
        const differenceBetweenPlayerAndScroll = playerPosX - gameHalfWidth;
        // console.log(playerPosX, gameCamera, px);
        game.scrollLeft = differenceBetweenPlayerAndScroll;

    }



    // Inicia el mapa de movimientos de cada bot, 
    // es decir, inicia las instrucciones que tiene 
    // cada bot.
    static playBots(){
        let bot = '';
        for(bot of Game.enemies){
            // Iniciamos el ciclo que repite el mapa de 
            // movimientos del bot hasta que este muera.
            bot[1].movementsLoop();
        }
    }



    static getObject(element){

        // Obtenemos la etiqueta html del objeto, para 
        // saber en qué mapa buscar el objeto
        const objectTag = element.tagName;
        const objectId = element.getAttribute('id');
        let thisObject = '';
                    
        // Obtenemos el objeto
        if(objectTag == 'PLAYER'){ thisObject = Game.players.get('#' + objectId); }
        else if(objectTag == 'ENEMY'){ thisObject = Game.enemies.get('#' + objectId); }
        else if(objectTag == 'OBSTACLE'){ thisObject = Game.obstacles.get('#' + objectId); }    
        
        return thisObject;

    }


}