const dialogues = [
    { name: "Narrator", dialogue: "Cann walks toward the sea, seeming very anxious waiting for his next foe." },
    { name: "Narrator", dialogue: "He plans to wash himself of the ash from last battle, when suddenly-" },
    { name: "?????", dialogue: "MUAHAHAHAHA! THE 'GREAT ADVENTURER' HAS COME TO KILL ME?" },
    { name: "Cann", dialogue: "Who are you-" },
    { name: "?????", dialogue: "NO TIME FOR INTRODUCTIONS. LET'S FIGHT." },
    { name: "Narrator", dialogue: "Cann is annoyed by the Manipulator of the Sea." },
    { name: "Cann", dialogue: "Fine, I've beaten stronger gods anyway." },
    { name: "Manipulator of the Sea", dialogue: "WHAT??? ME? WEAK? WELL, LET'S SEE ABOUT THAT." },
];

const abilities = [
    { minDmg: 5, maxDmg: 10, heal: 0, cost: 0, sfx: "sfx-slash" },  
    { minDmg: 10, maxDmg: 15, heal: 0, cost: 0, sfx: "sfx-multislash"  },  
    { minDmg: 0, maxDmg: 0, heal: 20, cost: 0, sfx: "sfx-heal" },  
    { minDmg: 20, maxDmg: 40, heal: 20, cost: 100, sfx: "sfx-ult"  } 
];

function playSFX(id) {
    const sfx = document.getElementById(id);
    sfx.currentTime = 0; 
    sfx.play();
}

var playerHP = 150;
var bossHP = 300;
var ultPoints = 0; 
var isPlayerTurn = true;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showValues() {
    document.getElementById("bHP").innerHTML = bossHP;
    document.getElementById("pHP").innerHTML = playerHP;
    document.getElementById("uP").innerHTML = ultPoints;
    
    const ultBtn = document.getElementById("ultimate");
    if (ultPoints >= 100) {
        ultBtn.classList.remove("btn-primary");
        ultBtn.classList.add("btn-warning", "border-white");
        ultBtn.style.boxShadow = "0 0 20px yellow";
    } else {
        ultBtn.classList.remove("btn-warning");
        ultBtn.classList.add("btn-primary");
        ultBtn.style.boxShadow = "none";
    }
}

function setButtonsState(disabled) {
    const buttons = document.querySelectorAll("#abilityDiv button");
    buttons.forEach(btn => {
        if (btn.id === "ultimate" && ultPoints < 100) {
            btn.disabled = true;
        } else {
            btn.disabled = disabled;
        }
    });
    document.getElementById("abilityDiv").style.opacity = disabled ? "0.5" : "1";
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function abilityClick(abilityNum) {
    if (!isPlayerTurn || bossHP <= 0) return;
    
    if (abilityNum === 3 && ultPoints < 100) return;

    playSFX(abilities[abilityNum].sfx);

    setButtonsState(true);

    let dmg = getRandomInteger(abilities[abilityNum].minDmg, abilities[abilityNum].maxDmg);
    let heal = abilities[abilityNum].heal;

    bossHP -= dmg;
    playerHP += heal;

    if (abilityNum !== 3) {
        ultPoints += (dmg * 2); 
        alert("You dealed " + dmg + " DMG to the boss!");
        if (ultPoints > 100) ultPoints = 100;
    } else if (abilityNum == 2){
       ultPoints += 6
    } else {
         ultPoints = 0; 
    }
    

    if (playerHP > 100) playerHP = 100;
    if (bossHP < 0) bossHP = 0;

    showValues();

    if (bossHP <= 0) {
        showWinScreen();
        return;
    }

    bossTurn();
}

async function bossTurn() {
    isPlayerTurn = false;
    await sleep(1500);

    const bossDmg = getRandomInteger(10, 20);
    playerHP -= bossDmg;

    playSFX("sfx-boss");

     alert("The boss did " + bossDmg + " DMG!");
    
    if (playerHP < 0) playerHP = 0;
    showValues();

    if (playerHP <= 0) {
        alert("You have been defeated!");
        location.reload();
        return;
    }

    isPlayerTurn = true;
    setButtonsState(false);
}

function showWinScreen() {
    const screen = document.getElementById("winScreen");
    screen.classList.remove("d-none");
    screen.classList.add("d-flex");
    document.getElementById("bgm").pause();
}

var currentDialogue = 0;
async function typeWriter(id, text, speed = 50) {
    const el = document.getElementById(id);
    el.textContent = "";
    for (let i = 0; i < text.length; i++) {
        el.textContent += text[i];
        await sleep(speed);
    }
    document.getElementById("next").classList.remove("d-none");
    document.getElementById("next").style.display = "inline-block";
}

function NextDialogue() {
    if (currentDialogue < dialogues.length) {
        document.getElementById("next").style.display = "none";
        document.getElementById("charname").innerHTML = dialogues[currentDialogue].name;
        typeWriter("dialogue", dialogues[currentDialogue].dialogue);
        currentDialogue += 1;
    } else {
        StartFight();
    }
}

function playMusic() {
    var bgm = document.getElementById("bgm");
    if (bgm.paused) {
        bgm.play();
        document.getElementById("musicbtn").innerHTML = 'Mute BGM <i class="fa-solid fa-volume-xmark"></i>';
    } else {
        bgm.pause();
        document.getElementById("musicbtn").innerHTML = 'Play BGM <i class="fa-solid fa-volume-low"></i>';
    }
}

function StartFight() {
  playMusic();
    document.getElementById("next").classList.add("d-none");
    const fightArea = document.getElementById("fightArea");
    fightArea.classList.remove("d-none");
    fightArea.classList.add("d-flex");
    setButtonsState(false); 
}



showValues();

NextDialogue();


