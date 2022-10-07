function startClock(player){

    const clock = document.querySelector('#gameInfo > #time > #time');
    let clockTime = ''; 
    let minutes = 0;
    let seconds = 0;

    var tickTack = window.setInterval(function(){

        if(Game.finished){ window.clearInterval(tickTack); }

        seconds ++;
        if(seconds >= 60){
            seconds = 0;
            minutes ++;
        }if(seconds < 10){ seconds = '0' + seconds; }

        clockTime = minutes + ':' + seconds;

        clock.innerHTML = clockTime;
        
    }, 1000, clock, clockTime, minutes, seconds, player);    
    
}