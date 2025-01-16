---
id: 655b4dad1d38ff7cdd65cbfe
title: Step 99
challengeType: 0
dashedName: step-99
---

# --description--

With everything set in place, call the `pauseSong()`, `setPlayerDisplay()`, `highlightCurrentSong()`, and `setPlayButtonAccessibleText()` functions to correctly update the player.

Congratulations on completing your music player! Now that we've finished testing and using the shorter songs, we've replaced them with the original tracks specially selected by Quincy for you to enjoy.

# --hints--

You should call the `pauseSong` function.

```js
const splitter = code.split('audio.addEventListener("ended", () => {')
assert.match(splitter[1], /pauseSong\(\s*\)\s*;?/)
```

You should call the `setPlayerDisplay` function.

```js
const splitter = code.split('audio.addEventListener("ended", () => {')
assert.match(splitter[1], /setPlayerDisplay\(\s*\)\s*;?/)
```

You should call the `highlightCurrentSong` function.

```js
const splitter = code.split('audio.addEventListener("ended", () => {')
assert.match(splitter[1], /highlightCurrentSong\(\s*\)\s*;?/)
```

You should call the `setPlayButtonAccessibleText` function.

```js
const splitter = code.split('audio.addEventListener("ended", () => {')
assert.match(splitter[1], /highlightCurrentSong\(\s*\)\s*;?\s*setPlayButtonAccessibleText\(\s*\)\s*;?/)
```

# --seed--

