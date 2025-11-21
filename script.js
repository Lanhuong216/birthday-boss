// Game state
let currentScreen = "screen-intro";
let donatedAmount = 0;
let targetAmount = 5000000; // 5 củ = 5,000,000 VND
let playerWish = "";

// Khởi tạo game
document.addEventListener("DOMContentLoaded", function () {
  initializeGame();
});

function initializeGame() {
  // Setup drag and drop cho tiền
  setupDragAndDrop();

  // Setup splash screen - click để bắt đầu
  setupSplashScreen();

  // Ẩn màn intro ban đầu
  const introScreen = document.getElementById("screen-intro");
  if (introScreen) {
    introScreen.classList.remove("active");
  }
}

// Setup splash screen
function setupSplashScreen() {
  const splashScreen = document.getElementById("splash-screen");
  if (splashScreen) {
    let gameStarted = false;

    const startGame = function () {
      if (gameStarted) return;
      gameStarted = true;

      // Phát nhạc nền
      startBackgroundMusic();

      // Ẩn splash screen
      splashScreen.classList.add("hidden");

      // Hiển thị màn intro
      setTimeout(() => {
        showScreen("screen-intro");
      }, 500);
    };

    // Click vào splash screen để bắt đầu
    splashScreen.addEventListener("click", startGame);

    // Touch event cho mobile
    splashScreen.addEventListener("touchstart", startGame);
  }
}

// Phát nhạc nền loop
function startBackgroundMusic() {
  const bgMusic = document.getElementById("background-music");
  if (bgMusic) {
    bgMusic.volume = 0.7; // Điều chỉnh volume (0.0 - 1.0)
    bgMusic.loop = true; // Đảm bảo loop

    // Phát nhạc ngay (sau khi user đã click vào splash screen)
    bgMusic.play().catch((error) => {
      console.log("Lỗi phát nhạc:", error);
    });
  }
}

// Hàm chuyển màn
function showScreen(screenId) {
  // Dừng video challenge nếu đang phát và chuyển sang màn khác
  if (currentScreen === "screen-challenge" && screenId !== "screen-challenge") {
    stopChallengeVideo();
  }

  // Ẩn tất cả màn
  const screens = document.querySelectorAll(".screen");
  screens.forEach((screen) => {
    screen.classList.remove("active");
  });

  // Hiển thị màn được chọn
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add("active");
    currentScreen = screenId;

    // Xử lý logic đặc biệt cho từng màn
    handleScreenLogic(screenId);
  }
}

// Xử lý logic đặc biệt cho từng màn
function handleScreenLogic(screenId) {
  switch (screenId) {
    case "screen-intro":
      typeText("intro-text", '"Chao xìn, siu nhân bụng pự!"', 50);
      break;
    case "screen-intro-2":
      typeText(
        "intro-text-2",
        "Hôm nay là 22.11, sinh nhật của anh đúng hong nè!",
        50
      );
      break;
    case "screen-intro-3":
      typeText(
        "intro-text-3",
        "Em có làm cho anh trang web này chơi cho duii",
        50
      );
      break;
    case "screen-intro-4":
      typeText(
        "intro-text-4",
        "Hi vọng anh sẽ thấy mắc cười..\nCòn hong mắc cừi thì thui nha..",
        50
      );
      break;
    case "screen-intro-5":
      typeText("intro-text-5", "Oke dzô nhaa", 50);
      break;
    case "screen-countdown":
      startCountdown();
      break;
    case "screen-task":
      resetTask();
      break;
    case "screen-challenge":
      resetChallenge();
      setupChallengeDragAndDrop();
      startChallengeVideo();
      break;
    case "screen-congratulations":
      startFireworks();
      startCongratulationsMusic();
      break;
  }
}

