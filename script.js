let currentSong = null;
let audio=null;
let songs=null
let curfolder;
async function getMusic() {
    let response = await fetch(`${curfolder}`);
    data = await response.text();
    let parser = new DOMParser();
    let mid = document.getElementsByClassName("mid")[0];
    let datadoc = parser.parseFromString(data, "text/html");
     songs = datadoc.getElementsByTagName("a");
    let boxes = document.getElementsByClassName("box");

    for (const song of songs) {
        if (song.href.endsWith(".mp3")) {
            let box = document.createElement("div");
            box.className = "box circular";
            box.innerHTML = `
                        <span class="name">
                            <img src="assets/music-svgrepo-com.svg" alt="">
                            <div class="sname">
                                ${song.innerText}
                            </div>
                        </span>
                        <span class="playnow">
                            <img class="invert" src="assets/play-button-svgrepo-com.svg" alt="" srcset="">

                        </span>`
            mid.append(box);
            box.addEventListener("click", () => {
                currentSong = song;
                let src = song.href;
                // Remove 'selectedbox' from all boxes
                document.querySelectorAll(".box.selectedbox").forEach(c => c.classList.remove("selectedbox"));
                // Add 'selectedbox' to the clicked box
                box.classList.add("selectedbox");
                stopMusic();
                playMusic(src);
            });
                
    }
}


        let pauseButton = document.querySelector("#play");
        pauseButton.onclick = () => {
            if (audio == null) {
                console.error("No audio element found");
                return;
            }
            if (audio.paused) {
                audio.play();
                pauseButton.innerHTML = `<img src="assets/pause-svgrepo-com.svg" alt="">`
            } else {
                audio.pause();
                pauseButton.innerHTML = `<img src="assets/play-button-svgrepo-com.svg" alt="">`;
            }
        }

    

        let previousButton = document.querySelector("#previous");
        previousButton.onclick = () => {
            let currentIndex = Array.from(songs).findIndex(s => s === currentSong);
            if (currentIndex > 0) {
            currentSong = songs[currentIndex - 1];
            let src = currentSong.href;
            if(!src.endsWith(".mp3")){
                console.log("Invalid file format");
                return;
            }
            playMusic(src);
            
        }
    }
    

    let nextButton=document.querySelector("#next");
    nextButton.onclick=()=>{
        let currentIndex=Array.from(songs).findIndex(s=>s===currentSong);
        if(currentIndex<songs.length-1){
            currentSong=songs[currentIndex+1];
            let src = currentSong.href;
            if(!src.endsWith(".mp3")){
                console.log("Invalid file format");
                return;
            }
            playMusic(src);

        }
    }
    let burger=document.querySelector(".burgermenu");
    burger.addEventListener("click",()=>{
        document.querySelector(".left").style.left="2%";
        document.querySelector(".left").style.width="fit-content";
        

    })
    let cross=document.querySelector(".cross");
    cross.addEventListener("click",()=>{
        document.querySelector(".left").style.left="-180%";
    })
}
    async function getFolder(){
        let response=await fetch("http://127.0.0.1:3000/Spotify-Clone/songs/");
        let data=await response.text();
        let parse= new DOMParser();
        let datadoc=parse.parseFromString(data,"text/html");
        let folders = datadoc.getElementsByTagName("a");
        let cardcontainer=document.querySelector(".cardcontainer");
        for (const folder of folders) {
            if(folder.href.includes("/songs")){
                let response=await fetch(`${folder.href}info.json/`)
                data=await response.json();
                let card=document.createElement("div");
            card.className="card flex circular";
            card.innerHTML= `
                        <img src="${folder.href}cover.jpeg" alt="">
                        <div class="cardtext">
                            <h3>${data.title}</h3>
                            <h4>${data.artist}</h4>
                        </div>
                    `
            cardcontainer.append(card);
            card.addEventListener("click",()=>{
                let mid = document.getElementsByClassName("mid")[0];
                mid.innerHTML="";
                curfolder=folder.href
                console.log(curfolder);
                document.querySelectorAll(".card").forEach(c=>c.classList.remove("selectedcard"))
                card.classList.add('selectedcard')
                getMusic();
            })
        }
        console.log(folders);
    }}


getFolder();
    
function playMusic(src) {
    stopMusic()
    audio = document.createElement("audio");
    audio.style.display = "none"; // Hide from UI
    document.body.appendChild(audio);
    audio.src = src;
    audio.play();
    let pauseButton = document.querySelector("#play");
    pauseButton.innerHTML = `<img src="assets/pause-svgrepo-com.svg" alt="">`


    let curtimedisplay = document.querySelector(".curtime");
    let totaltimedisplay = document.querySelector(".totaltime");
    audio.addEventListener("loadedmetadata", () => {
        totaltimedisplay.innerText = formatTime(audio.duration);
    });
    let seekbar=document.querySelector(".seekbar ");

    seekbar.addEventListener("click",(event)=>{
        const rect=seekbar.getBoundingClientRect();
        let xoffset=event.clientX-rect.left;
        audio.currentTime=(xoffset/(rect.width))*audio.duration;
    })
    audio.addEventListener("timeupdate", () => {
        let dot=document.getElementsByClassName("dot")[0];
        let leftpos=(audio.currentTime/audio.duration)*100;
        curtimedisplay.innerText = formatTime(audio.currentTime);
        dot.style.left=leftpos+"%";

    
    });
    audio.addEventListener("ended", () => {
    // This runs when the audio finishes playing
    let pauseButton = document.querySelector("#play");
    pauseButton.innerHTML = `<img src="assets/play-button-svgrepo-com.svg" alt="">`;
    let currentIndex=Array.from(songs).findIndex(s=>s===currentSong);
        if(currentIndex<songs.length-1){
            currentSong=songs[currentIndex+1];
            let src = currentSong.href;
            if(!src.endsWith(".mp3")){
                console.log("Invalid file format");
                return;
            }
            playMusic(src);

        }
    // You can also trigger next song or any other logic here
});
    let songname = currentSong.innerText;
    let songnameplaybar = document.querySelector(".songname");
    songnameplaybar.innerText = songname;

    





}
function stopMusic() {
    if (audio == null) return; // No audio element found
    audio.currentTime = 0; // Reset to the beginning
    document.body.removeChild(audio); // Remove the audio element;
    audio=null;
    let pauseButton = document.querySelector("#play");
    pauseButton.innerHTML = `<img src="assets/play-button-svgrepo-com.svg"`;

}
function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