## --seed-contents--

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Lato&family=Roboto+Mono&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="styles.css" />
    <title>
      Learn Basic String and Array Methods by Building a Music Player App
    </title>
  </head>

  <body>
    <div class="container">
      <div class="player">
        <div class="player-bar">
          <div class="parallel-lines">
            <div></div>
            <div></div>
          </div>
          <h1 class="fcc-title">freeCodeCamp</h1>
          <div class="parallel-lines">
            <div></div>
            <div></div>
          </div>
        </div>
        <div class="player-content">
          <div id="player-album-art">
            <img
              src="https://cdn.freecodecamp.org/curriculum/js-music-player/quincy-larson-album-art.jpg"
              alt="song cover art"
            />
          </div>
          <div class="player-display">
            <div class="player-display-song-artist">
              <p id="player-song-title"></p>
              <p id="player-song-artist"></p>
            </div>
            <div class="player-buttons">
              <button id="previous" class="previous" aria-label="Previous">
                <svg
                  width="24"
                  height="19"
                  viewBox="0 0 24 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                ><path d="M23.2248 0L7.03964 9.5L23.2248 19L23.2248 0Z" /><rect
                    width="4.63633"
                    height="18.5453"
                    transform="matrix(-1 0 0 1 4.63633 0)"/></svg>
              </button>
              <button id="play" class="play" aria-label="Play">
                <svg
                  width="17"
                  height="19"
                  viewBox="0 0 17 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                > <path d="M0 0L16.1852 9.5L1.88952e-07 19L0 0Z" /></svg>
              </button>
              <button id="pause" class="pause" aria-label="Pause">
                <svg
                  width="17"
                  height="19"
                  viewBox="0 0 17 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                ><path d="M0 6.54013e-07H4.75V19H0V6.54013e-07Z" /> <path d="M11.4 0H16.15V19H11.4V0Z" /></svg>
              </button>
              <button id="next" class="next" aria-label="Next">
                <svg
                  width="24"
                  height="19"
                  viewBox="0 0 24 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                ><path d="M0 0L16.1852 9.5L1.88952e-07 19L0 0Z" /> <rect x="18.5885" width="4.63633" height="18.5453" /></svg>
              </button>
              <button id="shuffle" class="shuffle" aria-label="Shuffle">
                <svg
                  width="17"
                  height="14"
                  viewBox="0 0 17 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                ><path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.2127 0L17 2.9219L12.0759 5.60686L12.1321 3.30594C11.9081 3.30997 11.7043 3.3165 11.528 3.326C11.3777 3.3341 11.2523 3.34411 11.1542 3.35578C11.1053 3.3616 11.0661 3.36749 11.036 3.37309C11.0211 3.37587 11.0095 3.37835 11.001 3.38041C10.9967 3.38143 10.9936 3.38227 10.9913 3.38289C10.989 3.38352 10.988 3.38385 10.9881 3.38382C10.9266 3.40381 10.7572 3.5014 10.4637 3.73265C10.1895 3.94866 9.85452 4.24234 9.47614 4.59282C8.81462 5.20556 8.03912 5.97461 7.25609 6.76752C8.03912 7.56043 8.81462 8.32948 9.47614 8.94223C9.85452 9.29271 10.1895 9.58639 10.4637 9.80239C10.7572 10.0336 10.9266 10.1312 10.9881 10.1512C10.988 10.1512 10.989 10.1515 10.9913 10.1522C10.9936 10.1528 10.9967 10.1536 11.001 10.1546C11.0095 10.1567 11.0211 10.1592 11.036 10.162C11.0661 10.1676 11.1053 10.1734 11.1542 10.1793C11.2523 10.1909 11.3777 10.2009 11.528 10.209C11.7043 10.2185 11.9081 10.2251 12.1321 10.2291L12.0759 7.92819L17 10.6131L12.2127 13.535L12.1558 11.2011C11.9071 11.197 11.677 11.1899 11.4757 11.1791C11.175 11.1629 10.8757 11.1361 10.6878 11.0751C10.4405 10.9947 10.1465 10.7892 9.86244 10.5654C9.55904 10.3263 9.20251 10.0129 8.81601 9.6549C8.14192 9.03051 7.35822 8.2533 6.57518 7.46052C6.2731 7.76927 5.9736 8.07675 5.68453 8.37353C5.24051 8.8294 4.82109 9.26001 4.45467 9.63114C4.10458 9.98574 3.79502 10.2941 3.54834 10.5285C3.42516 10.6455 3.31437 10.7473 3.22005 10.8285C3.13287 10.9035 3.03686 10.9812 2.94938 11.0324C2.46156 11.3178 1.79381 11.3751 1.32395 11.3812C1.07514 11.3845 0.852462 11.3732 0.692065 11.3611C0.611577 11.3551 0.546037 11.3488 0.499864 11.344C0.476761 11.3415 0.458455 11.3394 0.445496 11.3379L0.43012 11.336L0.425557 11.3355L0.423542 11.3352C0.423448 11.3352 0.423143 11.3352 0.485767 10.8535L0.423542 11.3352C0.157529 11.3006 -0.0304782 11.0569 0.00410824 10.7909C0.0386807 10.525 0.282182 10.3374 0.548069 10.3718C0.548087 10.3718 0.548051 10.3718 0.548069 10.3718L0.549944 10.372L0.559616 10.3732C0.568682 10.3743 0.582871 10.3759 0.60165 10.3779C0.639243 10.3818 0.695017 10.3872 0.764728 10.3924C0.90473 10.4029 1.09799 10.4127 1.31133 10.4099C1.76571 10.404 2.20705 10.3412 2.4587 10.194C2.45847 10.1941 2.4583 10.1942 2.4587 10.194C2.46075 10.1926 2.47161 10.1855 2.49271 10.1693C2.51674 10.1508 2.54777 10.1254 2.58634 10.0922C2.66358 10.0258 2.7615 9.93612 2.87917 9.82431C3.11419 9.60097 3.41488 9.30164 3.76339 8.94864C4.1317 8.57559 4.54478 8.15147 4.98424 7.70025C5.27761 7.39904 5.58273 7.08575 5.89415 6.76752C5.58272 6.44928 5.27759 6.13598 4.98421 5.83476C4.54476 5.38355 4.1317 4.95944 3.76339 4.5864C3.41488 4.2334 3.11419 3.93407 2.87917 3.71074C2.7615 3.59892 2.66358 3.50929 2.58634 3.44281C2.54777 3.40961 2.51674 3.38425 2.49271 3.36577C2.4716 3.34954 2.46099 3.34258 2.45894 3.34123C2.45868 3.34108 2.45853 3.34096 2.45894 3.34123C2.2073 3.19405 1.76572 3.13106 1.31133 3.12515C1.09799 3.12238 0.90473 3.13211 0.764728 3.14261C0.695017 3.14784 0.639243 3.15321 0.60165 3.15717C0.582871 3.15915 0.568682 3.16077 0.559616 3.16184L0.549944 3.16301L0.548391 3.1632C0.282436 3.1977 0.0386882 3.01013 0.00410824 2.74417C-0.0304782 2.47816 0.15713 2.23447 0.423143 2.19989L0.485767 2.68154C0.423143 2.19989 0.423048 2.1999 0.423143 2.19989L0.425557 2.19958L0.43012 2.199L0.445496 2.19714C0.458455 2.19561 0.476761 2.19352 0.499864 2.19109C0.546037 2.18622 0.611577 2.17995 0.692065 2.17391C0.852462 2.16188 1.07514 2.15058 1.32395 2.15381C1.79381 2.15992 2.46156 2.21726 2.94938 2.50267C3.03686 2.55385 3.13287 2.63152 3.22005 2.70655C3.31437 2.78773 3.42516 2.8895 3.54834 3.00655C3.79502 3.24097 4.10458 3.54931 4.45467 3.9039C4.82109 4.27504 5.24052 4.70565 5.68455 5.16153C5.97361 5.4583 6.2731 5.76578 6.57518 6.07452C7.35822 5.28174 8.14192 4.50454 8.81601 3.88014C9.20251 3.52214 9.55904 3.20872 9.86244 2.96964C10.1465 2.74581 10.4405 2.54035 10.6878 2.45997C10.8757 2.39892 11.175 2.37219 11.4757 2.35598C11.677 2.34514 11.9071 2.33807 12.1558 2.33396L12.2127 0Z"
                  /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="playlist">
        <div class="playlist-bar">
          <div class="parallel-lines">
            <div></div>
            <div></div>
          </div>
          <h2 class="playlist-title" id="playlist">Playlist</h2>
          <div class="parallel-lines">
            <div></div>
            <div></div>
          </div>
        </div>
        <ul id="playlist-songs"></ul>
      </div>
    </div>
    <script src="script.js"></script>
  </body>
</html>
```

```css
:root {
  /* colors */
  --primary-color: #dfdfe2;
  --secondary-color: #ffffff;
  --app-background-color: #4d4d62;
  --background-color: #1b1b32;
  --foreground-color: #3b3b4f;
  --highlight-color: #f1be32;

  /* font sizes */
  --root-font-size: 16px;
  font-size: var(--root-font-size);

  /* font-families */
  --font-headline: "Roboto Mono", monospace;
  --font-family: "Lato", sans-serif;
}

*,
*::after,
*::before {
  box-sizing: border-box;
}

body {
  background-color: var(--app-background-color);
  color: var(--primary-color);
  font-family: var(--font-family);
}