// Hiệu ứng typing từng chữ
function typeText(elementId, text, speed = 50) {
  const element = document.getElementById(elementId);
  if (!element) return;

  element.textContent = "";
  element.classList.remove("typing-complete");
  let index = 0;

  function type() {
    if (index < text.length) {
      const char = text.charAt(index);
      element.textContent += char;

      // Phát typing sound (chỉ phát khi không phải khoảng trắng và không phải xuống dòng)
      if (char !== " " && char !== "\n") {
        playTypingSound();
      }

      index++;
      setTimeout(type, speed);
    } else {
      // Kết thúc typing, ẩn cursor
      element.classList.add("typing-complete");
    }
  }

  type();
}

// Phát sound typing
function playTypingSound() {
  const typingSound = document.getElementById("typing-sound");
  if (typingSound) {
    // Reset và phát lại sound
    typingSound.currentTime = 0;
    typingSound.volume = 0.3; // Điều chỉnh volume
    typingSound.play().catch((error) => {
      // Ignore errors nếu không thể phát
    });
  }
}

// Hàm chuyển màn tiếp theo (dùng cho button)
function nextScreen(screenId) {
  showScreen(screenId);
}

// Countdown logic
function startCountdown() {
  const countdownElement = document.getElementById("countdown-number");
  let count = 3;

  countdownElement.textContent = count;
  countdownElement.style.animation = "none";

  // Trigger reflow để restart animation
  setTimeout(() => {
    countdownElement.style.animation = "countdownPop 1s ease-out";
  }, 10);

  const countdownInterval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownElement.textContent = count;
      countdownElement.style.animation = "none";
      setTimeout(() => {
        countdownElement.style.animation = "countdownPop 1s ease-out";
      }, 10);
    } else {
      clearInterval(countdownInterval);
      // Tự động chuyển sang màn nhiệm vụ
      setTimeout(() => {
        showScreen("screen-task");
      }, 500);
    }
  }, 1000);
}

// Setup drag and drop cho tiền
function setupDragAndDrop() {
  const moneyItems = document.querySelectorAll(".money-item");
  const donateArea = document.getElementById("donate-area");

  // Chỉ setup nếu có donate-area (screen-task đã bị loại bỏ)
  if (!donateArea) return;

  // Drag start
  moneyItems.forEach((item) => {
    item.addEventListener("dragstart", handleDragStart);
    item.addEventListener("dragend", handleDragEnd);
  });

  // Drag over và drop
  donateArea.addEventListener("dragover", handleDragOver);
  donateArea.addEventListener("drop", handleDrop);
  donateArea.addEventListener("dragleave", handleDragLeave);

  // Touch events cho mobile
  moneyItems.forEach((item) => {
    item.addEventListener("touchstart", handleTouchStart, { passive: false });
    item.addEventListener("touchmove", handleTouchMove, { passive: false });
    item.addEventListener("touchend", handleTouchEnd);
  });
}

let draggedElement = null;
let touchOffset = { x: 0, y: 0 };

function handleDragStart(e) {
  draggedElement = this;
  this.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", this.innerHTML);
}

function handleDragEnd(e) {
  this.classList.remove("dragging");
  draggedElement = null;
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = "move";
  const donateArea = document.getElementById("donate-area");
  donateArea.classList.add("drag-over");
  return false;
}

function handleDragLeave(e) {
  const donateArea = document.getElementById("donate-area");
  donateArea.classList.remove("drag-over");
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }

  const donateArea = document.getElementById("donate-area");
  donateArea.classList.remove("drag-over");

  if (draggedElement && draggedElement !== null) {
    const value = parseInt(draggedElement.getAttribute("data-value"));
    addDonation(value, draggedElement);
  }

  return false;
}

// Touch events cho mobile
function handleTouchStart(e) {
  const touch = e.touches[0];
  const rect = this.getBoundingClientRect();
  touchOffset.x = touch.clientX - rect.left;
  touchOffset.y = touch.clientY - rect.top;
  draggedElement = this;
  this.classList.add("dragging");
}

