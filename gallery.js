const photos = Array.from(document.querySelectorAll(".gallery_item img"));
const popup = document.querySelector(".popup");
const popup_close = document.querySelector(".popup_close");
const popup_img = document.querySelector(".popup_img");
const arrow_left = document.querySelector(".popup_arrow--left");
const arrow_right = document.querySelector(".popup_arrow--right");

let currentImgIndex = 0;
// console.log("Cała tablica zdjęć",photos)
// console.log("POPUP",popup)
// console.log("POPUP CLOSE",popup_close)
let isDragging = false;
let startPos = 0;
let endPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;
let slideImage;

//Index to jest nasz numer zdjęcia w tablicy photos (czyli 0, 1, 2, 3,)
photos.forEach((photo, index) => {
  const showPopup = (e) => {
    popup.classList.remove("hidden");
    popup_img.src = e.target.src;
    currentImgIndex = index;
    console.log("currentImgIndex", currentImgIndex);
    // console.log("INDEX",index)
    popup.addEventListener("touchstart", touchStart(index));
    popup.addEventListener("touchend", touchEnd);
    popup.addEventListener("touchmove", touchMove);
  };

  photo.addEventListener("click", showPopup);
  // console.log(showPopup)
});
function touchStart() {
  return function (event) {
    startPos = getPositionX(event);
    isDragging = true;
    popup.classList.add("grabbing");
    // console.log("startPos",startPos)
  };
}
// touchMove pobiera pozycję X kursora i odejmuje od niej pozycję X kursora w momencie kliknięcia dzięki czemu otrzymujemy wartość o jaką przesunęliśmy kursor
function touchMove(event) {
  if (isDragging) {
    const endPosition = getPositionX(event);
    currentTranslate = prevTranslate + endPosition - startPos;
    // console.log("currentTranslate",prevTranslate)
  }
}
//touch end jest to funkcja, która po zakończeniu dotyku ekranu sprawdza czy przesunęliśmy kursor o więcej niż 30px w lewo lub prawo, jeśli tak to zwiększa lub zmniejsza index o 1 i wyświetla zdjęcie z tablicy photos o tym indexie
function touchEnd() {
  isDragging = false;
  const movedBy = currentTranslate;
  // console.log("movedBy",movedBy);
  // console.log("prevTranslate",prevTranslate)
  //Increment
  if (movedBy < -30 && currentImgIndex < photos.length - 1)
    currentImgIndex += 1; //od 1-5
  // if(currentImgIndex === photos.length -1 && movedBy < -30) currentImgIndex = 0;

  //Decrement
  if (movedBy > 30 && currentImgIndex > 0) currentImgIndex -= 1; //od 5-1
  // if (currentImgIndex === 0)  currentImgIndex = photos.length - 1;

  changePhotoByIndex();
  // console.log("currentImgIndex",currentImgIndex)
  popup.classList.remove("grabbing");
}
function getPositionX(event) {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}

function changePhotoByIndex() {
  popup_img.src = photos[currentImgIndex].src;
}

//Sprawdzamy czy jesteśmy na ostatnim zdjęciu, jeśli tak to wracamy do pierwszego zdjęcia (czyli 0) jeżeli nie to dodajemy 1 do indexu
// potem do popup_img.src przypisujemy zdjęcie z tablicy photos z indexem currentImgIndex
//po czym zostaje ono wyświetlone w popup_img czyli na naszym ekranie
const showNextImg = () => {
  if (currentImgIndex === photos.length - 1) {
    // currentImgIndex = 0;
    return;
  } else {
    currentImgIndex++;
  }
  popup_img.src = photos[currentImgIndex].src;
};

//To samo co wyżej tylko że odejmujemy 1 od indexu
const showPreviousImg = () => {
  if (currentImgIndex === 0) {
    // currentImgIndex = photos.length - 1;
    return;
  } else {
    currentImgIndex--;
  }
  popup_img.src = photos[currentImgIndex].src;
};
//Zamykamy popup dodając klasę hidden i usuwając klasę fade-out po 300ms
const closePopup = () => {
  popup.classList.add("fade-out");
  setTimeout(() => {
    popup.classList.add("hidden");
    popup.classList.remove("fade-out");
  }, 300);
};

popup_close.addEventListener("click", closePopup);
arrow_right.addEventListener("click", showNextImg);
arrow_left.addEventListener("click", showPreviousImg);

//Klawisze strzałek i escape
document.addEventListener("keydown", (e) => {
  if (!popup.classList.contains("hidden")) {
    if (e.code === "ArrowRight" || e.keyCode === 39) {
      showNextImg();
    }

    if (e.code === "ArrowLeft" || e.keyCode === 37) {
      showPreviousImg();
    }

    if (e.code === "Escape" || e.keyCode === 27) {
      closePopup();
    }
  }
});
