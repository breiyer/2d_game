class Ammo{

    id = '';  // Id de la bala cuando sea disparada 
    clasS = '';  // Clase de la bala 
    velocity = 0;  // Velocidad de la bala 
    scope = 0;  // Alcance de la bala 
    dmg = 0;  // Daño de la bala 
    reload = 0;  // Cooldown de la bala 
    audio = '';  // Audio de la bala 
    animation = '';  // Animación de la bala 
    name = '';  // Nombre de la bala 
    route = 0;  // Espacio recorrido por la bala 
    side = '';  // Dirección de la bala (left-right)
    originX = 0;  // Pos de origen en el eje X de la bala 
    rotate = '';  // Cuánto debe rotar la bala si su 
    // dirección es left
    gravityValue = 0;  // Cuánto afecta la gravedad a la bala 


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


    constructor(thisPlayer, bulletId, bulletType){
        
        this.id = bulletId;
        bulletType = Ammo.ammo[bulletType];

        // Extraemos la clase de la bala, su velocidad, nombre, 
        // alcance, daño, animación y cantidad que se tiene. 
        this.clasS = bulletType['class']; 
        this.name = bulletType['name'];
        this.animation = bulletType['animation'];
        this.velocity = bulletType['velocity'];
        this.scope = bulletType['scope'];
        this.dmg = bulletType['dmg'];
        this.audio = new Audio('sounds/ammo/' + bulletType['audio']);
        
        // Extraemos las Hitbox de la bala
        const hitBoxReduction = bulletType['hitBoxReduction'];
        this.hitBoxSX = hitBoxReduction['SX'];
        this.hitBoxEX = hitBoxReduction['EX'];
        this.hitBoxSY = hitBoxReduction['SY'];
        this.hitBoxEY = hitBoxReduction['EY'];
        
        // Definimos con qué objetos va a interactuar la bala
        this.itHurts = thisPlayer.itHurts;
        

        const player = document.querySelector(thisPlayer.id);
        const playerStyle = window.getComputedStyle(player);
        const playerWidth = parseInt(playerStyle.getPropertyValue('width'));
        const playerPosX = parseInt(playerStyle.getPropertyValue('left'));   
        const playerHeight = parseInt(playerStyle.getPropertyValue('height'));
        const playerPosY = parseInt(playerStyle.getPropertyValue('bottom'));        


        const surfaceWidth = Surface.surfaceWidth;
        const surfaceId = Surface.id;    
        const surface = document.querySelector(surfaceId); 
    
    
        // La posición y dirección de la bala en el eje X depende del lado 
        // hacia el que está mirando el personaje.
        // Si está mirando hacia la derecha: la bala se desplaza hasta la posición derecha  
        // jugador -10px para dejar espacio.
        // Pero si está mirando hacia la izquierda: la bala se desplaza hasta la posición izquierda  
        // jugador -10px para dejar espacio.
        if(thisPlayer.side == 'right'){
            this.originX = playerPosX + playerWidth - 10;
            this.side = 'right';
        }else if(thisPlayer.side == 'left'){ 
            this.originX = playerPosX - playerWidth - 10;
            this.rotate = "rotate(180deg)";
            this.side = 'left';
        }

    
        // Agregamos la bala al terreno de juego con algunos de sus atributos
        surface.innerHTML += '<bullet class="' + this.clasS + '" id="' + this.id + 
        '" name="' + this.name + '"></bullet>';

        // Agregamos el # al ID
        this.id = '#' + bulletId;

    
        // Agregamos la animación, posición y, dirección
        const bullet = document.querySelector(this.id);
        const bulletStyle = window.getComputedStyle(bullet);
        const bulletHeight = parseInt(bulletStyle.getPropertyValue('height'));
        bullet.style.transform = this.rotate;
        // La posición de la bala en el eje Y se calcula subiendo a la bala al 
        // 60% de la altura del personaje, de esta forma quedaría casi 
        // a la altura del pecho del personaje, y luego bajándola a la mitad de  
        // la altura de la bala misma. 
        // Se debe sumar la posición en Y del jugador porqué si está saltando 
        // la bala no solo debe ser subida a la altura del jugador, si no que 
        // también a la altura a la cual saltó el jugador. 
        const originPosYBullet = (playerPosY + playerHeight * 0.60) - (bulletHeight / 2);
        bullet.style.bottom = originPosYBullet + "px";
        bullet.style.left = this.originX + "px";
        bullet.style.animation = this.animation;
    
        // Agregamos desplazamiento y velocidad
        // Agregamos vida, comportamiento a la bala !
        // También enviamos la referencia thisPlayer de la 
        // clase mediante una variable, para que pueda 
        // ser usada en el "setInterval".
        this.shootBullet(surfaceWidth, thisPlayer);
        // Player.gravityForce(this);
    }



    explode(){
        
        const bulletId = this.id;
        const bullet = document.querySelector(this.id);
        const bulletClass = bullet.className;

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



    shootBullet(surfaceWidth, thisPlayer){

        // https://www.youtube.com/c/ISAoGameMusic
        const thisBullet = this;
        // Agregamos la bala disparada al mapa de 
        // valas disparadas.
        Game.bullets.set(this.id, this);
        // Se reproduce el sonido del disparo
        this.audio.play();
        // Iniciamos el ciclo de vida de la bala
        var bulletLife = window.setInterval(function(){
    
            var nextBulletPosX = 0;
        
            const bullet = document.querySelector(thisBullet.id);
        
            const bulletStyle = window.getComputedStyle(bullet);
            const bulletPosX = parseFloat(bulletStyle.getPropertyValue('left')); 
            const bulletPosY = parseFloat(bulletStyle.getPropertyValue('bottom')); 
            const bulletWidth = parseFloat(bulletStyle.getPropertyValue('width')); 
            const LateralLimit = surfaceWidth - bulletWidth;
            // El "LateralLimit" funciona igual que con el jugador para que 
            // no salga del terreno.
            
            // El atributo "itHurts" es un "querySelector" con 
            // los objetos que deben interactuar con la bala.
            const groupToScan = thisBullet.itHurts;
            let contactWith = Game.contactDetect(thisBullet, bulletPosX, bulletPosY, groupToScan);
        
            if(contactWith){
                thisBullet.explode();
                
                
                // Obtenemos el objeto y el elemento 
                // y le ocasionamos el daño.
                const element = document.querySelector('#' + contactWith);
                const thisObject1 = Game.getObject(element);
                thisObject1.takeDamage(thisBullet.dmg);             

                // thisBullet.gravityValue = 0;

                // Recorremos a todos los objetos que interactúan 
                // con la bala, para saber si durante la explosión 
                // alguno tuvo contacto con ella, de ser así, le 
                // activamos la animación "Hurt" y esta misma le 
                // resta vida correspondiente al daño de la bala.
                document.querySelectorAll(thisBullet.itHurts).forEach(element => {
                    
                    // Obtenemos el objeto
                    const thisObject = Game.getObject(element);
                    
                    // Si el objeto no tiene vidas, lo ignoramos (retornamos)
                    // Y si es el mismo objeto que activó la explosión (al que 
                    // la bala le pegó en primer lugar), también lo ignoramos.
                    if(thisObject.lifes < 1 || thisObject == thisObject1){ return; }

                    // Verificamos si el objeto está en contacto 
                    // con la explosión de la bala.
                    const object = document.querySelector(thisObject.id);
                    const objectStyle = window.getComputedStyle(object);
                    const objectPosX = parseFloat(objectStyle.getPropertyValue('left')); 
                    const objectPosY = parseFloat(objectStyle.getPropertyValue('bottom')); 
                    let contactWith = Game.contactDetect(thisObject, objectPosX, objectPosY, thisBullet.id);

                    // console.log(objectPosX, objectPosY)
                    // De estar en contacto con la explosión de la bala, 
                    // le inflingimos daño.
                    if(contactWith){
                        thisObject.takeDamage(thisBullet.dmg);
                    }
                    
                }, thisBullet, thisObject1);
                // Terminamos el ciclo de vida de la bala
                window.clearInterval(bulletLife);

            }else{
                
                // Dependiendo del lado al cual apunta la bala, su trayectoria es calculada 
                // de forma diferente.
                if(thisBullet.side == 'right'){
        
                    nextBulletPosX = bulletPosX + thisBullet.velocity;
        
                    // Si la próxima posición de la bala es fuera del terreno, 
                    // entonces la bala es reubicada justo al límite del terreno y 
                    // luego es detonada. 
                    // Y si la próxima posición de la bala es fuera de su
                    // rango, solo es detonada.
                    if(nextBulletPosX > LateralLimit){
                        bullet.style.left = LateralLimit + 'px';
                        thisBullet.explode();
                        thisBullet.gravityValue = 0;
                        window.clearInterval(bulletLife);
                    }else if(thisBullet.route > thisBullet.scope){
                        thisBullet.explode();
                        thisBullet.gravityValue = 0;
                        window.clearInterval(bulletLife);               
                    }else{
                        bullet.style.left = nextBulletPosX + 'px';
                        thisBullet.route += thisBullet.velocity;
                    }
        
                }else if(thisBullet.side == 'left'){
        
                    nextBulletPosX = bulletPosX - thisBullet.velocity;
        
                    // Si la próxima posición de la bala es fuera del terreno, 
                    // entonces la bala es reubicada justo al límite del terreno y 
                    // luego es detonada. 
                    // Y si la próxima posición de la bala es fuera de su
                    // rango, solo es detonada.
                    if(nextBulletPosX < 0){
                        bullet.style.left = '0px';
                        thisBullet.explode();
                        thisBullet.gravityValue = 0;
                        window.clearInterval(bulletLife);
                    }else if(thisBullet.route > thisBullet.scope){
                        thisBullet.explode();
                        thisBullet.gravityValue = 0;
                        window.clearInterval(bulletLife);
                    }else{
                        bullet.style.left = nextBulletPosX + 'px';
                        thisBullet.route += thisBullet.velocity;
                    }  
        
                }
        
            }
        
        }, 100, surfaceWidth, thisBullet, thisPlayer);

    }


    static ammo = {
        'Plasma Beam':{
            'class'    :'bullet1', 
            'velocity' :20, // 20
            'scope'    :230, 
            'dmg'      :2, 
            'reload'   :800, 
            'audio'    :'Plasma Beam.mp3',
            'animation':'bullet1 1s 1, bullet1B 1s 1s infinite', 
            'name'     :'Plasma Beam',
            'hitBoxReduction':{
                'SX':0,
                'EX':15,
                'SY':10,
                'EY':10
            }
        }, 

        'Incendiary Bullet':{
            'class'    :'bullet2', 
            'velocity' :35, // 35 
            'scope'    :100, 
            'dmg'      :3, 
            'reload'   :1200, 
            'audio'    :'Incendiary Bullet.wav',
            'animation':'bullet2 1s infinite, bullet2B 1s 1s infinite', 
            'name'     :'Incendiary Bullet',
            'hitBoxReduction':{
                'SX':0,
                'EX':20,
                'SY':25,
                'EY':25
            }
        }, 

        'Exotic Ammo':{
            'class'    :'bullet3', 
            'velocity' :15,  // 15
            'scope'    :300, 
            'dmg'      :3, 
            'reload'   :2000, 
            'audio'    :'Exotic Ammo.wav',
            'animation':'bullet3 .5s 1, bullet3B .3s .5s infinite', 
            'name'     :'Exotic Ammo',
            'hitBoxReduction':{
                'SX':0,
                'EX':17,
                'SY':25,
                'EY':25
            }
        }, 

        'Cathode rays':{
            'class'    :'bullet4', 
            'velocity' :25,  // 25
            'scope'    :200, 
            'dmg'      :2, 
            'reload'   :600, 
            'audio'    :'Cathode rays.wav',
            'animation':'bullet4 1s 1, bullet4B 1s 1s infinite', 
            'name'     :'Cathode rays',
            'hitBoxReduction':{
                'SX':0,
                'EX':17,
                'SY':18,
                'EY':18
            }
        }
    
    }

}