h1 {
  font-size: 1.125rem;
  line-height: 1.6;
}

h2 {
  font-size: var(--root-font-size);
}

ul {
  margin: 0;
}

.container {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 5px;
}

.player,
.playlist {
  width: 450px;
  background-color: var(--background-color);
  border: 3px solid var(--foreground-color);
}

.player {
  height: 260px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 10px;
}

.player-bar,
.playlist-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
  width: 100%;
  height: 30px;
  background-color: var(--foreground-color);
}

.parallel-lines {
  display: flex;
  flex-wrap: wrap;
  row-gap: 6px;
  padding: 0 5px;
}

.parallel-lines > div {
  height: 2px;
  width: 100%;
  min-width: 75px;
  background-color: var(--highlight-color);
}

.fcc-title,
.playlist-title {
  color: var(--secondary-color);
  margin: 0 10px;
  font-family: var(--font-headline);
}

.player-content {
  display: flex;
  background-color: var(--foreground-color);
  width: 430px;
  height: 200px;
  column-gap: 13px;
  align-items: center;
  justify-content: center;
}

#player-album-art {
  background-color: var(--secondary-color);
  border: 6px solid var(--background-color);
}

#player-album-art img {
  width: 150px;
  display: block;
}

.player-display {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  padding: 14px;
  background-color: var(--background-color);
  height: 153px;
  width: 226px;
}

.player-display-song-artist {
  height: 80px;
}

.player-buttons svg {
  fill: var(--primary-color);
}

.playing > svg {
  fill: var(--highlight-color);
}

.player-buttons {
  display: flex;
  justify-content: space-around;
}

button {
  background: transparent;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: var(--root-font-size);
  outline-color: var(--highlight-color);
  text-align: center;
}

.playlist-song {
  outline-color: var(--highlight-color);
}

.playlist li:not(:last-child) {
  border-bottom: 1px solid var(--background-color);
}

button:focus,
.playlist-song:focus {
  outline-style: dashed;
  outline-width: 2px;
}

/* Playlist */
.playlist {
  height: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 10px;
}

#playlist-songs {
  width: 430px;
  height: 100%;
  background-color: var(--foreground-color);
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  padding: 8px 9px;
  visibility: visible;
  justify-content: start;
  list-style: none;
}

.playlist-song {
  display: flex;
  height: 55px;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
}

[aria-current="true"] {
  background-color: var(--background-color);
}

[aria-current="true"] p {
  color: var(--highlight-color);
}

.playlist-song-info {
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  column-gap: 7px;
  padding: 5px 0;
  font-family: var(--font-family);
}

#player-song-title,
#player-song-artist {
  margin: 0;
}

#player-song-artist {
  color: var(--highlight-color);
  font-size: 0.75rem;
}

#player-song-title {
  font-size: 1.125rem;
}

.playlist-song-title {
  font-size: 0.85rem;
  width: 241px;
  text-align: left;
}

.playlist-song-artist {
  font-size: 0.725rem;
  width: 80px;
}

.playlist-song-duration {
  font-size: 0.725rem;
  margin: auto;
  font-family: var(--font-headline);
  width: 30px;
}

.playlist-song-delete {
  padding: 0;
  width: 20px;
  height: 20px;
}

.playlist-song-delete,
.playlist-song-delete {
  fill: var(--foreground-color);
}

.playlist-song-delete:hover circle,
.playlist-song-delete:focus circle {
  fill: #ff0000;
}

@media (max-width: 700px) {
  .player,
  .playlist {
    width: 300px;
  }

  .player {
    height: 340px;
  }

  #playlist-songs {
    height: 280px;
    padding: 5px 6px;
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-color: var(--background-color) var(--secondary-color);
    scrollbar-width: thin;
  }

  #playlist-songs::-webkit-scrollbar {
    width: 5px;
  }

  #playlist-songs::-webkit-scrollbar-track {
    background: var(--background-color);
  }

  #playlist-songs::-webkit-scrollbar-thumb {
    background: var(--secondary-color);
  }

  h1 {
    font-size: 0.813rem;
  }

  h2 {
    font-size: 0.75rem;
  }

  .player-bar,
  .playlist-bar,
  .player-content,
  #playlist-songs {
    width: 280px;
  }

  .playlist-song {
    justify-content: space-between;
  }

  .playlist-song-title {
    width: 140px;
  }

  .playlist-song-artist {
    width: 40px;
  }

  .playlist-song-duration > button {
    padding: 0;
  }

  .player-content {
    display: inline;
    position: relative;
    justify-items: center;
    height: 100%;
  }

  #player-album-art {
    z-index: -100;
    height: 280px;
    box-shadow: none;
    background: #000;
  }

  #player-album-art img {
    width: 100%;
    opacity: 0.6;
  }

  .player-display-song-artist {
    padding: 0 10px;
  }

  .player-display-song-artist > p {
    white-space: pre-wrap;
  }

  .player-display {
    position: absolute;
    width: 100%;
    z-index: 1000;
    background-color: transparent;
    top: 0;
    height: 280px;
    justify-content: space-between;
    text-align: center;
  }
}
```

```js
const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");

