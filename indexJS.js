function playmusic() {
  var bgm = document.getElementById("bgm");

  if (bgm.paused) {
    bgm.play();
    document.getElementById("musicbtn").innerHTML =
      'Mute BGM <i class="fa-solid fa-volume-xmark"></i>';
  } else {
    bgm.pause();
    document.getElementById("musicbtn").innerHTML =
      'Play BGM <i class="fa-solid fa-volume-low"></i>';
  }
}

function toggleDiv(divid) {
  var x = document.getElementById(divid);

  if (x.style.display === "none") {
    x.style.display = "block"; // Make the div appear
  } else {
    x.style.display = "none"; // Make the div disappear
  }

  playmusic();
}
