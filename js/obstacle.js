class Obstacle{


    id = '';
    lifes = '';
    clasS = '';  // Clase que se 
    // le agregará al elemento HTML.
    tag = '';  // Etiqueta HTML que tendrá 
    // el elemento.
    name = '';  // Nombre del obstáculo
    unbreakable = '';  // Si es irrompible o no
    width = '';
    height = '';
    img = '';
    img50 = '';  // Imagen cuando quede 
    // un 50% de vida 
    img25 = '';  // Imagen cuando quede 
    // un 25% de vida 
    maxLife = 0;  // Vida máxima
    side = '';  // Aunque no tengan side, se 
    // coloca para que en la función donde detecta 
    // si hay contacto, no envíe error porqué el objeto 
    // obstacle no tiene este atributo.

    // Con qué grupo de objetos interactúa.
    // Es un string para un "querySelector".
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

    // Contador para agregar ID a los obstáculos
    static idCont = 1;

    // Contiene los modelos de obstáculos
    static obstacles = {
        'Metalic Box':{
            'class'       :'obstacle2', 
            'tag'         :'obstacle', 
            'lifes'       :10, 
            'unbreakable' :false, 
            'img'         :'assets/obstacles/obstacle2/1.png', 
            'img50'       :'assets/obstacles/obstacle2/2.png', 
            'img25'       :'assets/obstacles/obstacle2/3.png', 
            'width'       :'30px', 
            'height'      :'30px', 
            'name'        :'Metalic Box',
            'hitBoxReduction':{
                'SX':0,
                'EX':0,
                'SY':0,
                'EY':0
            }
        },
        'Metalic Box I':{
            'class'       :'obstacle4', 
            'tag'         :'obstacle', 
            'lifes'       :1, 
            'unbreakable' :true, 
            'img'         :'assets/obstacles/obstacle4/1.png', 
            'img50'       :'assets/obstacles/obstacle4/2.png', 
            'img25'       :'assets/obstacles/obstacle4/3.png', 
            'width'       :'30px', 
            'height'      :'30px', 
            'name'        :'Metalic Box I',
            'hitBoxReduction':{
                'SX':0,
                'EX':0,
                'SY':0,
                'EY':0
            }
        },
        'Vortex':{
            'class'       :'obstacle3', 
            'tag'         :'vortex', 
            'lifes'       :1, 
            'unbreakable' :true, 
            'img'         :'assets/obstacles/obstacle3/1.png', 
            'img50'       :'assets/obstacles/obstacle3/1.png', 
            'img25'       :'assets/obstacles/obstacle3/1.png', 
            'width'       :'40px', 
            'height'      :'40px', 
            'name'        :'Vortex',
            'hitBoxReduction':{
                'SX':10,
                'EX':10,
                'SY':10,
                'EY':10
            }
        }
    
    }    





    constructor(posXY, obstacleType){
        
        // Asignamos el ID al obstáculo e incrementamos 
        // el contador de id para obstáculos.
        this.id = 'obstacle' + Obstacle.idCont;
        Obstacle.idCont ++;

        obstacleType = Obstacle.obstacles[obstacleType];

        // Extraemos la clase del obstáculo, su tag, cantidad de vidas, 
        // nombre, imagen y HitBox. 
        this.clasS = obstacleType['class']; 
        this.tag = obstacleType['tag']; 
        this.name = obstacleType['name'];
        this.lifes = obstacleType['lifes'];
        this.unbreakable = obstacleType['unbreakable'];
        this.maxLife =  obstacleType['lifes'];
        this.width = obstacleType['width'];
        this.height = obstacleType['height'];
        this.img = obstacleType['img'];
        this.img50 = obstacleType['img50'];
        this.img25 = obstacleType['img25'];
        
        // Extraemos las Hitbox del obstáculo
        const hitBoxReduction = obstacleType['hitBoxReduction'];
        this.hitBoxSX = hitBoxReduction['SX'];
        this.hitBoxEX = hitBoxReduction['EX'];
        this.hitBoxSY = hitBoxReduction['SY'];
        this.hitBoxEY = hitBoxReduction['EY'];
        
        // Definimos con qué objetos va a 
        // interactuar el obstáculo (además 
        // de los jugadores)
        this.itHurts = 'bullet';
        

        // Agregamos el objeto al terreno de juego con algunos de sus atributos
        surface.innerHTML += '<' + this.tag + ' class="' + this.clasS + '" id="' + this.id + 
        '" name="' + this.name + '"></' + this.tag + '>';

        // Agregamos el # al ID
        this.id = '#' + this.id;

        const obstacle = document.querySelector(this.id);
        obstacle.style.left = posXY['X'] + 'px';  // Asignamos posición en X
        obstacle.style.bottom = posXY['Y'] + 'px';  // Asignamos posición en Y
        obstacle.style.width = this.width;  // Asignamos width
        obstacle.style.height = this.height;  // Asignamos height
        obstacle.style.backgroundImage = "url('" + this.img + "')";  // Asignamos imagen

    }



    setAnimation(animation){
        const thisObject = this;
        const obstacle = document.querySelector(this.id);
        const obstacleClass = obstacle.className;
    
        if(animation == 'Hurt'){
            obstacle.style.animation = obstacleClass + 'Hurt .5s 1';
    
            // Quitamos la animación luego de los .5s que tarda.
            // Por una extraña razón al dejar la animación puesta, 
            // esta se repetía al volver a disparar aunque no se llamase 
            // a la función (también sucede con las balas, sus animaciones 
            // se resetean cuando el DOM es actualizado).
            setTimeout(() => {
                document.querySelector(thisObject.id).style.animation = 'none';
                obstacle.style.backgroundImage = "url('" + this.img + "')";  // Asignamos imagen 
                // por si hubo un cambio de imagen
            }, 500, thisObject);      
    
    
        }else if(animation == 'Death'){
            obstacle.style.display = 'none';
        }
    }    



    takeDamage(dmg){
    
        // Si ya no tiene vidas, retornamos
        if(this.lifes < 1 || this.unbreakable){ return; }
    
        // Restamos vida al objeto
        this.lifes -= dmg;


        // Si la vida cae al 50%, actualizamos su imagen 
        // a la imagen de cuando tenga el 50% de vida.
        // Lo mismo cuando su vida caiga al 25%.
        if(this.lifes/this.maxLife <= .5){
            this.img = this.img50;
        }if(this.lifes/this.maxLife <= .25){
            this.img = this.img25;
        }        
    
        // Si el objecto está sin vidas, lo enviamos a su animación death
        if(this.lifes < 1){ 
            this.setAnimation('Death');
        }else{
            this.setAnimation('Hurt');
        }
        
    }        

}