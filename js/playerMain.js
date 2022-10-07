// Clase Player jugable
class PlayerMain extends Player{

    // Sucede que el eventListener no puede 
    // capturar simultáneamente el evento de 
    // presionar teclas, es decir, que si tengo 
    // presionadas dos teclas este no me va a 
    // capturar ambas, sino, a la última tecla 
    // presionada.
    // Para solucionar este inconveniente, creamos 
    // un mapa que almacena las teclas presionadas 
    // cuando se dispara el evento "keydown" (captura 
    // la tecla presionada y la sigue capturando si esta 
    // sigue presionada) y que elimina las teclas 
    // presionadas cuando son soltadas (evento "keyup").
    // De esta forma cada que una tecla es presionada 
    // (cada que se dispara el evento "keydown") enviamos 
    // todas las teclas presionadas que se encuentran en el 
    // mapa "keysPressed" para que estas activen la acción 
    // correspondiente.
    keysPressed = new Map()

    constructor(posXY, playerType, side, ammo){

        const playerLabel = 'player';  // Como es un 
        // jugador controlable, su etiqueta HTML 
        // debe ser "player".

        super(posXY, playerType, playerLabel, side, ammo);

        this.itHurts = 'obstacle, enemy';  // Asignamos los objetos 
        // con lo cuales deben interactuar las balas de este jugador. 
        this.name = playerType;


        // Agregamos el icono del arma y su nombre
        this.updateWeaponIlustration();


        // Agregamos los eventos para controlarlo
        document.addEventListener('keydown', (event) => {

            const code = event.code;
            const key = event.key;  

            // Agregamos la tecla presionada al mapa de teclas 
            // presionadas.
            this.keysPressed.set(key, {'key':key, 'code':code});
            // console.log(this.keysPressed)
            
            // Si está haciendo la animación de 
            // recibir daño, entonces no puede moverse.
            if(this.hurt == 1){ return; }

            // Recorremos el mapa de teclas presionadas para 
            // que se ejecuten las acciones de cada tecla 
            // presionada.
            for(let i of this.keysPressed){

                const code = i[1]['code'];
                const key = i[1]['key'];

                if(code == 'ArrowLeft' && this.lifes >= 1){
                    this.moveLeft();
                }else if(code == 'ArrowRight' && this.lifes >= 1){
                    this.moveRight();
                }else if(code == 'ArrowUp' &&  this.jumping != 1 && 
                         this.attacking != 1 && this.lifes >= 1 && 
                         this.falling != 1){
                    this.playerJump();
                }else if(code == 'Space' && this.attacking != 1 && this.lifes >= 1){
                    this.playerAttack();
                }else if(parseInt(key)){
                    this.changeAmmo(parseInt(key));
                    this.updateWeaponIlustration();
                }

            }

            // La cámara del juego seguirá al jugador main
            Game.keepPerspective(this);
            

        }, false);


        document.addEventListener('keyup', (event) => {
            const code = event.code;
            const key = event.key;  

            // Una vez que la tecla es dejada de presionar, 
            // la eliminamos del mapa de teclas presionadas.
            this.keysPressed.delete(key);

            // Si está moviéndose, saltando o disparando, no 
            // puede hacer la animación de Idle.
            if(code != 'ArrowLeft' && code != 'ArrowRight' && 
               code != 'ArrowUp' && code != 'Space'){

                return;

            }

            // Si está cayendo o saltando, en vez de colocar 
            // la animación de Idle, colocamos la de salto.
            if(this.falling == 1 || this.jumping == '1'){
                this.setAnimation('Idle');
                return;
            }

            // Mientras no esté saltando, atacando, y tenga todas 
            // las vidas, entonces se le coloca la animación de 
            // inactividad, ya que si llegó hasta acá, significa 
            // que no está haciendo nada.
            if(this.jumping != '1' && this.attacking != '1' && this.lifes >= 1){
                // Cambiamos la animación
                this.setAnimation('Idle');
            }
        
        }, false);

    }


    updateWeaponIlustration(){
        const currentAmmo = this.ammo[this.currentBullet];
        const bulletIcon = currentAmmo['name'] + '.png';

        const icon = document.querySelector('#playerWeapons > #icon');
        const name = document.querySelector('#playerWeapons > #cooldownBar > #name');

        icon.style.backgroundImage = "url('assets/bulletsIcons/" + bulletIcon + "')";
        name.innerHTML = currentAmmo['name'];        
    }

}