const allSongs = [
  {
    id: 0,
    title: "Scratching The Surface",
    artist: "Quincy Larson",
    duration: "4:25",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/scratching-the-surface.mp3",
  },
  {
    id: 1,
    title: "Can't Stay Down",
    artist: "Quincy Larson",
    duration: "4:15",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/can't-stay-down.mp3",
  },
  {
    id: 2,
    title: "Still Learning",
    artist: "Quincy Larson",
    duration: "3:51",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/still-learning.mp3",
  },
  {
    id: 3,
    title: "Cruising for a Musing",
    artist: "Quincy Larson",
    duration: "3:34",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cruising-for-a-musing.mp3",
  },
  {
    id: 4,
    title: "Never Not Favored",
    artist: "Quincy Larson",
    duration: "3:35",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/never-not-favored.mp3",
  },
  {
    id: 5,
    title: "From the Ground Up",
    artist: "Quincy Larson",
    duration: "3:12",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/from-the-ground-up.mp3",
  },
  {
    id: 6,
    title: "Walking on Air",
    artist: "Quincy Larson",
    duration: "3:25",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/walking-on-air.mp3",
  },
  {
    id: 7,
    title: "Can't Stop Me. Can't Even Slow Me Down.",
    artist: "Quincy Larson",
    duration: "3:52",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cant-stop-me-cant-even-slow-me-down.mp3",
  },
  {
    id: 8,
    title: "The Surest Way Out is Through",
    artist: "Quincy Larson",
    duration: "3:10",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/the-surest-way-out-is-through.mp3",
  },
  {
    id: 9,
    title: "Chasing That Feeling",
    artist: "Quincy Larson",
    duration: "2:43",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/chasing-that-feeling.mp3",
  },
];

const audio = new Audio();
let userData = {
  songs: [...allSongs],
  currentSong: null,
  songCurrentTime: 0,
};

const playSong = (id) => {
  const song = userData?.songs.find((song) => song.id === id);
  audio.src = song.src;
  audio.title = song.title;

  if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData?.songCurrentTime;
  }
  userData.currentSong = song;
  playButton.classList.add("playing");

  highlightCurrentSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
  audio.play();
};

const pauseSong = () => {
  userData.songCurrentTime = audio.currentTime;
  
  playButton.classList.remove("playing");
  audio.pause();
};

const playNextSong = () => {
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    const currentSongIndex = getCurrentSongIndex();
    const nextSong = userData?.songs[currentSongIndex + 1];

    playSong(nextSong.id);
  }
};

const playPreviousSong = () => {
   if (userData?.currentSong === null) return;
   else {
    const currentSongIndex = getCurrentSongIndex();
    const previousSong = userData?.songs[currentSongIndex - 1];

    playSong(previousSong.id);
   }
};

const shuffle = () => {
  userData?.songs.sort(() => Math.random() - 0.5);
  userData.currentSong = null;
  userData.songCurrentTime = 0;

  renderSongs(userData?.songs);
  pauseSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
};

const deleteSong = (id) => {
  if (userData?.currentSong?.id === id) {
    userData.currentSong = null;
    userData.songCurrentTime = 0;

    pauseSong();
    setPlayerDisplay();
  }

  userData.songs = userData?.songs.filter((song) => song.id !== id);
  renderSongs(userData?.songs); 
  highlightCurrentSong(); 
  setPlayButtonAccessibleText(); 

};

const setPlayerDisplay = () => {
  const playingSong = document.getElementById("player-song-title");
  const songArtist = document.getElementById("player-song-artist");
  const currentTitle = userData?.currentSong?.title;
  const currentArtist = userData?.currentSong?.artist;

  playingSong.textContent = currentTitle ? currentTitle : "";
  songArtist.textContent = currentArtist ? currentArtist : "";
};

const highlightCurrentSong = () => {
  const playlistSongElements = document.querySelectorAll(".playlist-song");
  const songToHighlight = document.getElementById(
    `song-${userData?.currentSong?.id}`
  );

  playlistSongElements.forEach((songEl) => {
    songEl.removeAttribute("aria-current");
  });

  if (songToHighlight) songToHighlight.setAttribute("aria-current", "true");
};

const renderSongs = (array) => {
  const songsHTML = array
    .map((song)=> {
      return `
      <li id="song-${song.id}" class="playlist-song">
      <button class="playlist-song-info" onclick="playSong(${song.id})">
          <span class="playlist-song-title">${song.title}</span>
          <span class="playlist-song-artist">${song.artist}</span>
          <span class="playlist-song-duration">${song.duration}</span>
      </button>
      <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg>
        </button>
      </li>
      `;
    })
    .join("");

  playlistSongs.innerHTML = songsHTML;

  if (userData?.songs.length === 0) {
    const resetButton = document.createElement("button");
    const resetText = document.createTextNode("Reset Playlist");

    resetButton.id = "reset";
    resetButton.ariaLabel = "Reset playlist";
    resetButton.appendChild(resetText);
    playlistSongs.appendChild(resetButton);

    resetButton.addEventListener("click", () => {
      userData.songs = [...allSongs];

      renderSongs(sortSongs()); 
      setPlayButtonAccessibleText();
      resetButton.remove();
    });

  };

};

const setPlayButtonAccessibleText = () => {
  const song = userData?.currentSong || userData?.songs[0];

  playButton.setAttribute(
    "aria-label",
    song?.title ? `Play ${song.title}` : "Play"
  );
};

const getCurrentSongIndex = () => userData?.songs.indexOf(userData?.currentSong);

playButton.addEventListener("click", () => {
    if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    playSong(userData?.currentSong.id);
  }
});

pauseButton.addEventListener("click",  pauseSong);

nextButton.addEventListener("click", playNextSong);

previousButton.addEventListener("click", playPreviousSong);

shuffleButton.addEventListener("click", shuffle);

