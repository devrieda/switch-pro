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

class SwitchPro {
  constructor(window) {
    this.prevPressed = {}
    this.pressed = {}
    this.listeners = []

    this._observeGamepad();
  }

  addListener(fn) {
    this.listeners.push(fn)
  }

  // delay:    Start delay in ms
  // duration: Duration is ms.
  // weak:     Magnitude of the weak actuator (0-1)
  // strong:   Magnitude of the strong actuator (0-1)
  vibrate(delay = 0, duration = 200, weak = 1.0, strong = 1.0) {
    const gp = this._getGamepad();
    if (!gp) return

    gp.vibrationActuator.playEffect('dual-rumble', {
      startDelay: delay,
      duration: duration,
      weakMagnitude: weak,
      strongMagnitude: strong
    });
  }

  _observeGamepad() {
    window.addEventListener('gamepadconnected', () => {
      this.interval = setInterval(this._pollGamepads.bind(this), 1000 / FPS)
    })

    window.addEventListener('gamepaddisconnected', () => {
      clearInterval(this.interval)
    })
  }

  _emit() {
    this.listeners.forEach((fn) => fn(this.pressed))
  }

  _pollGamepads() {
    const gp = this._getGamepad();
    if (!gp) return

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

  // get reference to the gamepad
  _getGamepad() {
    const gps = navigator.getGamepads ? navigator.getGamepads() : []
    if (gps.length === 0 || !Array.from(gps).some((gp) => !!gp)) return

    return Array.from(gps).find((gp) => !!gp)
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

export default SwitchPro
