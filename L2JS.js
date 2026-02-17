const dialogues = [
    { name: "Cann", dialogue: "Whew... That was a tough battle." },
    { name: "Narrator", dialogue: "Cann walks toward the castle seen from afar." },
    { name: "Narrator", dialogue: "He enters and reaches a wide and tall room where he sees six sentient hands." },
    { name: "Cann", dialogue: "WHAT ON EARTH IS THAT???" },
    { name: "Narrator", dialogue: "The hands start forming a net made of fire." },
    { name: "?????", dialogue: "Well, well, well. Another adventurer is trying to kill ME, the keeper of all flames." },
    { name: "Keeper of Flames", dialogue: "No one's done it yet, can you?" },
    { name: "Cann", dialogue: "Let's go." },
];

const abilities = [
    { minDmg: 5, maxDmg: 10, heal: 0, cost: 0, sfx: "sfx-slash" },   // Slash
    { minDmg: 10, maxDmg: 15, heal: 0, cost: 0, sfx: "sfx-multislash"  },  // Multislash
    { minDmg: 0, maxDmg: 0, heal: 10, cost: 0, sfx: "sfx-heal" },   // Heal
    { minDmg: 20, maxDmg: 40, heal: 20, cost: 100, sfx: "sfx-ult"  } // Ultimate
];

function playSFX(id) {
    const sfx = document.getElementById(id);
    sfx.currentTime = 0; // Rewind to start
    sfx.play();
}

var playerHP = 100;
var bossHP = 200;
var ultPoints = 0; // Track charge for "Eye of the Mask"
var isPlayerTurn = true;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showValues() {
    document.getElementById("bHP").innerHTML = bossHP;
    document.getElementById("pHP").innerHTML = playerHP;
    document.getElementById("uP").innerHTML = ultPoints;
    
    // Visual feedback for Ult button
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
        // Ultimate button is ALWAYS disabled unless points == 100
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
    
    // Check if it's the ultimate and if we have enough points
    if (abilityNum === 3 && ultPoints < 100) return;

    playSFX(abilities[abilityNum].sfx);

    setButtonsState(true);

    let dmg = getRandomInteger(abilities[abilityNum].minDmg, abilities[abilityNum].maxDmg);
    let heal = abilities[abilityNum].heal;

    bossHP -= dmg;
    playerHP += heal;

    // Build Ult Points based on damage dealt (unless using the Ult itself)
    if (abilityNum !== 3) {
        ultPoints += (dmg * 2); 
        alert("You dealed " + dmg + " DMG to the boss!");
        if (ultPoints > 100) ultPoints = 100;
    } else {
        ultPoints = 0; // Reset after using Ultimate
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
    // Stop music if you want
    document.getElementById("bgm").pause();
}

// --- Dialogue Logic ---
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
    setButtonsState(false); // Initialize button states
}



showValues();
NextDialogue();