function handleTouchMove(e) {
  if (!draggedElement) return;

  const touch = e.touches[0];
  draggedElement.style.position = "fixed";
  draggedElement.style.left = touch.clientX - touchOffset.x + "px";
  draggedElement.style.top = touch.clientY - touchOffset.y + "px";
  draggedElement.style.zIndex = "1000";
  draggedElement.style.pointerEvents = "none";

  // Check if over donate area
  const donateArea = document.getElementById("donate-area");
  const donateRect = donateArea.getBoundingClientRect();
  const isOverDonate =
    touch.clientX >= donateRect.left &&
    touch.clientX <= donateRect.right &&
    touch.clientY >= donateRect.top &&
    touch.clientY <= donateRect.bottom;

  if (isOverDonate) {
    donateArea.classList.add("drag-over");
  } else {
    donateArea.classList.remove("drag-over");
  }
}

function handleTouchEnd(e) {
  if (!draggedElement) return;

  const donateArea = document.getElementById("donate-area");
  const donateRect = donateArea.getBoundingClientRect();
  const touch = e.changedTouches[0];

  const isOverDonate =
    touch.clientX >= donateRect.left &&
    touch.clientX <= donateRect.right &&
    touch.clientY >= donateRect.top &&
    touch.clientY <= donateRect.bottom;

  if (isOverDonate && draggedElement) {
    const value = parseInt(draggedElement.getAttribute("data-value"));
    addDonation(value, draggedElement);
  }

  // Reset styles
  draggedElement.style.position = "";
  draggedElement.style.left = "";
  draggedElement.style.top = "";
  draggedElement.style.zIndex = "";
  draggedElement.style.pointerEvents = "";
  draggedElement.classList.remove("dragging");

  donateArea.classList.remove("drag-over");
  draggedElement = null;
}

// Thêm tiền vào donate
function addDonation(value, moneyElement) {
  const donateSlot = document.getElementById("donate-slot");
  if (!donateSlot) return; // Element không tồn tại (đã bị xóa khỏi screen-task)

  // Kiểm tra xem đã donate chưa (tránh duplicate)
  if (moneyElement.parentElement.id === "donate-slot") {
    return; // Đã được donate rồi
  }

  donatedAmount += value;
  updateDonateDisplay();

  // Di chuyển element vào donate slot
  const clonedElement = moneyElement.cloneNode(true);
  clonedElement.draggable = false;
  clonedElement.style.cursor = "default";
  clonedElement.classList.remove("dragging");
  donateSlot.appendChild(clonedElement);

  // Ẩn element gốc
  moneyElement.style.opacity = "0.3";
  moneyElement.style.pointerEvents = "none";

  // Kiểm tra hoàn thành nhiệm vụ
  checkTaskComplete();
}

// Cập nhật hiển thị số tiền đã donate
function updateDonateDisplay() {
  const donateAmountElement = document.getElementById("donate-amount");
  if (donateAmountElement) {
    donateAmountElement.textContent = donatedAmount.toLocaleString("vi-VN");
  }
}

// Kiểm tra hoàn thành nhiệm vụ
function checkTaskComplete() {
  const taskStatus = document.getElementById("task-status");
  if (!taskStatus) return; // Element không tồn tại (đã bị xóa khỏi screen-task)

  if (donatedAmount >= targetAmount) {
    taskStatus.textContent = "✓ Hoàn thành!";
    taskStatus.classList.add("success");

    // Tự động chuyển sang màn tiếp theo sau 1 giây
    setTimeout(() => {
      showScreen("screen-jack-wish");
    }, 1500);
  } else {
    const remaining = targetAmount - donatedAmount;
    taskStatus.textContent = `Còn thiếu: ${remaining.toLocaleString(
      "vi-VN"
    )} VND`;
  }
}

// Reset task khi vào lại màn nhiệm vụ
function resetTask() {
  // Screen-task giờ chỉ hiển thị thông tin, không có game nên không cần reset
  // Function này giữ lại để đảm bảo không bị lỗi khi gọi
}

