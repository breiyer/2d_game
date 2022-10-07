class Player{

    id = '';  // Id del objeto en el DOM 
    id2 = '';  // Id del objeto en el DOM sin el # 
    name = '';  // Nombre del personaje, se usa para 
    // agregar las animaciones.
    side = '';  // Lado hacia el cual apunta (derecha/izquierda) 
    hurt = 0;  // Estado recibiendo daño 
    jumping = 0;  // Estado saltando 
    bulletsCont = 0;  // Contador de balas disparadas para agregarles ID 
    attacking = 0;  // Estado atacando 
    falling = 0;  // Estado cayendo 
    lifes = 0;  // Puntos de vida 
    maxLife = 0;  // Vida máxima
    velocity = 0;  // Velocidad 
    ammo = [];  // Array para almacenar las diferentes balas que dispara 
    // Estructura de las balas:
    // {'class':'bullet1', 'velocity':20, 'scope':230, 'cant':4, 'dmg':2, 
    // 'animation':'bullet1 1s 1, bullet1B 1s 1s infinite', 'name':'Munición de plasma'} 
    currentBullet = 0;  // Índice para acceder a la bala seleccionada 
    
    // Límite establecido para que el jugador no se salga del terreno 
    // de juego por el lado derecho.
    lateralLimit = 0;

    // Límite establecido para que el jugador no se salga del terreno 
    // de juego por debajo y, que pueda subirse a obstáculos sin que 
    // la gravedad lo baje del mismo.
    groundLimit = 0;    

    // Cuántos pixees te baja la fuerza de la gravedad 
    // durante cada iteración de la misma.
    gravityValue = 0;

    // A qué grupo de objetos afectan las balas, es decir, con 
    // cuáles explota al contacto. Es un string para un "querySelector".
    itHurts = '';



    // Variables para reducir las Hitbox de los objetos: 
    // al inicio y final de cada eje.
    // Hitbox reduction at the beginning of the X-axis.
    hitBoxSX = 0;
    // Hitbox reduction at the end of the X-axis.
    hitBoxEX = 0;
    // Hitbox reduction at the beginning of the Y-axis.
    hitBoxSY = 0;
    // Hitbox reduction at the beginning of the Y-axis.
    hitBoxEY = 0;




    
    

    // ---- Variables estáticas ----

    // Contador para agregar ID a los jugadores
    static idCont = 1;

    // Contiene los modelos de personajes
    static players = {
        'cyborg':{
            'lifes'    :5, 
            'velocity' :3, 
            'gravity'  :10, 
            'name'      :'cyborg',
            'hitBoxReduction':{
                'SX':10,
                'EX':10,
                'SY':0,
                'EY':5
            }
        },

        'biker':{
            'lifes'    :7, 
            'velocity' :3, 
            'gravity'  :10, 
            'name'     :'biker',
            'hitBoxReduction':{
                'SX':10,
                'EX':10,
                'SY':0,
                'EY':5
            }
        }
    
    }  

    
    

    constructor(posXY, playerType, playerLabel, side, ammo){

        // Asignamos el ID al jugador e incrementamos 
        // el contador de id para jugadores.
        this.id2 = 'player' + Player.idCont;
        this.id = '#' + this.id2;
        Player.idCont ++;        

        playerType = Player.players[playerType];

        // Extraemos la cantidad de vidas del jugador, 
        // velocidad, valor del salto, y valor de la gravedad. 
        this.lifes =  playerType['lifes'];
        this.maxLife =  playerType['lifes'];
        this.velocity =  playerType['velocity']; 
        this.gravityValue =  playerType['gravity'];
        this.name =  playerType['name'];
        
        // Extraemos las Hitbox del jugador
        const hitBoxReduction = playerType['hitBoxReduction'];
        this.hitBoxSX = hitBoxReduction['SX'];
        this.hitBoxEX = hitBoxReduction['EX'];
        this.hitBoxSY = hitBoxReduction['SY'];
        this.hitBoxEY = hitBoxReduction['EY'];


        this.side = side;  // Asignamos dirección


        // Agregamos el objeto al terreno de juego con algunos de sus atributos
        surface.innerHTML += '<' + playerLabel + ' class="' + playerType['name'] + 
        '" id="' + this.id2 + '"></' + playerLabel + '>';
        

        const player = document.querySelector(this.id);
        player.style.left = posXY['X'] + 'px';  // Asignamos posición en X
        player.style.bottom = posXY['Y'] + 'px';  // Asignamos posición en Y
        if(side == 'right'){
            player.style.transform = "rotateY(0deg)";
        }else if(side == 'left'){
            player.style.transform = "rotateY(180deg)";
        }

        // Recorremos la variable parámetro "ammo" para agregar  
        // las balas que tendrá en a la munición inicial.
        var cont = 0;
        for(const index in ammo){
            
            if(cont == parseInt(ammo.length)){ break; }
            cont += 1;

            const bullet = ammo[index]['bullet'];
            this.ammo.push(Ammo.ammo[bullet]);
            // Agregamos el atributo para saber si 
            // la munición en cuestión se está recargando. 
            const currentAmmo = this.ammo[index];
            currentAmmo['reloading'] = 0;

            
        }


        const playerStyle = window.getComputedStyle(player);
        const playerWidth = parseInt(playerStyle.getPropertyValue('width'));
        // Si al width del terreno se le resta el del jugador, 
        // se obtiene el máximo left que tendrá el jugador sin 
        // salir del terreno, esto es "lateralLimit", el límite establecido 
        // para que el jugador no se salga del terreno de juego por el lado derecho.
        this.lateralLimit = Surface.surfaceWidth - playerWidth;


        // Iniciamos la función que simula la física de la gravedad 
        // manteniendo contínuamente a los jugadores en el suelo.
        Player.gravityForce(this);



        // Agregamos la barra de vida
        const lifesBar = document.createElement("div");
        lifesBar.setAttribute('class', 'lifesBar');

        const bar = document.createElement("div");
        bar.setAttribute('class', 'bar');

        lifesBar.appendChild(bar); 
        player.appendChild(lifesBar); 

    }






    // Funciones 
    moveLeft(){

        const game = document.querySelector('#gameContainer');
        const player = document.querySelector(this.id);
        let velocity = this.velocity;
        const playerStyle = window.getComputedStyle(player);
        const playerPosX = parseInt(playerStyle.getPropertyValue('left'));    
        const playerPosY = parseInt(playerStyle.getPropertyValue('bottom'));      

        // Cambiamos la animación y dirección. 
        // Solo hace la animación de movimiento si no está saltando, cayendo, o atacando. 
        if(this.jumping != '1' &&  this.attacking != '1' && this.falling != 1){  
            this.setAnimation('MoveLeft');
        }
        // Cambio de dirección
        this.side = 'left';
        player.style.transform = "rotateY(180deg)"; 
        // Si está saltando o cayendo, el desplazamiento debe ser menor.
        if(this.jumping == '1' || this.falling == 1){
            velocity -= 1; 
        }


        // Calculamos la nueva posición, para ello 
        // primero verificamos si al moverse a la izquierda 
        // hay contacto con un obstáculo, de ser así: 
        // significa que no podemos atraversar al obstáculo, 
        // así que cancelamos el movimiento. 
        // De no ser así: simplemente movemos hacia la izquierda 
        // con el valor de la variable "velocity", que indica cuántos 
        // pixeles avanza por movimieto el jugador.
        const newPosX = parseInt(playerPosX) - velocity;
        const newPosY = playerPosY;
        const contactWith = Game.contactDetect(this, newPosX, newPosY, '#gameContainer > #surface > obstacle');
        // console.log(contactWith);
        if(contactWith){ return; }
            

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
    }



    moveRight(){

        const game = document.querySelector('#gameContainer');
        const player = document.querySelector(this.id);
        let velocity = this.velocity;  // Velocidad del jugador. 
        const playerStyle = window.getComputedStyle(player);
        const playerPosX = parseInt(playerStyle.getPropertyValue('left'));
        const playerPosY = parseInt(playerStyle.getPropertyValue('bottom'));


        // Cambiamos la animación y dirección. 
        // Solo hace la animación de movimiento si no está saltando, cayendo, o atacando. 
        if(this.jumping != '1' &&  this.attacking != '1' && this.falling != 1){  
            this.setAnimation('MoveRight');
        }
        // Cambio de dirección
        this.side = 'right';
        player.style.transform = "rotateY(0deg)"; 
        // Si está saltando o cayendo, el desplazamiento debe ser menor.
        if(this.jumping == '1' || this.falling == 1){
            velocity -= 1; 
        }
    
        
        // Calculamos la nueva posición, para ello 
        // primero verificamos si al moverse a la derecha 
        // hay contacto con un obstáculo, de ser así: 
        // significa que no podemos atraversar al obstáculo, 
        // así que cancelamos el movimiento. 
        // De no ser así: simplemente movemos hacia la derecha el 
        // valor de la variable "velocity", que indica cuántos 
        // pixeles avanza por movimieto el jugador.
        const newPosX = parseInt(playerPosX) + velocity;
        const newPosY = playerPosY;
        const contactWith = Game.contactDetect(this, newPosX, newPosY, '#gameContainer > #surface > obstacle');
        // console.log(contactWith);
        if(contactWith){ return; }


        // Se hace el movimiento sin que salga del terreno.
        // Cuando la nueva posición del jugador sea fuera del 
        // terreno por la derecha, el jugador se mueve justo al límite. 
        if(newPosX > this.lateralLimit){
            player.style.left = this.lateralLimit + 'px';
        }else{
            player.style.left = newPosX + 'px';
        }
    }



    playerJump(){

        // Colocamos el estado saltando
        this.jumping = 1;
        // Cambiamos la animación
        this.setAnimation('Jump');


        // Colocamos el estado atacando ya que 
        // mientras salta no puede atacar, solo 
        // cuando cae.
        this.attacking = 1;

        // Invertimos la gravedad para que en vez de caer 
        // suba, y parezca que salta.
        // Antes se disminuye su valor para que 
        // no suba mucho.
        const originalValue = this.gravityValue;
        this.gravityValue = 5;
        this.gravityValue *= -1;
        
        // Quitamos el estado saltando cuando hayan 
        // pasado .7s que es lo que demora el salto.
        // También quitamos el estado atacando para 
        // que pueda atacar durante la caída.
        // Activamos el estado cayendo.
        // Y devolvemos la polaridad de la 
        // gravedad a positiva para que caiga, 
        // también le devolvemos su valor original.
        setTimeout(() => {

            this.jumping = 0;
            this.falling = 1;
            this.attacking = 0;
            this.gravityValue *= -1;
            this.gravityValue = originalValue;
    
            if(this.lifes >= 1){
                Player.fallAfterJump(this);
            }

        }, 700, originalValue);

    }



    playerAttack(){

        // Disparamos el proyectil si hay munición 
        const activeBullet = this.ammo[this.currentBullet];
        let bulletAmmo = activeBullet['cant'];
        // Si no queda munición de la bala activa, 
        // o está en cooldown, retornamos.
        if(bulletAmmo < 1 || activeBullet['reloading'] == 1){ return; }


        // Colocamos el estado atacando
        this.attacking = 1;

        // Restamos 1 a la munición
        bulletAmmo -= 1;

        // Sumamos 1 al contador de balas y le agregamos id a la bala
        this.bulletsCont += 1;
        let bulletId = this.id2 + 'Bullet' + this.bulletsCont; 

        
        // Disparamos la bala
        const shoot = new Ammo(this, bulletId, activeBullet['name']);

        // Cambiamos la animación
        this.setAnimation('Attack');
        // Tras .5s que demora la animación, quitamos el estado atacando 
        setTimeout(() => {        

            this.attacking = 0; 
            this.setAnimation('Idle');

        }, 500);

        // Agregamos el estado recargando a la munición disparada 
        activeBullet['reloading'] = 1;
        // Cuando se acabe el cooldown que tiene la munición 
        // disparada, le quitamos el estado recargando.
        setTimeout(() => {

            activeBullet['reloading'] = 0;

        }, activeBullet['reload'], activeBullet);
      
    }

    

    changeAmmo(num){
        // La munición está almacenada en el array "ammo", 
        // para acceder al tipo de munición que queremos 
        // disparar, utilizamos la variable "currentBullet" 
        // de tal forma que: cuando disparan, la bala (tipo 
        // de munición) disparada es la que se encuentra en el 
        // índice al cual apunta la variable "currentBullet", 
        // entonces, para cambiar de munición solo cambiamos el 
        // valor de la variable "currentBullet" a un índice que 
        // exista en el array "ammo", si el índice no existe, retornamos.
        if(this.ammo.length <= (num - 1)){
            return;
        }
        // Hacemos el cambio de munición 
        this.currentBullet = num - 1;
    }



    setAnimation(animation){


        const player = document.querySelector(this.id);
        const thisObject = this;
    
    
        if(animation == 'MoveRight' && this.lifes > 0){
            player.style.transform = "rotateY(0deg)";
            player.style.animation = this.name + 'Move 1s infinite';
        }else if(animation == 'MoveLeft' && this.lifes > 0){
            player.style.transform = "rotateY(180deg)"; 
            player.style.animation = this.name + 'Move 1s infinite';
        }else if(animation == 'Idle' && this.lifes > 0){
            player.style.animation = this.name + 'Idle 1.3s infinite';
        }else if(animation == 'Jump' && this.lifes > 0){
            player.style.animation = this.name + 'Jump 1s infinite';
        }else if(animation == 'Attack' && this.lifes > 0){
            player.style.animation = this.name + 'Attack .5s';
        }else if(animation == 'Hurt' && this.lifes > 0){
            player.style.animation = this.name + 'Hurt .8s';
    
            // Colocamos el estado hurt
            this.hurt = 1;
    
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
            player.style.animation = this.name + 'Death 1.3s 1';
            player.classList.add("death");
            const lifesBar = document.querySelector(this.id + ' > .lifesBar');
            lifesBar.remove();
    
            // Quitamos las animaciones luego de los 
            // 1.3s que tarda la animación de muerte.
            // Y si el jugador es el principal, entonces 
            // terminamos el juego.
            setTimeout(() => {
    
                const player = document.querySelector(this.id);
                player.style.animation = 'none';
    
                
                // Terminamos el juego
                const objectTag = player.tagName;
                if(objectTag == 'PLAYER'){ Game.finished = true; }
    
            }, 1300, this);        
            
        }
    }



    removeLife(){

        const object = document.querySelector(this.id);
    
        // Se calcula el nuevo porcentaje de vida tras sufrir daño
        let percent = this.lifes / this.maxLife;
        percent *= 100;
    
        // Si es menor a cero, entonces lo dejamos en cero
        if(percent < 0){ percent = 0; }
    
        const lifesBar = document.querySelector(this.id + ' > .lifesBar');
        lifesBar.style.animation = "lifesBarHurt .4s 2";    
    
        const bar = document.querySelector(this.id + ' > .lifesBar > .bar');
        bar.style.width = percent + '%';
    
        // Pasados .8s quitamos la animación
        setTimeout(() => {
    
            lifesBar.style.animation = "none";            
    
        }, 800, lifesBar);            
    
    
    }    



    takeDamage(dmg){
    
        // Si ya no tiene vidas, retornamos
        if(this.lifes < 1){ return; }
    
        // Restamos vida al objeto y a su barra de vida
        this.lifes -= dmg;
        this.removeLife();
    
        // Si el objecto está sin vidas, lo enviamos a su animación death
        if(this.lifes < 1){ 
            this.setAnimation('Death');
        }else{
            this.setAnimation('Hurt');
        }
        
    }    






    // Funciones estáticas: 
    // Se colocaron estáticas porqué funcionan con un 
    // setInterval. Sucede que dentro de un setInterval 
    // no puedes usar la sentencia "this" para llamar a 
    // la clase, porqué el programa entiende que ese this 
    // es para llamar al objeto setInterval. Entonces, se 
    // le debe pasar por parámetro el this de la clase 
    // que pretendes llamar, utilizando una variable que 
    // apunte al this de tu clase, de esta forma: 
    // const thisDeTuClase = this;
    // gravityForce(thisDeTuClase);
    
    static gravityForce(thisObject){
        // Esta función tiene un setInterval que se 
        // se ejecuta cada .1s, y lo que hace es 
        // descender/bajar al objeto en el eje Y hasta 
        // que toque el suelo, cada objeto tiene un 
        // atributo "groundLimit" que indica la posición 
        // del suelo en el eje Y. Así mismo, cada objeto 
        // tiene un atributo "gravityValue" que indica 
        // cuánto debe bajar el objeto en cada iteración. 
        // Adicional, una vez se llama a esta función, 
        // solo se detiene su ejecución si el objeto 
        // muere y no está suspendido en el aire.


        const gravity = setInterval(function(){

            // Si está saltando le colocamos la 
            // animación de salto.
            if(thisObject.jumping == 1){ thisObject.setAnimation('Jump'); }

            // Para saber si está suspendido
            let notSuspended = false;

            const player = document.querySelector(thisObject.id);
            const playerStyle = window.getComputedStyle(player);
            const playerPosY = parseInt(playerStyle.getPropertyValue('bottom'));
            const playerPosX = parseInt(playerStyle.getPropertyValue('left'));

            let newPosY = playerPosY - thisObject.gravityValue;
            let newPosX = playerPosX;
            
            // Verificamos si en la próxima posición que tomará 
            // el objeto (debido a la fuerza de la gravedad) este 
            // entra en contacto con un objeto, de ser así significa 
            // que al descender se encontró con un obstáculo, por lo cual 
            // no debe descender ya que provocaría que este se solape con 
            // el objeto, así que re-posicionamos justo arriba del obstáculo.

            // Ahora, sucede que para saltar se es recursivo con esta función, 
            // es invertida la fuerza de la gravedad para que en vez de 
            // descender, suba, por lo cual al encontrar contacto si la fuerza 
            // de la gravedad es negativa, significa que está saltando, por lo 
            // cual en vez de reposicionar justo arriba del objeto con el que se 
            // tendrá contacto, lo que se hará es anular este movimiento retornando.
            const contactWith = Game.contactDetect(thisObject, newPosX, newPosY, '#gameContainer > #surface > obstacle');
            if(contactWith){ 

                // Quitamos el estado cayendo.
                thisObject.falling = 0; 

                const element = document.querySelector('#' + contactWith);
                const elementStyle = window.getComputedStyle(element);
                const elementPosY = parseInt(elementStyle.getPropertyValue('bottom'));
                const elementHeight = parseInt(elementStyle.getPropertyValue('height'));

                if(thisObject.gravityValue > 0){ 
                    newPosY = elementPosY + elementHeight + 1; 
                    notSuspended = true;  // Se le coloca el 
                    // estado "NO suspendido", ya que está 
                    // arriba de un obstáculo.
                }else if(thisObject.gravityValue < 0){ return; }
                
            }


            // Si la próxima posición del objeto es debajo del suelo, 
            // entonces es reposicionado justo al límite del suelo, 
            // al igual que se hace para que el objeto no salga del 
            // terreno de juego por la derecha, y se le coloca el 
            // estado "NO suspendido", ya que está tocando suelo.
            if(newPosY < thisObject.groundLimit){
                player.style.bottom = thisObject.groundLimit + 'px';
                notSuspended = true;
            }else{
                player.style.bottom = newPosY + 'px'; 
            }


            // Si el objeto tocó el suelo o la superficie de un 
            // obstáculo, y está muerto, entonces detenemos el 
            // bucle de la fuerza de la gravedad, ya que el 
            // cuerpo no está suspendido en el aire.
            if(notSuspended && thisObject.lifes < 1){ clearInterval(gravity); }

            // console.log(playerPosY, '-', thisObject.gravityValue, thisObject.jumping);
            
            
        }, 100, thisObject);

    }



    static fallAfterJump(thisObject){

        // Después de saltar, debe caer, con esta 
        // función se detecta cuando el jugador 
        // dejó de caer después de haber saltado 
        // y retira el estado. 
        // La función "gravityForce" también lo detecta y 
        // puede retirar el estado, esto lo hace cuando 
        // detecta que en la próxima pos en Y del jugador, 
        // este caerá arriba de un obstáculo, por lo que 
        // retira el estado "cayendo" y reposiciona al 
        // jugador para que no atraviese al obstáculo.



        var falling = window.setInterval(function(){

            const player = document.querySelector(thisObject.id);
            const playerStyle = window.getComputedStyle(player);
            const playerPosY = parseInt(playerStyle.getPropertyValue('bottom'));


            // Si está en el suelo, y además no 
            // está atacando ni saltando, entonces 
            // se puede colocar la animación de 
            // inactividad y retirar el estado cayendo.
            if(playerPosY == thisObject.groundLimit && 
               thisObject.attacking != 1 && 
               thisObject.jumping != 1 ||  
               thisObject.falling == 0){


                thisObject.falling = 0;

                thisObject.setAnimation('Idle');
                window.clearInterval(falling);
                
            }

            // console.log(playerPosY, '-', thisObject.gravityValue, thisObject.jumping);
            
            
        }, 100, thisObject);

    }


}

