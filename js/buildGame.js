// Cuando cargue la página revelamos el botón para 
// construir el juego.
window.onload = function(){

    document.querySelector('#loadingScreenContainer > #playButton').style.display = 'block';

}


const gamePlayers = Game.players;
const gameEnemies = Game.enemies;
const gameObstacles = Game.obstacles;


let posXY = {'X':0, 'Y':0}
let playerType = 'cyborg';
let ammo = [{'bullet':'Plasma Beam'}, {'bullet':'Incendiary Bullet'}]


let playerMain = '';


function addPlayers(){
    return new Promise(function(resolve, reject){
        
        // Jugadores controlables
        posXY = {'X':100, 'Y':0}
        playerType = 'cyborg';
        ammo = [{'bullet':'Plasma Beam'}, {'bullet':'Incendiary Bullet'}]
        const player = new PlayerMain(posXY, playerType, 'right', ammo);
        TouchControl.player = player;  // Asignamos al jugador para ser 
        // controlado por los controles táctiles.

        if(isMobileDevice()){  // Si es un dispositivo móvil:
            // mapeamos los controles táctiles.
            TouchControl.start();   
        }     

        playerMain = player;  // Asignamos al jugador para 
        // que el reloj pare cuando este muera.
        gamePlayers.set(player.id, player);    

        // Para que no sea instantáneo y se 
        // puedan ver los mensajes de carga.
        setTimeout(() => { 
            resolve(1);
        }, 500);         

    });
}



function addEnemies(){
    return new Promise(function(resolve, reject){

        // Jugadores bot
        const enemy1Movements = [{'movement':'attack', 'often':700,  'during':1400,  'delay':300},
                                 {'movement':'left',   'often':50,   'during':2000,  'delay':500},
                                 {'movement':'attack', 'often':600,  'during':600,   'delay':100},
                                 {'movement':'right',  'often':50,   'during':2000,  'delay':500},
                                 {'movement':'left',   'often':100,  'during':200,   'delay':0}
                                ]
        posXY = {'X':370, 'Y':0}
        playerType = 'biker';
        ammo = [{'bullet':'Cathode rays'}]
        const enemy1 = new PlayerBot(posXY, playerType, 'left', ammo, enemy1Movements);
        gameEnemies.set(enemy1.id, enemy1);


        const enemy2Movements = [{'movement':'attack', 'often':2000,  'during':2100,  'delay':0}]
        posXY = {'X':470, 'Y':0}
        playerType = 'biker';
        ammo = [{'bullet':'Incendiary Bullet'}]
        const enemy2 = new PlayerBot(posXY, playerType, 'right', ammo, enemy2Movements);
        gameEnemies.set(enemy2.id, enemy2);


        const enemy3Movements = [{'movement':'attack', 'often':100,  'during':120,  'delay':0},
                                 {'movement':'jump',   'often':100,  'during':120,  'delay':0},
                                 {'movement':'',       'often':1400, 'during':1420, 'delay':0}
                                ]
        posXY = {'X':750, 'Y':0}
        playerType = 'biker';
        ammo = [{'bullet':'Exotic Ammo'}]
        const enemy3 = new PlayerBot(posXY, playerType, 'left', ammo, enemy3Movements);
        gameEnemies.set(enemy3.id, enemy3);
        



        // Para que no sea instantáneo y se 
        // puedan ver los mensajes de carga.
        setTimeout(() => { 
            resolve(1);
        }, 500);              

    });   
}



function addObstacles(){
    return new Promise(function(resolve, reject){

        // Obstáculos
        posXY = {'X':400, 'Y':0}
        const obstacle1 = new Obstacle(posXY, 'Metalic Box I');
        gameObstacles.set(obstacle1.id, obstacle1);

        
        posXY = {'X':430, 'Y':30}
        const obstacle2 = new Obstacle(posXY, 'Metalic Box');
        gameObstacles.set(obstacle2.id, obstacle2);

        
        posXY = {'X':460, 'Y':60}
        const obstacle3 = new Obstacle(posXY, 'Metalic Box');
        gameObstacles.set(obstacle3.id, obstacle3);

        
        posXY = {'X':490, 'Y':90}
        const obstacle4 = new Obstacle(posXY, 'Metalic Box');
        gameObstacles.set(obstacle4.id, obstacle4);


        posXY = {'X':550, 'Y':90}
        const obstacle5 = new Obstacle(posXY, 'Metalic Box');
        gameObstacles.set(obstacle5.id, obstacle5);

        
        posXY = {'X':580, 'Y':60}
        const obstacle6 = new Obstacle(posXY, 'Metalic Box');
        gameObstacles.set(obstacle6.id, obstacle6);

        
        posXY = {'X':610, 'Y':30}
        const obstacle7 = new Obstacle(posXY, 'Metalic Box');
        gameObstacles.set(obstacle7.id, obstacle7);

        
        posXY = {'X':640, 'Y':0}
        const obstacle8 = new Obstacle(posXY, 'Metalic Box I');
        gameObstacles.set(obstacle8.id, obstacle8);
        
        
        // Vortex
        posXY = {'X':240, 'Y':22}
        const vortex1 = new Vortex(posXY, '', true, 'player, enemy');
        gameObstacles.set(vortex1.id, vortex1);

        
        posXY = {'X':500, 'Y':150}
        const vortex2 = new Vortex(posXY, vortex1.id, true, 'player, enemy');
        gameObstacles.set(vortex2.id, vortex2);     
        
        
        // where para el vortex1.
        vortex1.where = vortex2.id;

        // Para que no sea instantáneo y se 
        // puedan ver los mensajes de carga.
        setTimeout(() => { 
            resolve(1);
        }, 500);        

    });   
}



