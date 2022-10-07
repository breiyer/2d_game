// Clase Player jugable
class PlayerBot extends Player{

    movementsMap = [];

    constructor(posXY, playerType, side, ammo, movementsMap){

        const playerLabel = 'enemy';  // Como es un 
        // jugador NO controlable, su etiqueta HTML 
        // debe ser "enemy".        

        super(posXY, playerType, playerLabel, side, ammo);

        this.velocity += 1;  // Le sumamos 
        // 1 de velocidad a los bot.

        this.itHurts = 'obstacle, player';  // Asignamos los objetos 
        // con lo cuales deben interactuar las balas de este jugador. 
        this.name = playerType;

        // Asignamos el mapa de movimientos
        this.movementsMap = movementsMap;

    }



    async movementsLoop(){

        // While infinito hasta que muera el bot.
        // En cada vuelta se ejecutan secuencialmente 
        // cada uno de los movimientos del mapa de movimientos.
        while(true){ 

            // Iteramos sobre los movimientos
            for(let index in this.movementsMap){
                // Enviamos el movimiento a hacer y esperamos a 
                // que se cumpla la promesa para enviar el 
                // siguiente movimiento.
                let movement = this.movementsMap[index]; 
                index = await this.movementSchedule(movement).then((a) => {
                    return 1;
                });

            }if(this.lifes < 1){ break; }  // Si el bot está muerto, 
            // cerramos el bucle.
        }
    }



    movementSchedule(movement){
        // En la variable "movement", recibimos: 
        // la acción que debe hacer el bot (movement), 
        // con qué retardo la hará (delay), 
        // durante cuánto tiempo lo hará (during), 
        // y con qué frecuencia lo hará (often).

        const thisObject = this;
        // Retornamos una promesa de cuando el movimiento terminó
        return new Promise(function(resolve, reject){

            setTimeout(() => {  // Luego del retardo iniciamos la acción 
    
    
                var movementDuraration = window.setInterval(function(){
    
                    if(thisObject.hurt == 1 || thisObject.lifes < 1){ return; }
    
                    // Identificamos la acción y la emprendemos
                    if(movement['movement'] == 'left' && thisObject.lifes >= 1){
                        thisObject.moveLeft();
                    }else if(movement['movement'] == 'right' && thisObject.lifes >= 1){
                        thisObject.moveRight();
                    }else if(movement['movement'] == 'jump' && 
                             thisObject.jumping != 1 && 
                             thisObject.attacking != 1 && 
                             thisObject.lifes >= 1 && 
                             thisObject.falling != 1){

                        thisObject.playerJump();
                        
                    }else if(movement['movement'] == 'attack' && 
                             thisObject.attacking != 1 && 
                             thisObject.lifes >= 1){

                        thisObject.playerAttack();

                    }else if(movement['movement'] == 'idle'){
                        thisObject.setAnimation('Idle');
                    }
    
                }, movement['often'], thisObject);  // Cada cierto tiempo 
                // emprenderá la acción 
    
                
                // Al acabar la duración de la acción, 
                // la terminamos y colocamos la animación 
                // de inactivo, solo si no está muerto o está 
                // haciendo la animación de sufrir daño.                
                setTimeout(() => {
                    window.clearInterval(movementDuraration);
    
                    if(thisObject.hurt == 1 || thisObject.lifes < 1){ 
                        resolve(1); 
                        return;
                    }
    
                    if(thisObject.jumping != '1' &&  thisObject.attacking != '1' && thisObject.falling != 1){  
                        thisObject.setAnimation('Idle');
                    }
    
                    resolve(1);
                }, movement['during']), thisObject;
    

            }, movement['delay']), thisObject;       

        });

    }
    
}