import SwitchPro from 'switch-pro'

function handleChange(pressed) {
  const input = document.querySelector('#input')
  const keys = Object.keys(pressed)

  if (keys.length === 0) {
    input.innerHTML = 'No button pressed at the moment...'

  } else {
    const all = keys.map((key) => { return `${key}: ${pressed[key]}` })
    input.innerHTML = all.join(' + ')
  }
}

const switchPro = new SwitchPro(window)
switchPro.addListener(handleChange)
handleChange({}) // render initial 'No button pressed'


// can only vibrate after connected
window.addEventListener('gamepadconnected', () => {
  const vibrate = document.querySelector('#vibrate')
  vibrate.innerHTML = "Press \"v\" key to vibrate"
})

// send vibration when user presses V
document.onkeypress = (e) => {
  if (e.code === "KeyV") {
    switchPro.vibrate()
  }
}
