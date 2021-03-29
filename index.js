import SwitchPro from './lib/index.js'

function handleChange(gamepad) {
  const keys = Object.keys(gamepad.pressed)

  if (keys.length === 0) {
    input.innerHTML = 'No button pressed at the moment...';

  } else {
    const pressed = keys.map((key) => {
      return `${key}: ${gamepad.pressed[key]}`
    })
    input.innerHTML = pressed.join(' + ');
  }
}

const switchPro = new SwitchPro(window)
switchPro.addListener(handleChange)