audio.addEventListener("ended", () => {
  const currentSongIndex = getCurrentSongIndex();
  const nextSongExists = userData?.songs[currentSongIndex + 1] !== undefined;

    if (nextSongExists) {
      playNextSong();
    } else {
      userData.currentSong = null;
      userData.songCurrentTime = 0;  
--fcc-editable-region--


--fcc-editable-region--
    }
});

const sortSongs = () => {
  userData?.songs.sort((a,b) => {
    if (a.title < b.title) {
      return -1;
    }

    if (a.title > b.title) {
      return 1;
    }

    return 0;
  });

  return userData?.songs;
};

renderSongs(sortSongs());
setPlayButtonAccessibleText();
```

# --solutions--

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Lato&family=Roboto+Mono&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="styles.css" />
    <title>
      Learn Basic String and Array Methods by Building a Music Player App
    </title>
  </head>

  <body>
    <div class="container">
      <div class="player">
        <div class="player-bar">
          <div class="parallel-lines">
            <div></div>
            <div></div>
          </div>
          <h1 class="fcc-title">freeCodeCamp</h1>
          <div class="parallel-lines">
            <div></div>
            <div></div>
          </div>
        </div>
        <div class="player-content">
          <div id="player-album-art">
            <img
              src="https://cdn.freecodecamp.org/curriculum/js-music-player/quincy-larson-album-art.jpg"
              alt="song cover art"
            />
          </div>
          <div class="player-display">
            <div class="player-display-song-artist">
              <p id="player-song-title"></p>
              <p id="player-song-artist"></p>
            </div>
            <div class="player-buttons">
              <button id="previous" class="previous" aria-label="Previous">
                <svg
                  width="24"
                  height="19"
                  viewBox="0 0 24 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                ><path d="M23.2248 0L7.03964 9.5L23.2248 19L23.2248 0Z" /><rect
                    width="4.63633"
                    height="18.5453"
                    transform="matrix(-1 0 0 1 4.63633 0)"/></svg>
              </button>
              <button id="play" class="play" aria-label="Play">
                <svg
                  width="17"
                  height="19"
                  viewBox="0 0 17 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                > <path d="M0 0L16.1852 9.5L1.88952e-07 19L0 0Z" /></svg>
              </button>
              <button id="pause" class="pause" aria-label="Pause">
                <svg
                  width="17"
                  height="19"
                  viewBox="0 0 17 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                ><path d="M0 6.54013e-07H4.75V19H0V6.54013e-07Z" /> <path d="M11.4 0H16.15V19H11.4V0Z" /></svg>
              </button>
              <button id="next" class="next" aria-label="Next">
                <svg
                  width="24"
                  height="19"
                  viewBox="0 0 24 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                ><path d="M0 0L16.1852 9.5L1.88952e-07 19L0 0Z" /> <rect x="18.5885" width="4.63633" height="18.5453" /></svg>
              </button>
              <button id="shuffle" class="shuffle" aria-label="Shuffle">
                <svg
                  width="17"
                  height="14"
                  viewBox="0 0 17 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                ><path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.2127 0L17 2.9219L12.0759 5.60686L12.1321 3.30594C11.9081 3.30997 11.7043 3.3165 11.528 3.326C11.3777 3.3341 11.2523 3.34411 11.1542 3.35578C11.1053 3.3616 11.0661 3.36749 11.036 3.37309C11.0211 3.37587 11.0095 3.37835 11.001 3.38041C10.9967 3.38143 10.9936 3.38227 10.9913 3.38289C10.989 3.38352 10.988 3.38385 10.9881 3.38382C10.9266 3.40381 10.7572 3.5014 10.4637 3.73265C10.1895 3.94866 9.85452 4.24234 9.47614 4.59282C8.81462 5.20556 8.03912 5.97461 7.25609 6.76752C8.03912 7.56043 8.81462 8.32948 9.47614 8.94223C9.85452 9.29271 10.1895 9.58639 10.4637 9.80239C10.7572 10.0336 10.9266 10.1312 10.9881 10.1512C10.988 10.1512 10.989 10.1515 10.9913 10.1522C10.9936 10.1528 10.9967 10.1536 11.001 10.1546C11.0095 10.1567 11.0211 10.1592 11.036 10.162C11.0661 10.1676 11.1053 10.1734 11.1542 10.1793C11.2523 10.1909 11.3777 10.2009 11.528 10.209C11.7043 10.2185 11.9081 10.2251 12.1321 10.2291L12.0759 7.92819L17 10.6131L12.2127 13.535L12.1558 11.2011C11.9071 11.197 11.677 11.1899 11.4757 11.1791C11.175 11.1629 10.8757 11.1361 10.6878 11.0751C10.4405 10.9947 10.1465 10.7892 9.86244 10.5654C9.55904 10.3263 9.20251 10.0129 8.81601 9.6549C8.14192 9.03051 7.35822 8.2533 6.57518 7.46052C6.2731 7.76927 5.9736 8.07675 5.68453 8.37353C5.24051 8.8294 4.82109 9.26001 4.45467 9.63114C4.10458 9.98574 3.79502 10.2941 3.54834 10.5285C3.42516 10.6455 3.31437 10.7473 3.22005 10.8285C3.13287 10.9035 3.03686 10.9812 2.94938 11.0324C2.46156 11.3178 1.79381 11.3751 1.32395 11.3812C1.07514 11.3845 0.852462 11.3732 0.692065 11.3611C0.611577 11.3551 0.546037 11.3488 0.499864 11.344C0.476761 11.3415 0.458455 11.3394 0.445496 11.3379L0.43012 11.336L0.425557 11.3355L0.423542 11.3352C0.423448 11.3352 0.423143 11.3352 0.485767 10.8535L0.423542 11.3352C0.157529 11.3006 -0.0304782 11.0569 0.00410824 10.7909C0.0386807 10.525 0.282182 10.3374 0.548069 10.3718C0.548087 10.3718 0.548051 10.3718 0.548069 10.3718L0.549944 10.372L0.559616 10.3732C0.568682 10.3743 0.582871 10.3759 0.60165 10.3779C0.639243 10.3818 0.695017 10.3872 0.764728 10.3924C0.90473 10.4029 1.09799 10.4127 1.31133 10.4099C1.76571 10.404 2.20705 10.3412 2.4587 10.194C2.45847 10.1941 2.4583 10.1942 2.4587 10.194C2.46075 10.1926 2.47161 10.1855 2.49271 10.1693C2.51674 10.1508 2.54777 10.1254 2.58634 10.0922C2.66358 10.0258 2.7615 9.93612 2.87917 9.82431C3.11419 9.60097 3.41488 9.30164 3.76339 8.94864C4.1317 8.57559 4.54478 8.15147 4.98424 7.70025C5.27761 7.39904 5.58273 7.08575 5.89415 6.76752C5.58272 6.44928 5.27759 6.13598 4.98421 5.83476C4.54476 5.38355 4.1317 4.95944 3.76339 4.5864C3.41488 4.2334 3.11419 3.93407 2.87917 3.71074C2.7615 3.59892 2.66358 3.50929 2.58634 3.44281C2.54777 3.40961 2.51674 3.38425 2.49271 3.36577C2.4716 3.34954 2.46099 3.34258 2.45894 3.34123C2.45868 3.34108 2.45853 3.34096 2.45894 3.34123C2.2073 3.19405 1.76572 3.13106 1.31133 3.12515C1.09799 3.12238 0.90473 3.13211 0.764728 3.14261C0.695017 3.14784 0.639243 3.15321 0.60165 3.15717C0.582871 3.15915 0.568682 3.16077 0.559616 3.16184L0.549944 3.16301L0.548391 3.1632C0.282436 3.1977 0.0386882 3.01013 0.00410824 2.74417C-0.0304782 2.47816 0.15713 2.23447 0.423143 2.19989L0.485767 2.68154C0.423143 2.19989 0.423048 2.1999 0.423143 2.19989L0.425557 2.19958L0.43012 2.199L0.445496 2.19714C0.458455 2.19561 0.476761 2.19352 0.499864 2.19109C0.546037 2.18622 0.611577 2.17995 0.692065 2.17391C0.852462 2.16188 1.07514 2.15058 1.32395 2.15381C1.79381 2.15992 2.46156 2.21726 2.94938 2.50267C3.03686 2.55385 3.13287 2.63152 3.22005 2.70655C3.31437 2.78773 3.42516 2.8895 3.54834 3.00655C3.79502 3.24097 4.10458 3.54931 4.45467 3.9039C4.82109 4.27504 5.24052 4.70565 5.68455 5.16153C5.97361 5.4583 6.2731 5.76578 6.57518 6.07452C7.35822 5.28174 8.14192 4.50454 8.81601 3.88014C9.20251 3.52214 9.55904 3.20872 9.86244 2.96964C10.1465 2.74581 10.4405 2.54035 10.6878 2.45997C10.8757 2.39892 11.175 2.37219 11.4757 2.35598C11.677 2.34514 11.9071 2.33807 12.1558 2.33396L12.2127 0Z"
                  /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="playlist">
        <div class="playlist-bar">
          <div class="parallel-lines">
            <div></div>
            <div></div>
          </div>
          <h2 class="playlist-title" id="playlist">Playlist</h2>
          <div class="parallel-lines">
            <div></div>
            <div></div>
          </div>
        </div>
        <ul id="playlist-songs"></ul>
      </div>
    </div>
    <script src="script.js"></script>
  </body>
</html>
```

