const clock = document.getElementById('clock');
const alarmsList = document.getElementById('alarmsList');
const greeting = document.getElementById('greeting');
const alarmAudio = document.getElementById('alarmAudio');
const timeImage = document.getElementById('timeImage');
const alarmTimeInput = document.getElementById('alarmTime');

let alarms = [];
let revertTimeout = null;

// Utility function for padding
const pad = n => (n < 10 ? '0' + n : n);

// Format current time as "hh:mm:ss AM/PM"
function updateClock() {
  const now = new Date();
  const [hours, minutes, seconds] = [now.getHours(), now.getMinutes(), now.getSeconds()];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  let displayHour;
  if (hours % 12 === 0) {
    displayHour = 12;
  } else {
    displayHour = hours % 12;
  }


  const fullTime = `${pad(displayHour)}:${pad(minutes)}:${pad(seconds)} ${ampm}`;
  const shortTime = `${pad(displayHour)}:${pad(minutes)} ${ampm}`;

  clock.textContent = fullTime;
  checkAlarms(shortTime);

  // Only update greeting and image if no custom preview is showing
  if (!revertTimeout) updateGreetingAndImage(hours);
}

// Update greeting text and image based on hour
function updateGreetingAndImage(hours) {
  let greetingText = '';
  let imageSrc = '';

  if (hours >= 4 && hours < 12) {
    greetingText = 'Good Morning!!';
    imageSrc = './assets/morning.jpg';
  } else if (hours >= 12 && hours < 16) {
    greetingText = 'Good Afternoon!!';
    imageSrc = './assets/afternoon.jpg';
  } else if (hours >= 16 && hours < 20) {
    greetingText = 'Good Evening!!';
    imageSrc = './assets/evening.jpg';
  } else {
    greetingText = 'Have a Good Night Sleep!!';
    imageSrc = './assets/night.jpg';
  }

  greeting.textContent = greetingText;
  timeImage.src = imageSrc;
}


// Preview time-based image for 5 seconds
function previewTimeImage(value) {
  if (!value) return;

  let [hour, minute] = value.split(':').map(Number);
  let imageSrc = '';

  // Determine if it's AM or PM using current input value
  const now = new Date();
  const inputDate = new Date(now);
  inputDate.setHours(hour, minute);

  const inputHour24 = inputDate.getHours(); // 0 - 23 range

  if (inputHour24 >= 4 && inputHour24 < 12) {
    imageSrc = './assets/morning.jpg';
  } else if (inputHour24 >= 12 && inputHour24 < 16) {
    imageSrc = './assets/afternoon.jpg';
  } else if (inputHour24 >= 16 && inputHour24 < 20) {
    imageSrc = './assets/evening.jpg';
  } else {
    imageSrc = './assets/night.jpg';
  }

  timeImage.src = imageSrc;

  clearTimeout(revertTimeout);
  revertTimeout = setTimeout(() => {
    const currentHour = new Date().getHours();
    updateGreetingAndImage(currentHour);
    revertTimeout = null;
  }, 5000);
}


// Set new alarm
function setAlarm() {
  const timeValue = alarmTimeInput.value;
  if (!timeValue) return alert('Please select a valid time.');

  let [hour, minute] = timeValue.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;

  const formattedTime = `${pad(hour)}:${pad(minute)} ${ampm}`;
  if (alarms.includes(formattedTime)) return alert('Alarm already set for this time.');

  alarms.push(formattedTime);
  displayAlarms();
  previewTimeImage(timeValue);

  // Reset the input field
  alarmTimeInput.value = '';
}


// Check if current time matches any alarm
function checkAlarms(currentTime) {
  if (alarms.includes(currentTime)) {
    alarmAudio.play();
    alarms = alarms.filter(time => time !== currentTime);
    displayAlarms();
  }
}

// Display alarm list in the UI
function displayAlarms() {
  alarmsList.innerHTML = alarms.map((time, index) => `
    <div class="alarmItem">
      ${time}
      <button onclick="deleteAlarm(${index})">Delete</button>
    </div>`).join('');
}

// Delete a specific alarm
function deleteAlarm(index) {
  alarms.splice(index, 1);
  displayAlarms();
}

// Clear all alarms
function resetAlarms() {
  alarms = [];
  displayAlarms();
}

// Start clock
setInterval(updateClock, 1000);
updateClock();
