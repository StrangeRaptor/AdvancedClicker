var defaultplayer = {
  bps: 0,
  bolts: 0,
  money: 0,
  shops: [
    {
      visible: true,
      auto: false,
      active: false,
      waitTime: 7,
      amount: 1,
      cost:0,
      progress: 0,
      type: "bolt",
      id: "00"
    },
    {
      visible: true,
      auto: false,
      active: false,
      waitTime: 10,
      amount: 15,
      cost:0,
      progress: 0,
      type: "dollar",
      id: "01"
    },
    {
      visible: true,
      auto: false,
      active: false,
      waitTime: 120,
      amount: 72,
      cost:0,
      progress: 0,
      type: "bolt",
      id: "02"
    }
  ],
  lastOn: 0
};

//function that creates html for the shops when they are added in index.js
function shopGenerator(newShop, arrayNo) {
  var color = '';
  newShop.type == "bolt"? color="blue":color="green";
  console.log(newShop.type == "bolt");
  var shop = document.createElement("div");
  shop.setAttribute("class","shop");

  var countdown = document.createElement("p");
  countdown.setAttribute("id", newShop.id + "timeRemain");
  countdown.setAttribute("class", "countdown");
  countdown.innerHTML = "---"

  var button = document.createElement("button");
  button.setAttribute("id", newShop.id + "button");
  button.setAttribute("class", "buttons");
  button.setAttribute("onclick", "player.shops["+ arrayNo +"].active = true;");
  button.innerHTML = newShop.amount + " bolts";

  var progressBar = document.createElement("div");
  progressBar.setAttribute("class", "progbargen-"+color);
  progressBar.setAttribute("id", newShop.id + "progBar");
  var duration = document.createElement("div");
  duration.setAttribute("class", "duration");

  shop.appendChild(countdown);
  shop.appendChild(button);
  duration.appendChild(progressBar);
  shop.appendChild(duration);
  document.body.appendChild(shop);
  newShop.visible = true;
}

//basic number formatter
function nFormatter(num, digits) {
  var si = [
    { value: 1, symbol: "" },
    { value: 1E3, symbol: "k" },
    { value: 1E6, symbol: "M" },
    { value: 1E9, symbol: "G" },
    { value: 1E12, symbol: "T" },
    { value: 1E15, symbol: "P" },
    { value: 1E18, symbol: "E" }
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

//basic time formatter (used just to display how long till a "shop" finishes)
function timeFormatter(num) {
  var days    = Math.floor(num / 86400)
  var hours   = Math.floor((num - (days * 86400)) / 3600);
  var minutes = Math.floor((num - (days * 86400) - (hours * 3600)) / 60);
  var seconds = num - (days * 86400) - (hours * 3600) - (minutes * 60);
  var time = seconds.toFixed(2)+'S';
  if (minutes>=1 || hours>=1 || days>=1) {time=minutes+"M:"+time};
  if (hours>=1 || days>=1) {time=hours+"H:"+time};
  if (days>=1) {time=days+"D:"+time};
  return time;
}

//update shop
function progression(b,t) {
  //selectors
  var timeRemain = document.getElementById(t.id + "timeRemain"),
  progBar = document.getElementById(t.id + "progBar"),
  button = document.getElementById(t.id + "button");

  //add an s at the end if the amount is greater than 1
  t.amount <= 1? button.innerText = t.amount + " "+t.type:button.innerText = t.amount + " "+t.type+"s";

  //check how much time is left till the action is completed
  var timeRemaining = ((t.waitTime*100) - Math.round((t.progress * t.waitTime)))/100;
  //check if the total wait time is to small to matter and check if the shop is set to auto click
  if (t.waitTime < .3 && t.auto){
    //keep it constantly at 100 if it is and display how much is earned per second
    timeRemain.innerHTML = Math.round((1/t.waitTime)*t.amount).toFixed(0) + " per second";
    progBar.style.width = 100 + "%";
  }else{
    //else if it isn't auto, display the progress percent and adjust the bar accordingly
    timeRemain.innerHTML = timeFormatter(timeRemaining);
    if (t.progress >= 100) {
      progBar.style.width = 100 + "%";
    }else {
      progBar.style.width = t.progress + "%";
    }
  }
  //if the current shop is active
  if (t.active || t.auto) {
    //disable the button and add to progress
    t.active = true;
    button.setAttribute("disabled","disabled");
    t.progress += (((b/666)*200)/t.waitTime);
    //once progress reaches 99 or greater
    if(t.progress >= 99){
      //stop the shop and re-enable the button but only if the shop isn't set to auto
      t.active = false;
      if(!t.auto){button.removeAttribute("disabled")};
      if(t.auto){
        var temp = Math.floor(t.progress / 100);
        player.bolts += t.amount * temp;
        t.progress -= (temp * 100);
      }else{
        t.progress = 0;timeRemaining = 0;timeRemain.innerHTML = "---";player.bolts += t.amount;
      }
    }
  }
}
