const buttonMapping = {
  0: 'B',
  1: 'A',
  2: 'Y',
  3: 'X',
  4: 'L',
  5: 'R',
  6: 'ZL',
  7: 'ZR',
  8: 'MINUS',
  9: 'PLUS',
  10: 'LS',
  11: 'RS',
  12: 'UP',
  13: 'DOWN',
  14: 'LEFT',
  15: 'RIGHT',
  16: 'HOME',
  17: 'CAPTURE',
}

export default class SwitchPro {
  constructor(window) {
    this.prevPressed = []
    this.pressed = []
    this.listeners = []
    this.connected = false

    this.observeGamepad();
  }

  observeGamepad() {
    window.addEventListener('gamepadconnected', function() {
      console.log('connect')
      this.connected = true
      this.interval = setInterval(this.pollGamepads.bind(this), 16)
    }.bind(this))

    window.addEventListener('gamepaddisconnected', function() {
      console.log('disconnect')
      this.connected = false
      clearInterval(this.interval)
    }.bind(this))
  }

  addListener(fn) {
    this.listeners.push(fn)
  }

  emit() {
    this.listeners.forEach((fn) => fn(this))
  }

  pollGamepads() {
    // get reference to the gamepad
    let gamepads = navigator.getGamepads ? navigator.getGamepads() : []
    if (gamepads.length === 0 || !gamepads[0]) return
    const gp = gamepads[0]

    // keep track of previous teration to know if we need to emit changes
    this.prevPressed = this.pressed
    this.pressed = []

    for (let i = 0; i < gp.buttons.length; i++) {
      if (gp.buttons[i].pressed) {
        const button = buttonMapping[i]
        this.pressed.push(button)
      }
    }

    const leftJoy = {
      up:    gp.axes[1] < 0 && Math.round(gp.axes[1] / -1 * 100),
      down:  gp.axes[1] > 0 && Math.round(gp.axes[1] / 1 * 100),
      left:  gp.axes[0] < 0 && Math.round(gp.axes[0] / -1 * 100),
      right: gp.axes[0] > 0 && Math.round(gp.axes[0] / 1 * 100),
    }
    const rightJoy = {
      up:    gp.axes[3] < 0 && Math.round(gp.axes[3] / -1 * 100),
      down:  gp.axes[3] > 0 && Math.round(gp.axes[3] / 1 * 100),
      left:  gp.axes[2] < 0 && Math.round(gp.axes[2] / -1 * 100),
      right: gp.axes[2] > 0 && Math.round(gp.axes[2] / 1 * 100),
    }

    // using L joystick?
    if (gp.axes[0] !== 0 || gp.axes[1] !== 0) {
      if (leftJoy.up > 50) {
        this.pressed.push("LJOY UP: " + leftJoy.up)
      } else if (leftJoy.down > 50) {
        this.pressed.push("LJOY DOWN: " + leftJoy.down)
      }

      if (leftJoy.left > 50) {
        this.pressed.push("LJOY LEFT: " + leftJoy.left)
      } else if (leftJoy.right > 50) {
        this.pressed.push("LJOY RIGHT: " + leftJoy.right)
      }
    }
    // using R joystick?
    if (gp.axes[2] !== 0 || gp.axes[3] !== 0) {
      if (rightJoy.up > 50) {
        this.pressed.push("RJOY UP: " + rightJoy.up)
      } else if (rightJoy.down > 50) {
        this.pressed.push("RJOY DOWN: " + rightJoy.down)
      }

      if (rightJoy.left > 50) {
        this.pressed.push("RJOY LEFT: " + rightJoy.left)
      } else if (rightJoy.right > 50) {
        this.pressed.push("RJOY RIGHT: " + rightJoy.right)
      }
    }

    // did things change?
    if (this.pressed !== this.prevPressed) {
      this.emit()
    }
  }
}