```css
:root {
  /* colors */
  --primary-color: #dfdfe2;
  --secondary-color: #ffffff;
  --app-background-color: #4d4d62;
  --background-color: #1b1b32;
  --foreground-color: #3b3b4f;
  --highlight-color: #f1be32;

  /* font sizes */
  --root-font-size: 16px;
  font-size: var(--root-font-size);

  /* font-families */
  --font-headline: "Roboto Mono", monospace;
  --font-family: "Lato", sans-serif;
}

*,
*::after,
*::before {
  box-sizing: border-box;
}

body {
  background-color: var(--app-background-color);
  color: var(--primary-color);
  font-family: var(--font-family);
}

h1 {
  font-size: 1.125rem;
  line-height: 1.6;
}

h2 {
  font-size: var(--root-font-size);
}

ul {
  margin: 0;
}

.container {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 5px;
}

.player,
.playlist {
  width: 450px;
  background-color: var(--background-color);
  border: 3px solid var(--foreground-color);
}

.player {
  height: 260px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 10px;
}

.player-bar,
.playlist-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
  width: 100%;
  height: 30px;
  background-color: var(--foreground-color);
}

.parallel-lines {
  display: flex;
  flex-wrap: wrap;
  row-gap: 6px;
  padding: 0 5px;
}

.parallel-lines > div {
  height: 2px;
  width: 100%;
  min-width: 75px;
  background-color: var(--highlight-color);
}

.fcc-title,
.playlist-title {
  color: var(--secondary-color);
  margin: 0 10px;
  font-family: var(--font-headline);
}

.player-content {
  display: flex;
  background-color: var(--foreground-color);
  width: 430px;
  height: 200px;
  column-gap: 13px;
  align-items: center;
  justify-content: center;
}

#player-album-art {
  background-color: var(--secondary-color);
  border: 6px solid var(--background-color);
}

#player-album-art img {
  width: 150px;
  display: block;
}

.player-display {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  padding: 14px;
  background-color: var(--background-color);
  height: 153px;
  width: 226px;
}

.player-display-song-artist {
  height: 80px;
}

.player-buttons svg {
  fill: var(--primary-color);
}

.playing > svg {
  fill: var(--highlight-color);
}

.player-buttons {
  display: flex;
  justify-content: space-around;
}

button {
  background: transparent;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: var(--root-font-size);
  outline-color: var(--highlight-color);
  text-align: center;
}

.playlist-song {
  outline-color: var(--highlight-color);
}

.playlist li:not(:last-child) {
  border-bottom: 1px solid var(--background-color);
}

button:focus,
.playlist-song:focus {
  outline-style: dashed;
  outline-width: 2px;
}

/* Playlist */
.playlist {
  height: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 10px;
}

#playlist-songs {
  width: 430px;
  height: 100%;
  background-color: var(--foreground-color);
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  padding: 8px 9px;
  visibility: visible;
  justify-content: start;
  list-style: none;
}

.playlist-song {
  display: flex;
  height: 55px;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
}

[aria-current="true"] {
  background-color: var(--background-color);
}

[aria-current="true"] p {
  color: var(--highlight-color);
}

.playlist-song-info {
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  column-gap: 7px;
  padding: 5px 0;
  font-family: var(--font-family);
}

#player-song-title,
#player-song-artist {
  margin: 0;
}

#player-song-artist {
  color: var(--highlight-color);
  font-size: 0.75rem;
}

#player-song-title {
  font-size: 1.125rem;
}

.playlist-song-title {
  font-size: 0.85rem;
  width: 241px;
  text-align: left;
}

.playlist-song-artist {
  font-size: 0.725rem;
  width: 80px;
}

.playlist-song-duration {
  font-size: 0.725rem;
  margin: auto;
  font-family: var(--font-headline);
  width: 30px;
}

.playlist-song-delete {
  padding: 0;
  width: 20px;
  height: 20px;
}

.playlist-song-delete,
.playlist-song-delete {
  fill: var(--foreground-color);
}

.playlist-song-delete:hover circle,
.playlist-song-delete:focus circle {
  fill: #ff0000;
}

@media (max-width: 700px) {
  .player,
  .playlist {
    width: 300px;
  }

  .player {
    height: 340px;
  }

  #playlist-songs {
    height: 280px;
    padding: 5px 6px;
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-color: var(--background-color) var(--secondary-color);
    scrollbar-width: thin;
  }

  #playlist-songs::-webkit-scrollbar {
    width: 5px;
  }

  #playlist-songs::-webkit-scrollbar-track {
    background: var(--background-color);
  }

  #playlist-songs::-webkit-scrollbar-thumb {
    background: var(--secondary-color);
  }

  h1 {
    font-size: 0.813rem;
  }

  h2 {
    font-size: 0.75rem;
  }

  .player-bar,
  .playlist-bar,
  .player-content,
  #playlist-songs {
    width: 280px;
  }

  .playlist-song {
    justify-content: space-between;
  }

  .playlist-song-title {
    width: 140px;
  }

  .playlist-song-artist {
    width: 40px;
  }

  .playlist-song-duration > button {
    padding: 0;
  }

  .player-content {
    display: inline;
    position: relative;
    justify-items: center;
    height: 100%;
  }

  #player-album-art {
    z-index: -100;
    height: 280px;
    box-shadow: none;
    background: #000;
  }

  #player-album-art img {
    width: 100%;
    opacity: 0.6;
  }

  .player-display-song-artist {
    padding: 0 10px;
  }

  .player-display-song-artist > p {
    white-space: pre-wrap;
  }

  .player-display {
    position: absolute;
    width: 100%;
    z-index: 1000;
    background-color: transparent;
    top: 0;
    height: 280px;
    justify-content: space-between;
    text-align: center;
  }
}
```