function loadingKeyFrames(){
    return new Promise(function(resolve, reject){

        let loadKeyFrames = document.createElement("div");

        loadKeyFrames.setAttribute('id', 'loadKeyFrames');
        const loadingScreenContainer = document.querySelector('#loadingScreenContainer');

        const keyFrames = ['cyborgMove', 'cyborgIdle', 'cyborgJump', 
                           'cyborgAttack', 'cyborgHurt', 'cyborgDeath', 
                           'bikerMove', 'bikerIdle', 'bikerJump', 
                           'bikerAttack', 'bikerHurt', 'bikerDeath', 
                           'bullet1', 'bullet1B', 'bullet1Explosion',
                           'bullet2', 'bullet2B', 'bullet2Explosion', 
                           'bullet3', 'bullet3B', 'bullet3Explosion', 
                           'bullet4', 'bullet4B', 'bullet4Explosion',
                           'obstacle2Hurt'];


        let keyFrame = 0;
        let index = 0;


        for(index of keyFrames){
            keyFrame = document.createElement("div");
            keyFrame.style.animation = index + ' 1s infinite';
            loadKeyFrames.appendChild(keyFrame); 
        }

        loadingScreenContainer.appendChild(loadKeyFrames);
        

        // Para que de tiempo a cargar los keyframe, 
        // luego eliminamos el su contenedor.
        setTimeout(() => { 
            resolve(1);
            loadKeyFrames.remove();
        }, 3000, loadKeyFrames);          
       

    });   
}



function startGame(){

    // Quitamos la pantalla de carga
    document.querySelector('#loadingScreenContainer').style.display = 'none';

    // Iniciamos los movimientos de los bots
    Game.playBots();    

    // Activamos la música
    toggleMusic();

    // Iniciamos el reloj
    startClock(playerMain);


    // Condición para que el juego se termine
    const gameEndCondition = setInterval(function(){

        let allDead = true;
        for(let enemy of Game.enemies){
            if(enemy[1].lifes > 0){ allDead = false; }
        }
      
        if(allDead == true || Game.finished == true){ 
            // console.log(allDead, Game.finished)
            Game.finished = true; 
            alert('Ganaste o te mataron, sabrá Diós');
            location.reload();
            clearInterval(gameEndCondition);
        }


    }, 200);    
}



function buildGame(){

    // Quitamos el botón de construir el juego
    document.querySelector('#loadingScreenContainer > #playButton').style.display = 'none';
    

    const loadMsj = document.querySelector('#loadingScreenContainer > #msj');
    loadMsj.classList.add('active');

    const animationContainer = document.querySelector('#animationContainer');
    animationContainer.classList.add('active');

    const loadingBar = document.querySelector('#animationContainer > #loadingBar');
    const loadingPercentage = document.querySelector('#loadingBar > #percentage');
    let percentage = '3%';


    loadMsj.innerHTML = 'Detectando dispositivo...';
    recognizeMobileDevice().then((response) => {

        percentage = '20%';

        loadingBar.style.maxWidth = percentage;
        loadingPercentage.innerHTML = percentage;

        loadMsj.innerHTML = 'Construyendo el nivel...';


        return addObstacles();

            
    }).then((response) => {

        percentage = '40%';

        loadingBar.style.maxWidth = percentage;
        loadingPercentage.innerHTML = percentage;

        loadMsj.innerHTML = 'Agregando a los jugadores...';

        return addPlayers();
            
    }).then((response) => {

        percentage = '60%';

        loadingBar.style.maxWidth = percentage;
        loadingPercentage.innerHTML = percentage;

        loadMsj.innerHTML = 'Agregando a los enemigos...';

        return addEnemies();
            
    }).then((response) => {

        percentage = '90%';

        loadingBar.style.maxWidth = percentage;
        loadingPercentage.innerHTML = percentage;

        loadMsj.innerHTML = 'Cargando las animaciones...';

        return loadingKeyFrames();
            
    }).then((response) => {

        percentage = '100%';

        loadingBar.style.maxWidth = percentage;
        loadingPercentage.innerHTML = percentage;

        loadMsj.innerHTML = '[Carga Completada]';
            
        // Después de 2s iniciamos
        setTimeout(() => { 
            startGame();
        }, 1000);  

        return;
            
    })
    .catch(function(error){
        console.log(error);
        // De ocurrir un error: 
        // enviamos un msj de error y 
        // colocamos el botón de construir el juego nuevamente.
        loadMsj.innerHTML = 'Ocurrió un error, CONTINUAR para intentarlo de nuevo.';
        document.querySelector('#loadingScreenContainer > #playButton').style.display = 'block';
    });         


}







