console.log('Lets start js ');
let curnnetsong = new Audio();
let songs;
let currfolder;
function secondsToMinutesSeconds(seconds) {
   if (isNaN(seconds) || seconds < 0) {
      return "00:00";
   }

   const minutes = Math.floor(seconds / 60);
   const remainingSeconds = Math.floor(seconds % 60);

   const formattedMinutes = String(minutes).padStart(2, '0');
   const formattedSeconds = String(remainingSeconds).padStart(2, '0');

   return `${formattedMinutes}:${formattedSeconds}`;
}





async function getSongs(folder) {

   currfolder = folder;
   let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
   let response = await a.text();
   // console.log(response)
   let dIv = document.createElement("div")
   dIv.innerHTML = response;
   let as = dIv.getElementsByTagName("a")

   songs = []
   for (let index = 0; index < as.length; index++) {
      const element = as[index];
      if (element.href.endsWith(".mp3")) {
         songs.push(element.href.split(`/${folder}/`)[1])
      }
   }
   let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
   songul.innerHTML = "";
   for (const song of songs) {
      songul.innerHTML = songul.innerHTML + `<li> <i class="fa-solid fa-music"></i> 
<div class="info"> <div>${song.replaceAll("%20", " ")}</div><div>Ayan</div>
</div>
<div class="playnow">
  <span>Play Now</span>
  <i class="fa-regular fa-circle-play"></i>
</div> </li>` ;


   }

   Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
      e.addEventListener("click", element => {
         playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());

      })
   })
   return songs
}
const playMusic = (track, pause = false) => {
   curnnetsong.src = `/${currfolder}/` + track
   if (!pause) {
      curnnetsong.play();
      play2.src = "img/pause.svg"
   }
   document.querySelector(".songinfo2").innerHTML = decodeURI(track)
   document.querySelector(".songstime").innerHTML = "00:00 / 00:00 "
   // show all the songs in the platlists

}
async function displayAlbums() {


   let a = await fetch(`http://127.0.0.1:3000/songs/`)
   let response = await a.text();
   // console.log(response)
   let dIv = document.createElement("div")
   dIv.innerHTML = response;
   let allanchors = dIv.getElementsByTagName("a")
   let cardcontainer = document.querySelector(".cardcontainer")
   let array = Array.from(allanchors)
   for (let index = 0; index < array.length; index++) {
      const element = array[index];


      console.log(element.href);
      if (element.href.includes("/songs") && !element.href.includes(".htaccess")) {
         let folder = element.href.split("/").slice(-2)[0];
         // get meta data
         let a = await fetch(`/songs/${folder}/info.json`)
         let response = await a.json();
         console.log(response);
         cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="card">
      <div class="play">
         <svg width="100" height="55" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" />
            <circle cx="12" cy="12" r="10" stroke-width="1.5" fill="#1fdf64" />
            <path
               d="M15.4531 12.3948C15.3016 13.0215 14.5857 13.4644 13.1539 14.3502C11.7697 15.2064 11.0777 15.6346 10.5199 15.4625C10.2893 15.3913 10.0793 15.2562 9.90982 15.07C9.5 14.6198 9.5 13.7465 9.5 12C9.5 10.2535 9.5 9.38018 9.90982 8.92995C10.0793 8.74381 10.2893 8.60868 10.5199 8.53753C11.0777 8.36544 11.7697 8.79357 13.1539 9.64983C14.5857 10.5356 15.3016 10.9785 15.4531 11.6052C15.5156 11.8639 15.5156 12.1361 15.4531 12.3948Z"
               fill="black" stroke="#000" stroke-width="1.5" stroke-linejoin="round" />

         </svg>
      </div>
      <img src="/songs/${folder}/cover.jpg" alt="">
      <h2>${response.title}</h2>
      <p>${response.description}</p>
   </div>`
      }

   }
   //load playlists
   Array.from(document.getElementsByClassName("card")).forEach(e => {
      e.addEventListener("click", async item => {
         songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
         playMusic(songs[0])
      })
   })
}
async function main() {

   // get the list of all songs
   songs = await getSongs("songs/ncs");
   playMusic(songs[0], true)
   //display all songs album on the page
   displayAlbums()

   // attach an event listener to play
   play2.addEventListener("click", () => {
      if (curnnetsong.paused) {
         curnnetsong.play();
         play2.src = "img/pause.svg"
      }
      else {
         curnnetsong.pause();
         play2.src = "img/play.svg"
      }
   })
   // Listen for timeupdate event
   curnnetsong.addEventListener("timeupdate", () => {
      document.querySelector(".songstime").innerHTML = `${secondsToMinutesSeconds(curnnetsong.currentTime)} / ${secondsToMinutesSeconds(curnnetsong.duration)}`
      document.querySelector(".circle").style.left = (curnnetsong.currentTime / curnnetsong.duration) * 100 + "%";
   })
   // add a n event listeners
   document.querySelector(".seekbar").addEventListener("click", e => {
      let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
      document.querySelector(".circle").style.left = percent + "%";
      curnnetsong.currentTime = ((curnnetsong.duration) * percent) / 100
   })

   document.querySelector("#menu").addEventListener("click", () => {
      document.querySelector(".left").style.left = "0"
   })
   document.querySelector(".close").addEventListener("click", () => {
      document.querySelector(".left").style.left = "-100rem"
   })
   // add vent listener for  backward
   backward.addEventListener("click", () => {
      let index = songs.indexOf(curnnetsong.src.split("/").slice(- 1)[0])
      if ((index - 1) >= 0) {
         playMusic(songs[index - 1])
      }
   })
   // add event listener for foraward 
   forward.addEventListener("click", () => {
      let index = songs.indexOf(curnnetsong.src.split("/").slice(- 1)[0])
      if ((index + 1) < songs.length) {
         playMusic(songs[index + 1])
      }
   })
   // add an event
   document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
      console.log("Setting volume to ", e.target.value, "/100");
      curnnetsong.volume = parseInt(e.target.value) / 100;
   })
   document.querySelector(".volume>img").addEventListener("click", e => {
      if (e.target.src.includes("img/volume.svg")) {
         e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
         curnnetsong.volume = 0;
         document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
      }
      else {
         e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
         curnnetsong.volume = .10;
         document.querySelector(".range").getElementsByTagName("input")[0].value = 20;
      }

   })

}

main();