// Setup drag and drop cho challenge screen
function setupChallengeDragAndDrop() {
  const moneyContainer = document.getElementById("money-container-challenge");
  const donateArea = document.getElementById("donate-area-challenge");

  if (!moneyContainer || !donateArea) return;

  // Setup cho các money-item hiện có
  const moneyItems = moneyContainer.querySelectorAll(".money-item");
  moneyItems.forEach((item) => {
    item.addEventListener("dragstart", handleChallengeDragStart);
    item.addEventListener("dragend", handleChallengeDragEnd);
    item.addEventListener("touchstart", handleChallengeTouchStart, {
      passive: false,
    });
    item.addEventListener("touchmove", handleChallengeTouchMove, {
      passive: false,
    });
    item.addEventListener("touchend", handleChallengeTouchEnd);
  });

  // Drag over và drop
  donateArea.addEventListener("dragover", handleChallengeDragOver);
  donateArea.addEventListener("drop", handleChallengeDrop);
  donateArea.addEventListener("dragleave", handleChallengeDragLeave);
}

let challengeDraggedElement = null;
let challengeTouchOffset = { x: 0, y: 0 };

function handleChallengeDragStart(e) {
  challengeDraggedElement = this;
  this.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
}

function handleChallengeDragEnd(e) {
  this.classList.remove("dragging");
  challengeDraggedElement = null;
}

function handleChallengeDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = "move";
  const donateArea = document.getElementById("donate-area-challenge");
  donateArea.classList.add("drag-over");
  return false;
}

function handleChallengeDragLeave(e) {
  const donateArea = document.getElementById("donate-area-challenge");
  donateArea.classList.remove("drag-over");
}

function handleChallengeDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }

  const donateArea = document.getElementById("donate-area-challenge");
  donateArea.classList.remove("drag-over");

  if (challengeDraggedElement) {
    const value = parseInt(challengeDraggedElement.getAttribute("data-value"));
    addDonationChallenge(value, challengeDraggedElement);
  }

  return false;
}

function handleChallengeTouchStart(e) {
  const touch = e.touches[0];
  const rect = this.getBoundingClientRect();
  challengeTouchOffset.x = touch.clientX - rect.left;
  challengeTouchOffset.y = touch.clientY - rect.top;
  challengeDraggedElement = this;
  this.classList.add("dragging");
}

function handleChallengeTouchMove(e) {
  if (!challengeDraggedElement) return;

  const touch = e.touches[0];
  challengeDraggedElement.style.position = "fixed";
  challengeDraggedElement.style.left =
    touch.clientX - challengeTouchOffset.x + "px";
  challengeDraggedElement.style.top =
    touch.clientY - challengeTouchOffset.y + "px";
  challengeDraggedElement.style.zIndex = "1000";
  challengeDraggedElement.style.pointerEvents = "none";

  const donateArea = document.getElementById("donate-area-challenge");
  const donateRect = donateArea.getBoundingClientRect();
  const isOverDonate =
    touch.clientX >= donateRect.left &&
    touch.clientX <= donateRect.right &&
    touch.clientY >= donateRect.top &&
    touch.clientY <= donateRect.bottom;

  if (isOverDonate) {
    donateArea.classList.add("drag-over");
  } else {
    donateArea.classList.remove("drag-over");
  }
}

function handleChallengeTouchEnd(e) {
  if (!challengeDraggedElement) return;

  const donateArea = document.getElementById("donate-area-challenge");
  const donateRect = donateArea.getBoundingClientRect();
  const touch = e.changedTouches[0];

  const isOverDonate =
    touch.clientX >= donateRect.left &&
    touch.clientX <= donateRect.right &&
    touch.clientY >= donateRect.top &&
    touch.clientY <= donateRect.bottom;

  if (isOverDonate && challengeDraggedElement) {
    const value = parseInt(challengeDraggedElement.getAttribute("data-value"));
    addDonationChallenge(value, challengeDraggedElement);
  }

  challengeDraggedElement.style.position = "";
  challengeDraggedElement.style.left = "";
  challengeDraggedElement.style.top = "";
  challengeDraggedElement.style.zIndex = "";
  challengeDraggedElement.style.pointerEvents = "";
  challengeDraggedElement.classList.remove("dragging");

  donateArea.classList.remove("drag-over");
  challengeDraggedElement = null;
}

