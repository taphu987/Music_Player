/**====================Music Player====================== */

/**
 * 1. Render Songs
 * 2. scroll top
 * 3. Play/ Pause / Seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when end
 * 8. Active songs
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "PLAYER_STORAGE";

const player = $(".player");
const cd = $(".cd");
const header = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const playlist = $(".playlist");

const app = {
  currentIndex: 0,

  isPlaying: false,

  isRandom: false,

  isRepeat: false,

  isPlayedSong: [],

  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

  songs: [
    {
      name: "Thương Em",
      singer: "Châu Khải Phong, ACV",
      path: "./assets/music/song1.mp3",
      image: "./assets/img/song1.jpg",
    },
    {
      name: "Không Thể Yêu, Không Thể Quên",
      singer: "Khang Việt",
      path: "./assets/music/song2.mp3",
      image: "./assets/img/song2.jpg",
    },
    {
      name: "Đám Cưới Nha?",
      singer: "Hồng Thanh, DJ Mie",
      path: "./assets/music/song3.mp3",
      image: "./assets/img/song3.jpg",
    },
    {
      name: "Trọn Vẹn Nghĩa Tình",
      singer: "Ưng Hoàng Phúc, Wowy",
      path: "./assets/music/song4.mp3",
      image: "./assets/img/song4.jpg",
    },
    {
      name: "Chờ Ngày Cưới Em",
      singer: "Phát Hồ, Hương Ly, X2X",
      path: "./assets/music/song5.mp3",
      image: "./assets/img/song5.jpg",
    },
    {
      name: "Thương Em Lắm",
      singer: "Tân Chề",
      path: "./assets/music/song6.mp3",
      image: "./assets/img/song6.jpg",
    },
    {
      name: "Sau Lưng Anh Có Ai Kìa",
      singer: "Thiều Bảo Trâm",
      path: "./assets/music/song7.mp3",
      image: "./assets/img/song7.jpg",
    },
    {
      name: "Có Không Giữa, Mất Đừng Tìm",
      singer: "Trúc Nhân",
      path: "./assets/music/song8.mp3",
      image: "./assets/img/song8.jpg",
    },
    {
      name: "Bản Tình Ca Mùa Đông",
      singer: "Mr.B",
      path: "./assets/music/song9.mp3",
      image: "./assets/img/song9.jpg",
    },
    {
      name: "Muốn Em Là",
      singer: "Keyo",
      path: "./assets/music/song10.mp3",
      image: "./assets/img/song10.jpg",
    },
  ],

  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },

  // Tạo hàm render để render bài hát ra view
  render: function () {
    var htmls = this.songs.map(function (song, index) {
      return `
           <div class="song ${
             index === app.currentIndex ? "active" : ""
           }" data-index="${index}">
             <div class="thumb"
               style="background-image: url('${song.image}')">
             </div>
             <div class="body">
               <h3 class="title">${song.name}</h3>
               <p class="author">${song.singer}</p>
             </div>
             <div class="option">
               <i class="fas fa-ellipsis-h"></i>
             </div>
           </div>
       `;
    });
    // console.log(typeof htmls.join(""));
    playlist.innerHTML = htmls.join("");
  },
  // Định nghĩa các thụộc tính
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents: function () {
    // console.log([cd]);
    const cdWidth = cd.offsetWidth;

    // Xử lý CD quay tròn / Dừng quay tròn
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 8000, // 8 giây
        iterations: Infinity, // timeing function (quay Vô hạn)
      }
    );
    cdThumbAnimate.pause();
    // console.log(cdThumb.animate(null));

    // Xử lý phóng to / thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = document.documentElement.scrollTop || window.scrollY;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xử lý khi click nút Play
    playBtn.onclick = function () {
      if (app.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi Song được Play
    audio.onplay = function () {
      app.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // Khi Song bị Pause
    audio.onpause = function () {
      app.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercents = (audio.currentTime / audio.duration) * 100;
        progress.value = progressPercents;
      }
    };

    // Xử lý khi tua nhanh bài hát (song)
    progress.oninput = function (event) {
      const seekTime = (event.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
    };

    // Xử lý khi Next bài hát (song)
    nextBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.nextSong();
      }
      audio.play();
      app.activeSong();
      // app.render();
      app.srollToActiveSong();
    };

    // Xử lý khi Prev bài hát (song)
    prevBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.prevSong();
      }
      audio.play();
      app.activeSong();
      // app.render();
      app.srollToActiveSong();
    };

    // Xử lý khi Bật / tắt Random bài hát (song)
    randomBtn.onclick = function () {
      // if (app.isRandom) {
      //   app.isRandom = false;
      //   randomBtn.classList.add("active");
      // } else {
      //   app.isRandom = true;
      //   randomBtn.classList.remove("active");
      // }

      app.isRandom = !app.isRandom;
      app.setConfig("isRandom", app.isRandom);
      randomBtn.classList.toggle("active", app.isRandom);
    };

    // Xử lý phát lại 1 bài hát
    repeatBtn.onclick = function () {
      app.isRepeat = !app.isRepeat;
      app.setConfig("isRepeat", app.isRepeat);
      repeatBtn.classList.toggle("active", app.isRepeat);
    };

    // Xử lý qua bài tiếp theo / phat lai khi hết bài (next song when audio end)
    audio.onended = function () {
      if (app.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Lắng nghe hành vi click vào playlist
    playlist.onclick = function (event) {
      const songNode = event.target.closest(".song:not(.active)");
      const optionNode = event.target.closest(".option");
      if (songNode || optionNode) {
        // Xử lý khi click vào song
        if (songNode && !optionNode) {
          app.currentIndex = Number(songNode.dataset.index);
          app.loadCurrentSong();
          app.render();
          audio.play();
          app.srollToActiveSong();
        }
        // Xử lý khi click vào Option
        else if (optionNode) {
          console.log("event.target:", event.target, "optionNode:", optionNode);
        }
      }
    };
  },

  loadCurrentSong: function () {
    // console.log(header, cdThumb, audio);

    header.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
    audio.src = this.currentSong.path;
  },

  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;

    // Object.assign(this, this.config);
  },

  activeSong: function () {
    // var loopSongs = $$(".song");
    // for (song of loopSongs) {
    //   song.classList.remove("active");
    // }
    // const activeSong = loopSongs[this.currentIndex];
    // activeSong.classList.add("active");

    const itemSong = $$(".song");
    itemSong.forEach((item, index) => {
      if (index === this.currentIndex) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    // this.activeSong();
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
    // this.activeSong();
  },

  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (
      this.isPlayedSong.includes(newIndex) ||
      newIndex === this.currentIndex
    );
    if (this.isPlayedSong.length === this.songs.length) {
      this.isPlayedSong = [];
    }
    this.currentIndex = newIndex;
    this.isPlayedSong.push(newIndex);
    this.loadCurrentSong();
    console.log(this.isPlayedSong);
  },

  srollToActiveSong: function () {
    setTimeout(function () {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }, 400);
  },

  start: function () {
    // Gắn cấu hình từ config vào ứng dụng
    this.loadConfig();

    // Định nghĩa các thuộc tính cho Object
    this.defineProperties();

    // Lắng nghe và Xử lý sự kiện (DOM events)
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI (Users Interface) khi chạy App
    this.loadCurrentSong();

    // Render lại danh sách bài hát (playlist)
    this.render(); // chạy song song 2 việc, vừa start vừa render và chỉ gọi mỗi start để thực hiện 2 việc.

    randomBtn.classList.toggle("active", app.isRandom);

    repeatBtn.classList.toggle("active", app.isRepeat);
  },
};

app.start();

/**================================================================ */
