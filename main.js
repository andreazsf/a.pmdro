const timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    sessions: 0,
  };
  
  let interval;
  
  const buttonSound = new Audio("audio/button-sound.mp3");
  
  const mainButton = document.getElementById("js-btn");
  
  mainButton.addEventListener("click", () => {
    buttonSound.play();
    const { action } = mainButton.dataset;
    if (action === "start") {
      startTimer();
    } else {
      stopTimer();
    }
  });
  
  // Toggle the icon class
  function toggleIcon(isPlay) {
    const icon = document.getElementById("js-btn");
    icon.classList.toggle("bx-play", isPlay);
    icon.classList.toggle("bx-stop", !isPlay);
  }
  
  const modeButtons = document.querySelector("#js-mode-buttons");
  
  modeButtons.addEventListener("click", handleMode);
  
  function startTimer() {
    let { total } = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000;
  
    if (timer.mode === "pomodoro") timer.sessions++;
  
    mainButton.dataset.action = "stop";
    toggleIcon(false); // Change the icon to "bx-stop"
  
    mainButton.classList.add("active");
  
    interval = setInterval(function () {
      timer.remainingTime = getRemainingTime(endTime);
      updateClock();
  
      total = timer.remainingTime.total;
  
      if (total <= 0) {
        clearInterval(interval);
        switch (timer.mode) {
          case "pomodoro":
            if (timer.sessions % timer.longBreakInterval === 0) {
              switchMode("longBreak");
            } else {
              switchMode("shortBreak");
            }
            break;
          default:
            switchMode("pomodoro");
        }
        document.querySelector(`[data-sound="${timer.mode}"]`).play();
        startTimer();
      }
    }, 1000);
  }
  
  function stopTimer() {
    clearInterval(interval);
  
    mainButton.dataset.action = "start";
    toggleIcon(true); // Change the icon to "bx-play"
  
    mainButton.classList.remove("active");
  }
  