// Thêm tiền vào donate (challenge - không giới hạn số lượng)
function addDonationChallenge(value, moneyElement) {
  donatedAmount += value;
  updateChallengeDonateDisplay();

  // Clone element vào donate slot (không ẩn element gốc)
  const donateSlot = document.getElementById("donate-slot-challenge");
  const clonedElement = moneyElement.cloneNode(true);
  clonedElement.draggable = false;
  clonedElement.style.cursor = "default";
  clonedElement.classList.remove("dragging");
  donateSlot.appendChild(clonedElement);

  // Kiểm tra hoàn thành nhiệm vụ
  checkChallengeComplete();
}

// Cập nhật hiển thị số tiền đã donate (challenge)
function updateChallengeDonateDisplay() {
  const donateAmountElement = document.getElementById(
    "donate-amount-challenge"
  );
  if (donateAmountElement) {
    donateAmountElement.textContent = donatedAmount.toLocaleString("vi-VN");
  }
}

// Kiểm tra hoàn thành nhiệm vụ (challenge)
function checkChallengeComplete() {
  if (donatedAmount >= targetAmount) {
    const taskStatus = document.getElementById("task-status-challenge");
    taskStatus.textContent = "✓ Hoàn thành!";
    taskStatus.classList.add("success");

    // Tự động chuyển sang màn tiếp theo sau 1 giây
    setTimeout(() => {
      showScreen("screen-jack-wish");
    }, 1500);
  } else {
    const remaining = targetAmount - donatedAmount;
    const taskStatus = document.getElementById("task-status-challenge");
    taskStatus.textContent = `Còn thiếu: ${remaining.toLocaleString(
      "vi-VN"
    )} VND`;
  }
}

// Reset challenge khi vào lại màn challenge
function resetChallenge() {
  donatedAmount = 0;
  updateChallengeDonateDisplay();

  // Clear donate slot
  const donateSlot = document.getElementById("donate-slot-challenge");
  if (donateSlot) {
    donateSlot.innerHTML =
      '<div class="donate-total"><span id="donate-amount-challenge">0</span> VND</div>';
  }

  // Reset status
  const taskStatus = document.getElementById("task-status-challenge");
  if (taskStatus) {
    taskStatus.textContent = "";
    taskStatus.classList.remove("success");
  }
}

// Phát audio cho challenge screen
function startChallengeVideo() {
  const bgMusic = document.getElementById("background-music");
  const challengeAudio = document.getElementById("challenge-audio");

  // Tạm dừng background music
  if (bgMusic) {
    bgMusic.pause();
  }

  // Phát audio challenge
  if (challengeAudio) {
    challengeAudio.volume = 0.5;
    challengeAudio.play().catch((error) => {
      console.log("Lỗi phát audio challenge:", error);
    });
  }
}

// Khôi phục background music khi rời challenge
function stopChallengeVideo() {
  const bgMusic = document.getElementById("background-music");
  const challengeAudio = document.getElementById("challenge-audio");

  // Dừng audio challenge
  if (challengeAudio) {
    challengeAudio.pause();
    challengeAudio.currentTime = 0;
  }

  // Tiếp tục phát background music
  if (bgMusic) {
    bgMusic.play().catch((error) => {
      console.log("Lỗi phát nhạc:", error);
    });
  }
}

// Submit wish
function submitWish() {
  const wishInput = document.getElementById("wish-input");
  const wish = wishInput.value.trim();

  if (wish) {
    playerWish = wish;
    showScreen("screen-congratulations");
  } else {
    alert("Vui lòng nhập điều ước của anh!");
  }
}

// Mở pop-up lời chúc
function openWishesPopup() {
  const popup = document.getElementById("wishes-popup");
  if (popup) {
    popup.classList.add("active");
    startWishesTyping();
  }
}

