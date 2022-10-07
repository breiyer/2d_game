class TouchControl{

    static pressed = 0;
    static player = 0;

    static start(){
        var keydown_simulator = window.setInterval(function(){
            if(this.pressed == 0){ return; }
            document.dispatchEvent(new KeyboardEvent('keydown', {'key':'', 'code':''}));  

            if(player.lifes < 1){ clearInterval(keydown_simulator); }
        }, 100);        
    }


    static changeAmmo(){
        const player = TouchControl.player;
        let newCurrentBullet = player.currentBullet + 1;

        if(newCurrentBullet >= player.ammo.length){
            newCurrentBullet = 0;
        }

        player.currentBullet = newCurrentBullet;
        player.updateWeaponIlustration();
    }

    
    static btnDown(code, key){
        document.dispatchEvent(new KeyboardEvent('keydown', {'key':key, 'code':code}));  
        this.pressed = 1;
    }
    
    
    static btnUp(code, key){
        document.dispatchEvent(new KeyboardEvent('keyup', {'key':key, 'code':code}));
        this.pressed = 0;
    }

}


