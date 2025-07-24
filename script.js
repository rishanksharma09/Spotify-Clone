async function getMusic(){
    let response=await fetch("http://127.0.0.1:3000/Spotify-Clone/songs/");
    data= await response.text();
    let parser=new DOMParser();
    let mid=document.getElementsByClassName("mid")[0];
    let datadoc=parser.parseFromString(data,"text/html");
    let songs= datadoc.getElementsByTagName("a");
    let boxes=document.getElementsByClassName("box");
    for (const song of songs) {
        if(song.href.endsWith(".mp3")){
            let box=document.createElement("div");
            box.className="box circular";
            box.innerHTML=`
                        <span class="name">
                            <img src="music-svgrepo-com.svg" alt="">
                            <div class="sname">
                                ${song.innerText}
                            </div>
                        </span>
                        <span class="playnow">
                            <img class="invert" src="play-button-svgrepo-com.svg" alt="" srcset="">

                        </span>`
                        mid.append(box);
        
        
            box.addEventListener("click",()=>{
                let src=song.href;
                playMusic(src);
            })
        }
    }



}
getMusic();
function playMusic(src){
    let audio = document.createElement("audio");
    audio.style.display = "none"; // Hide from UI
    document.body.appendChild(audio);
    audio.src=src;
    audio.play();


}

