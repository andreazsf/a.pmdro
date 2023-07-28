const timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    sessions: 0,
};

let interval;

const startStopToggle = document.querySelector('#start-stop-icon');
const buttonSound = new Audio('audio/button-sound.mp3');

const mainButton = document.getElementById('js-btn');
mainButton.addEventListener('click', () => {
    buttonSound.play();
    const { action } = mainButton.dataset;
    if (action === 'start') {
        startTimer();
    } else {
        stopTimer();
    }
});

const modeButtons = document.querySelector('#js-mode-buttons');

modeButtons.addEventListener('click', handleMode); //listens or monitors

function handleMode(event) { // function to check which event or button clicked
   
    const { mode } = event.target.dataset; //*.target.dataset is used to access DATA from the * object

    if(!mode) return;

    switchMode(mode);
    stopTimer();
}

function switchMode(mode) {
    timer.mode = mode;
    timer.remainingTime = {
        total: timer[mode] * 60,
        minutes: timer[mode],
        seconds: 0,
    };

    document   
        .querySelectorAll('button[data-mode]')
        .forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    // document.body.style.backgroundColor = `var(--${mode})`;
    document
        .getElementById('js-progress')
        .setAttribute('max', timer.remainingTime.total);

    updateClock();
}

function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;

    const total = Number.parseInt(difference / 1000, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);

    return {
        total,
        minutes,
        seconds,
    };
}

function startTimer() {
    let { total } = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000;

    if (timer.mode === 'pomodoro') timer.sessions++;

    // stopToggle = document.querySelector('#start-stop-icon');
    // mainButton.dataset.action = 'stop';
    // stopToggle.classList.toggle('bx-stop');
    // mainButton.classList.add('active');

    mainButton.dataset.action = 'stop';
    // startStopToggle.classList.toggle('bx-stop');
    mainButton.textContent = 'stop';
    mainButton.classList.add('active');

    interval = setInterval(function() {
        timer.remainingTime = getRemainingTime(endTime);
        updateClock();

        total = timer.remainingTime.total;

        if (total <= 0) {
        clearInterval(interval);
        switch (timer.mode) {
            case 'pomodoro':
                if (timer.sessions % timer.longBreakInterval === 0) {
                    switchMode('longBreak');
                } else {
                    switchMode('shortBreak');
                }
                break;
                default:
                    switchMode('pomodoro');
        }
        document.querySelector(`[data-sound="${timer.mode}"]`).play();
        startTimer();
        }

    }, 1000);
}

function stopTimer() {
    clearInterval(interval);

    // startToggle = document.querySelector('#start-stop-icon');
    // mainButton.dataset.action = 'start';
    // startToggle.classList.toggle('bx-start');
    // mainButton.classList.remove('active');

    mainButton.dataset.action = 'start';
    mainButton.textContent = 'start';
    mainButton.classList.remove('active');
}

// function quitTimer() {
//     clearInterval(interval);

//     startToggle = document.querySelector('#start-stop-icon');
  
//     mainButton.dataset.action = 'start';
//     // mainButton.textContent = 'stop';
//     startToggle.classList.toggle('bx-start');
//     mainButton.classList.remove('active');
// }

function updateClock() {
    const { remainingTime } = timer;
    //adds 0 on front because of time format ex. 08:00
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');

    const min = document.getElementById('js-minutes');
    const sec = document.getElementById('js-seconds');
    
    min.textContent = minutes;
    sec.textContent = seconds;

    const text = timer.mode === 'pomodoro' ? 'Get back to work!' : 'Take a break!';
    document.title = `${minutes}:${seconds} — ${text}`;

    const progress = document.getElementById('js-progress');
    progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
}

document.addEventListener('DOMContentLoaded', () => {
    switchMode('pomodoro');
});