```js
const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");

const allSongs = [
  {
    id: 0,
    title: "Scratching The Surface",
    artist: "Quincy Larson",
    duration: "4:25",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/scratching-the-surface.mp3",
  },
  {
    id: 1,
    title: "Can't Stay Down",
    artist: "Quincy Larson",
    duration: "4:15",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/can't-stay-down.mp3",
  },
  {
    id: 2,
    title: "Still Learning",
    artist: "Quincy Larson",
    duration: "3:51",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/still-learning.mp3",
  },
  {
    id: 3,
    title: "Cruising for a Musing",
    artist: "Quincy Larson",
    duration: "3:34",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cruising-for-a-musing.mp3",
  },
  {
    id: 4,
    title: "Never Not Favored",
    artist: "Quincy Larson",
    duration: "3:35",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/never-not-favored.mp3",
  },
  {
    id: 5,
    title: "From the Ground Up",
    artist: "Quincy Larson",
    duration: "3:12",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/from-the-ground-up.mp3",
  },
  {
    id: 6,
    title: "Walking on Air",
    artist: "Quincy Larson",
    duration: "3:25",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/walking-on-air.mp3",
  },
  {
    id: 7,
    title: "Can't Stop Me. Can't Even Slow Me Down.",
    artist: "Quincy Larson",
    duration: "3:52",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cant-stop-me-cant-even-slow-me-down.mp3",
  },
  {
    id: 8,
    title: "The Surest Way Out is Through",
    artist: "Quincy Larson",
    duration: "3:10",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/the-surest-way-out-is-through.mp3",
  },
  {
    id: 9,
    title: "Chasing That Feeling",
    artist: "Quincy Larson",
    duration: "2:43",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/chasing-that-feeling.mp3",
  },
];

const audio = new Audio();
let userData = {
  songs: [...allSongs],
  currentSong: null,
  songCurrentTime: 0,
};

const playSong = (id) => {
  const song = userData?.songs.find((song) => song.id === id);
  audio.src = song.src;
  audio.title = song.title;

  if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData?.songCurrentTime;
  }
  userData.currentSong = song;
  playButton.classList.add("playing");

  highlightCurrentSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
  audio.play();
};

const pauseSong = () => {
  userData.songCurrentTime = audio.currentTime;
  
  playButton.classList.remove("playing");
  audio.pause();
};

const playNextSong = () => {
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    const currentSongIndex = getCurrentSongIndex();
    const nextSong = userData?.songs[currentSongIndex + 1];

    playSong(nextSong.id);
  }
};

const playPreviousSong = () => {
   if (userData?.currentSong === null) return;
   else {
    const currentSongIndex = getCurrentSongIndex();
    const previousSong = userData?.songs[currentSongIndex - 1];

    playSong(previousSong.id);
   }
};

const shuffle = () => {
  userData?.songs.sort(() => Math.random() - 0.5);
  userData.currentSong = null;
  userData.songCurrentTime = 0;

  renderSongs(userData?.songs);
  pauseSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
};

const deleteSong = (id) => {
  if (userData?.currentSong?.id === id) {
    userData.currentSong = null;
    userData.songCurrentTime = 0;

    pauseSong();
    setPlayerDisplay();
  }

  userData.songs = userData?.songs.filter((song) => song.id !== id);
  renderSongs(userData?.songs); 
  highlightCurrentSong(); 
  setPlayButtonAccessibleText(); 

};

const setPlayerDisplay = () => {
  const playingSong = document.getElementById("player-song-title");
  const songArtist = document.getElementById("player-song-artist");
  const currentTitle = userData?.currentSong?.title;
  const currentArtist = userData?.currentSong?.artist;

  playingSong.textContent = currentTitle ? currentTitle : "";
  songArtist.textContent = currentArtist ? currentArtist : "";
};

const highlightCurrentSong = () => {
  const playlistSongElements = document.querySelectorAll(".playlist-song");
  const songToHighlight = document.getElementById(
    `song-${userData?.currentSong?.id}`
  );

  playlistSongElements.forEach((songEl) => {
    songEl.removeAttribute("aria-current");
  });

  if (songToHighlight) songToHighlight.setAttribute("aria-current", "true");
};

const renderSongs = (array) => {
  const songsHTML = array
    .map((song)=> {
      return `
      <li id="song-${song.id}" class="playlist-song">
      <button class="playlist-song-info" onclick="playSong(${song.id})">
          <span class="playlist-song-title">${song.title}</span>
          <span class="playlist-song-artist">${song.artist}</span>
          <span class="playlist-song-duration">${song.duration}</span>
      </button>
      <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg>
        </button>
      </li>
      `;
    })
    .join("");

  playlistSongs.innerHTML = songsHTML;

  if (userData?.songs.length === 0) {
    const resetButton = document.createElement("button");
    const resetText = document.createTextNode("Reset Playlist");

    resetButton.id = "reset";
    resetButton.ariaLabel = "Reset playlist";
    resetButton.appendChild(resetText);
    playlistSongs.appendChild(resetButton);

    resetButton.addEventListener("click", () => {
      userData.songs = [...allSongs];

      renderSongs(sortSongs()); 
      setPlayButtonAccessibleText();
      resetButton.remove();
    });

  };

};

const setPlayButtonAccessibleText = () => {
  const song = userData?.currentSong || userData?.songs[0];

  playButton.setAttribute(
    "aria-label",
    song?.title ? `Play ${song.title}` : "Play"
  );
};

const getCurrentSongIndex = () => userData?.songs.indexOf(userData?.currentSong);

playButton.addEventListener("click", () => {
    if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    playSong(userData?.currentSong.id);
  }
});

pauseButton.addEventListener("click",  pauseSong);

nextButton.addEventListener("click", playNextSong);

previousButton.addEventListener("click", playPreviousSong);

shuffleButton.addEventListener("click", shuffle);

audio.addEventListener("ended", () => {
  const currentSongIndex = getCurrentSongIndex();
  const nextSongExists = userData?.songs[currentSongIndex + 1] !== undefined;

    if (nextSongExists) {
      playNextSong();
    } else {
      userData.currentSong = null;
      userData.songCurrentTime = 0;

      pauseSong(); 
      setPlayerDisplay(); 
      highlightCurrentSong(); 
      setPlayButtonAccessibleText();
    }
});

const sortSongs = () => {
  userData?.songs.sort((a,b) => {
    if (a.title < b.title) {
      return -1;
    }

    if (a.title > b.title) {
      return 1;
    }

    return 0;
  });

  return userData?.songs;
};

renderSongs(sortSongs());
setPlayButtonAccessibleText();
```