// Đóng pop-up lời chúc
function closeWishesPopup(event) {
  // Nếu click vào popup background (không phải content)
  if (event && event.target.id === "wishes-popup") {
    const popup = document.getElementById("wishes-popup");
    if (popup) {
      popup.classList.remove("active");
      resetWishesText();
    }
  } else if (!event) {
    // Gọi từ button close
    const popup = document.getElementById("wishes-popup");
    if (popup) {
      popup.classList.remove("active");
      resetWishesText();
    }
  }
}

// Reset text trong pop-up
function resetWishesText() {
  for (let i = 1; i <= 6; i++) {
    const element = document.getElementById(`wish-text-${i}`);
    if (element) {
      element.textContent = "";
      element.classList.remove("typing-complete");
    }
  }
}

// Typing effect cho các lời chúc
function startWishesTyping() {
  const wishes = [
    "Trong các loại chúc, em thích nhất là chúc mừng sinh nhật! Chúc anh sinh nhật vui vẻ nhé!",
    "Trịnh Trần… à trịnh trọng tuyên bố tuổi 34 của anh chính thức bắt đầuu, em xin chúc anh 8386 mãi đỉnh mãi đỉnh!!",
    "Happy turning 34 years old!!!",
    playerWish
      ? `Và chúc cho điều ước của anh: "${playerWish}" sẽ thành sự thật!`
      : "",
    "Hết òi đó ạa",
  ];

  // Reset tất cả text
  resetWishesText();

  // Typing từng dòng lần lượt
  let currentIndex = 0;
  let delay = 0;

  function typeNext() {
    if (currentIndex < wishes.length && wishes[currentIndex]) {
      const elementId = `wish-text-${currentIndex + 1}`;
      const element = document.getElementById(elementId);
      if (element) {
        setTimeout(() => {
          typeText(elementId, wishes[currentIndex], 50);
          currentIndex++;
          delay += 1000; // Thời gian typing + 1s delay
          typeNext();
        }, delay);
      } else {
        currentIndex++;
        typeNext();
      }
    }
  }

  typeNext();
}

// Phát nhạc cho congratulations screen
function startCongratulationsMusic() {
  const bgMusic = document.getElementById("background-music");
  const congratsMusic = document.getElementById("congratulations-music");

  // Tạm dừng background music
  if (bgMusic) {
    bgMusic.pause();
  }

  // Phát nhạc congratulations
  if (congratsMusic) {
    congratsMusic.volume = 0.7;
    congratsMusic.loop = true;
    congratsMusic.play().catch((error) => {
      console.log("Lỗi phát nhạc congratulations:", error);
    });
  }
}

// Fireworks effect
function startFireworks() {
  const fireworksContainer = document.getElementById("fireworks");
  if (!fireworksContainer) return;

  // Clear previous fireworks
  fireworksContainer.innerHTML = "";

  // Tạo pháo hoa trong 3 giây
  const fireworkInterval = setInterval(() => {
    createFirework(fireworksContainer);
  }, 200);

  // Dừng sau 3 giây
  setTimeout(() => {
    clearInterval(fireworkInterval);
  }, 3000);
}

function createFirework(container) {
  const firework = document.createElement("div");
  firework.className = "firework";

  // Random position
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;
  firework.style.left = x + "px";
  firework.style.top = y + "px";

  // Random color
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  firework.style.backgroundColor = color;

  // Random direction
  const angle = Math.random() * Math.PI * 2;
  const distance = 50 + Math.random() * 100;
  const tx = Math.cos(angle) * distance;
  const ty = Math.sin(angle) * distance;
  firework.style.setProperty("--tx", tx + "px");
  firework.style.setProperty("--ty", ty + "px");

  container.appendChild(firework);

  // Remove after animation
  setTimeout(() => {
    if (firework.parentNode) {
      firework.parentNode.removeChild(firework);
    }
  }, 1000);
}
