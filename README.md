# Switch Pro Controller

Support the Switch Pro controller in your JavaScript game!

This is a small package to wrap the gamepad api for the Switch Pro
controller to provide an observable API.

## Usage

Listen to button presses

```
import SwitchPro from 'switch-pro'

const switchPro = new SwitchPro(window)

switchPro.addListener((pressed) => {
  console.log(pressed)
})
```

The value passed to the callback is an object with values for the pressed
buttons. The callback function will only be invoked if the state of button
presses on the controller has changed.


Make things Rumble

```
import SwitchPro from 'switch-pro'
const switchPro = new SwitchPro(window)

switchPro.vibrate()
```

## Available Buttons

Most buttons have a value of either 0 (not-pressed) or 1 (pressed). The 
Joypad directions have a value ranging from 0 - 1.

The right side:
  B, A, Y, X

The center buttons: 
  MINUS, PLUS, HOME, CAPTURE

The directional pad: 
  UP, DOWN, LEFT, RIGHT

The top buttons: 
  L, R, ZL, ZR

The left joystick:
  LS, LS-UP, LS-DOWN, LS-LEFT, LS-RIGHT

The right joystick:
  RS, RS-UP, RS-DOWN, RS-LEFT, RS-RIGHT

An example of the object passed to the callback might look like this, where
the user is using the Left Stick about 1/2 way to the right and pressing Y:

```
{
  LS-RIGHT: 0.51,
  Y: 1
}
```

## Run Examples

See it for yourself. Plug in your controller, and then fire up the example
page with `yarn start` or `npm start` and visit `localhost:8081`.
