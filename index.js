import SwitchPro from './lib/index.js'

function handleChange(gamePad) {
  if (gamePad.pressed.length === 0) {
    input.innerHTML = 'No button pressed at the moment...';
  } else {
    input.innerHTML = gamePad.pressed.join(' + ');
  }
}

const switchPro = new SwitchPro(window)
switchPro.addListener(handleChange)

const pressed = {
  "A": 1,
  "B": 1,
  "LJOY UP": .2,
  "LJOY RIGHT": .8
}
