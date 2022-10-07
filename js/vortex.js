class Vortex extends Obstacle{

    // Recibe: posXY, where, active, y objects.
    // Su pos en el mapa en el eje X y Y.
    // A dónde debe transportar (id del elemento 
    // hacia el cual debe transportar).
    // Su estado (activo/inactivo), si está activo, transportará todo 
    // lo que lo toque, de estar inactivo, no transportará nada.
    // Con qué objetos va a interactuar.
    constructor(posXY, where, active, objects){

        const obstacleType = 'Vortex';
        super(posXY, obstacleType);

        this.itHurts = objects;  // Aquí los objetos que 
        // transportará.
        this.where = where;  // Aquí va el id del elemento 
        // hacia el cual el vortex va a transportar.

        if(active){
            this.openTunnel();
        }

    }




    getTransportPoint(side, elementWidth){
        
        // Esta función retorna un mapa 
        // con la posición hacia la cual 
        // debe transportar el vortex.
        const tpMap = new Map();
        
        // Elemento hacial el cual debe transportar el vortex
        const transportPoint = document.querySelector(this.where);

        const tpStyle = window.getComputedStyle(transportPoint);
        let tpPosX = parseFloat(tpStyle.getPropertyValue('left')); 
        let tpPosY = parseFloat(tpStyle.getPropertyValue('bottom'));
        const tpWidth = parseFloat(tpStyle.getPropertyValue('width'));

        // Si el objeto a transportar estaba mirando hacia la derecha, 
        // entonces este debe ser transportado a la derecha del 
        // tp (punto de teletransporte) y viceversa para la izquierda.
        // Para transportar a la derecha, tomamos la pos en X del 
        // tp y le sumamos el width del mismo (más 1 adicional para 
        // separar un poco).
        // Para transportar a la izquierda, tomamos la pos en X del 
        // tp y le restamos el width del objeto a transportar (menos 1 
        // adicional para separar un poco).
        if(side == 'right'){ tpPosX += tpWidth + 1; }
        else{ tpPosX -= 1 + elementWidth; }        

        // Posición en Y del punto de transporte
        tpMap.set('Y', tpPosY);
        // Posición en X del punto de transporte
        tpMap.set('X', tpPosX);

        return tpMap;

    }



    openTunnel(){

        const thisVortex = this;

        var vortexLife = window.setInterval(function(){
        
            const vortex = document.querySelector(thisVortex.id);
        
            const vortexStyle = window.getComputedStyle(vortex);
            const vortexPosX = parseFloat(vortexStyle.getPropertyValue('left')); 
            const vortexPosY = parseFloat(vortexStyle.getPropertyValue('bottom'));
            
            // El atributo "itHurts" es un "querySelector" con 
            // los objetos que deben interactuar con el vortex.
            const groupToScan = thisVortex.itHurts;
            let contactWith = Game.contactDetect(thisVortex, vortexPosX, vortexPosY, groupToScan);

            if(contactWith){
                // Obtenemos el elemento a transportar y su width
                const element = document.querySelector('#' + contactWith);
                const elementStyle = window.getComputedStyle(element);
                const elementWidth = parseFloat(elementStyle.getPropertyValue('width'));

                // También el objeto para saber el lado hacia el cual 
                // está orientado.
                const thisObject = Game.getObject(element);
                const objectSide = thisObject.side;

                const tpMap = thisVortex.getTransportPoint(objectSide, elementWidth);

                // Transportamos
                element.style.left = tpMap.get('X') + 'px';
                element.style.bottom = tpMap.get('Y') + 'px';

            }


        }, 100, thisVortex);

    }


}