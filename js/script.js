
// =====================================
// MZUKI MUSIC PLATFORM
// JAVASCRIPT
// =====================================


// GET HTML ELEMENTS

const musicGrid = document.getElementById("musicGrid");
const recentMusic = document.getElementById("recentMusic");

const audioPlayer = document.getElementById("audioPlayer");

const playButton = document.getElementById("playButton");
const nextButton = document.getElementById("nextButton");
const previousButton = document.getElementById("previousButton");

const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");
const playerCover = document.getElementById("playerCover");

const musicUpload = document.getElementById("musicUpload");
const uploadButton = document.getElementById("uploadButton");

const searchInput = document.getElementById("searchInput");

const progressBar = document.getElementById("progressBar");
const volumeBar = document.getElementById("volumeBar");


// MUSIC COLLECTION

let songs = [];

let currentSongIndex = -1;


// DISPLAY MUSIC

function displayMusic() {

    musicGrid.innerHTML = "";
    recentMusic.innerHTML = "";

    if (songs.length === 0) {

        musicGrid.innerHTML =
            "<p>No music available yet. Add your first song!</p>";

        recentMusic.innerHTML =
            "<p>Your recently added music will appear here.</p>";

        return;

    }


    songs.forEach((song, index) => {

        const card = document.createElement("div");

        card.className = "music-card";

        card.innerHTML = `

            <div class="song-cover">♫</div>

            <h3>${escapeHTML(song.title)}</h3>

            <p>${escapeHTML(song.artist)}</p>

            <div class="song-rating">
                ★ New release
            </div>

            <button class="song-play" data-index="${index}">
                ▶ Play Song
            </button>

        `;

        musicGrid.appendChild(card);

    });


    const recentSongs = [...songs].reverse().slice(0, 4);

    recentSongs.forEach(song => {

        const card = document.createElement("div");

        card.className = "music-card";

        card.innerHTML = `

            <div class="song-cover">♫</div>

            <h3>${escapeHTML(song.title)}</h3>

            <p>${escapeHTML(song.artist)}</p>

        `;

        recentMusic.appendChild(card);

    });

}


// BASIC HTML ESCAPING

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];

    });

}


// PLAY MUSIC

function playSong(index) {

    if (index < 0 || index >= songs.length) return;

    currentSongIndex = index;

    const song = songs[index];

    audioPlayer.src = song.url;

    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;

    audioPlayer.play().then(() => {

        playButton.textContent = "Ⅱ";

    }).catch(error => {

        console.log("Unable to play song:", error);

    });

}


// PLAY AND PAUSE

playButton.addEventListener("click", () => {

    if (currentSongIndex === -1) {

        if (songs.length > 0) {
            playSong(0);
        }

        return;

    }

    if (audioPlayer.paused) {

        audioPlayer.play();

        playButton.textContent = "Ⅱ";

    } else {

        audioPlayer.pause();

        playButton.textContent = "▶";

    }

});


// NEXT SONG

nextButton.addEventListener("click", () => {

    if (songs.length === 0) return;

    let nextIndex = (currentSongIndex + 1) % songs.length;

    playSong(nextIndex);

});


// PREVIOUS SONG

previousButton.addEventListener("click", () => {

    if (songs.length === 0) return;

    let previousIndex =
        (currentSongIndex - 1 + songs.length) % songs.length;

    playSong(previousIndex);

});


// PLAY SONG FROM MUSIC CARD

musicGrid.addEventListener("click", event => {

    const button = event.target.closest(".song-play");

    if (!button) return;

    const index = Number(button.dataset.index);

    playSong(index);

});


// UPLOAD MUSIC

uploadButton.addEventListener("click", () => {

    musicUpload.click();

});


musicUpload.addEventListener("change", event => {

    const files = Array.from(event.target.files || []);

    files.forEach(file => {

        const song = {

            title: file.name.replace(/\.[^/.]+$/, ""),

            artist: "Independent Artist",

            url: URL.createObjectURL(file),

            dateAdded: new Date()

        };

        songs.push(song);

    });

    displayMusic();

    musicUpload.value = "";

});


// SEARCH MUSIC

searchInput.addEventListener("input", () => {

    const searchTerm = searchInput.value.toLowerCase();

    const filteredSongs = songs.filter(song => {

        return song.title.toLowerCase().includes(searchTerm) ||

               song.artist.toLowerCase().includes(searchTerm);

    });

    musicGrid.innerHTML = "";

    filteredSongs.forEach(song => {

        const originalIndex = songs.indexOf(song);

        const card = document.createElement("div");

        card.className = "music-card";

        card.innerHTML = `

            <div class="song-cover">♫</div>

            <h3>${escapeHTML(song.title)}</h3>

            <p>${escapeHTML(song.artist)}</p>

            <button class="song-play" data-index="${originalIndex}">
                ▶ Play Song
            </button>

        `;

        musicGrid.appendChild(card);

    });

});


// MUSIC PROGRESS

audioPlayer.addEventListener("timeupdate", () => {

    if (!audioPlayer.duration) return;

    progressBar.value =
        (audioPlayer.currentTime / audioPlayer.duration) * 100;

    document.getElementById("currentTime").textContent =
        formatTime(audioPlayer.currentTime);

    document.getElementById("duration").textContent =
        formatTime(audioPlayer.duration);

});


// SEEK MUSIC

progressBar.addEventListener("input", () => {

    if (!audioPlayer.duration) return;

    audioPlayer.currentTime =
        (progressBar.value / 100) * audioPlayer.duration;

});


// VOLUME CONTROL

volumeBar.addEventListener("input", () => {

    audioPlayer.volume = volumeBar.value;

});

audioPlayer.volume = volumeBar.value;


// FORMAT TIME

function formatTime(seconds) {

    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = Math.floor(seconds % 60);

    return minutes + ":" + String(remainingSeconds).padStart(2, "0");

}


// AUTOMATICALLY PLAY NEXT SONG

audioPlayer.addEventListener("ended", () => {

    if (songs.length > 0) {

        const nextIndex = (currentSongIndex + 1) % songs.length;

        playSong(nextIndex);

    }

});


// INITIALIZE MZUKI

displayMusic();

console.log("MZUKI music platform initialized successfully!");
