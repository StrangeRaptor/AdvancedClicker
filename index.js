var lastUpdate = Date.now();
var myInterval = setInterval(tick, 0);
var label = document.getElementById('Counter');


//get save data if there is any, if not, use default player as a base
if (localStorage.getItem("player") != null) {
  player = JSON.parse(localStorage.getItem('player'));
}else {
  player = JSON.parse(JSON.stringify(defaultplayer));
}

//setting variables to ready DeltaTime
var now = Date.now();
var dt = now - lastUpdate;

//check when the player ws last on the game
//if they've never been on the game before, then set it to current moment
if(player.lastOn <= 0){
  lastUpdate = now;
}else {
  lastUpdate = player.lastOn;
}

//check how many of the shops are visible and add them accordingly
 for (i = 0; i < player.shops.length; i++) {
   if(player.shops[i].visible){
     shopGenerator(player.shops[i],i);
   }
 }

//simple save function
function save() {
  player.lastOn = lastUpdate;
  localStorage.setItem('player', JSON.stringify(player));
};

//(10/30) * dt <-- should equal arpox 1 (calculation for 1 each second)

function tick() {
  //bal always equals about 1 each second.
  //updating delta time
    now = Date.now();
    dt = now - lastUpdate;
    lastUpdate = now;
    var bal = (10/30) * dt;

  //update all shops according to the bal to evaluate the correct time left
    var i;
    for (i = 0; i < player.shops.length; i++) {
      if(player.shops[i].visible){
        progression(bal,player.shops[i]);
      }
    }

  //display the amount of "bolts" and add the s if there is more than 1
    label.innerHTML = nFormatter(parseInt(player.bolts),3);
    if(player.bolts <= 1){label.innerHTML += " Bolt"}else{label.innerHTML += " Bolts"};
    save();
}
