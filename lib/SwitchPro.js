import JoyStick from './JoyStick.js'

const FPS = 60

const BUTTON_MAPPING = {
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
    this.prevPressed = {}
    this.pressed = {}
    this.listeners = []
    this.connected = false

    this._observeGamepad();
  }

  addListener(fn) {
    this.listeners.push(fn)
  }

  _observeGamepad() {
    window.addEventListener('gamepadconnected', function() {
      this.connected = true
      this.interval = setInterval(this._pollGamepads.bind(this), 1000 / FPS)
    }.bind(this))

    window.addEventListener('gamepaddisconnected', function() {
      this.connected = false
      clearInterval(this.interval)
    }.bind(this))
  }

  _emit() {
    this.listeners.forEach((fn) => fn(this.pressed))
  }

  _pollGamepads() {
    // get reference to the gamepad
    let gamepads = navigator.getGamepads ? navigator.getGamepads() : []
    if (gamepads.length === 0 || !gamepads[0]) return
    const gp = gamepads[0]

    // keep track of previous teration to know if we need to emit changes
    this.prevPressed = this.pressed
    this.pressed = {}

    for (let i = 0, j = gp.buttons.length; i < j; i++) {
      if (gp.buttons[i].pressed) {
        const button = BUTTON_MAPPING[i]
        this.pressed[button] = 1
      }
    }

    const leftStick  = new JoyStick('LS', gp.axes[0], gp.axes[1])
    const rightStick = new JoyStick('RS', gp.axes[2], gp.axes[3])

    this.pressed = {
      ...this.pressed,
      ...leftStick.pressValues(),
      ...rightStick.pressValues(),
    }

    // only emit if somethign changed
    if (!this._shallowEqual(this.prevPressed, this.pressed)) {
      this._emit()
    }
  }

  _shallowEqual(object1, object2) {
    const keys1 = Object.keys(object1)
    const keys2 = Object.keys(object2)

    if (keys1.length !== keys2.length) { return false }

    for (let key of keys1) {
      if (object1[key] !== object2[key]) { return false }
    }
    return true
  }
}
