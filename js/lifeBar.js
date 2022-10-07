function removeLife(thisObject){

    const object = document.querySelector(thisObject.id);

    // Se calcula el nuevo porcentaje de vida tras sufrir daño
    let percent = thisObject.lifes / thisObject.maxLife;
    percent *= 100;

    // Si es menor a cero, entonces lo dejamos en cero
    if(percent < 0){ percent = 0; }

    if(object.tagName == 'PLAYER' || object.tagName == 'ENEMY'){
        
        const lifesBar = document.querySelector(thisObject.id + ' > .lifesBar');
        lifesBar.style.animation = "lifesBarHurt .4s 2";    

        const bar = document.querySelector(thisObject.id + ' > .lifesBar > .bar');
        bar.style.width = percent + '%';

        // Pasados .8s quitamos la animación
        setTimeout(() => {

            lifesBar.style.animation = "none";            

        }, 800, lifesBar);            

    }

}



function removeLifeWithClass(thisObject){

    const object = document.querySelector(thisObject.id);

    // Se calcula el nuevo porcentaje de vida tras sufrir daño
    let percent = thisObject.lifes / thisObject.maxLife;
    percent *= 100;

    // Si es menor a cero, entonces lo dejamos en cero
    if(percent < 0){ percent = 0; }

    if(object.tagName == 'PLAYER' || object.tagName == 'ENEMY'){
        
        const lifesBar = document.querySelector(thisObject.id + ' > .lifesBar');
        lifesBar.classList.add('hurt');

        // Pasados .8s quitamos la animación.
        setTimeout(() => {

            lifesBar.classList.remove('hurt');   
            console.log(lifesBar)        

        }, 800, lifesBar);        

        const bar = document.querySelector(thisObject.id + ' > .lifesBar > .bar');
        bar.style.width = percent + '%';

    }

}



