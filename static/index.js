import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';

const userName = prompt('Enter your name:');

const socket = io('127.0.0.1:3000');

let syllable;

const guess = document.getElementById('guess');
guess.addEventListener('input', (i) => {
  const objEmit = {
    guess: i.target.value,
    id: socket.id,
    name: userName,
  };
  socket.emit('ChangeGuess', objEmit);
});
// add event listener to guess input
guess.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    const objEmit = {
      guess: e.target.value,
      id: socket.id,
      name: userName,
      syllable: syllable || 'a',
    };
    socket.emit('SubmitGuess', objEmit);
  }
});

socket.on('connect', () => {
  const aa = { id: socket.id, name: userName };
  socket.emit('NewUser', aa);
});

socket.on('setPlayerWord', (i) => {
  //const guess = document.getElementById('guesses');
  const userEl = document.querySelector(`#${i.id}`);
  userEl.textContent = `${i.name}: ${i.guess}`;
  //guess.textContent = i.guess;
});

socket.on('updateUsers', (i) => {
  const oldUsers = document.getElementById('users');
  const newUsers = document.createElement('ul');
  newUsers.setAttribute('id', 'users');
  i.forEach((user) => {
    const li = document.createElement('li');
    li.textContent = user.name;
    li.id = user.id;
    newUsers.appendChild(li);
    oldUsers.replaceWith(newUsers);
  });
});

socket.on('checkWord', (i) => {
  const userEl = document.querySelector(`#${i.id}`);
  if (i.exists) {
    userEl.style.color = 'green';
  } else {
    userEl.style.color = 'red';
  }
});

socket.on('newRound', (i) => {
  syllable = i.syllable;
  const sylEl = document.getElementById('syllable');
  sylEl.textContent = i.syllable;
});
