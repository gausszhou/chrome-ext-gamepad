import { EnumButtonCode, EnumTabAction } from '../enums'
import { PageController } from './PageController'

const BUTTON_MAP: Record<number, EnumButtonCode> = {
  0: EnumButtonCode.A,
  1: EnumButtonCode.B,
  2: EnumButtonCode.X,
  3: EnumButtonCode.Y,

  4: EnumButtonCode.LEFT_BUMPER,
  5: EnumButtonCode.RIGHT_BUMPER,

  6: EnumButtonCode.LEFT_TRIGGER,
  7: EnumButtonCode.RIGHT_TRIGGER,

  8: EnumButtonCode.BACK,
  9: EnumButtonCode.START,

  10: EnumButtonCode.LEFT_STICK,
  11: EnumButtonCode.RIGHT_STICK,

  12: EnumButtonCode.DPAD_UP,
  13: EnumButtonCode.DPAD_DOWN,
  14: EnumButtonCode.DPAD_LEFT,
  15: EnumButtonCode.DPAD_RIGHT,

  16: EnumButtonCode.HOME,
}

interface GamepadState {
  readonly buttons: GamepadButton[]
  axes: number[]
  id: string
  index: number
}

const pageController = new PageController()

export class GamePadController {
  gamepads: Map<number, GamepadState> = new Map()
  isPolling = false

  constructor() {
    this.start()
  }

  start() {
    window.addEventListener('gamepadconnected', (e) => this.onConnected(e))
    window.addEventListener('gamepaddisconnected', (e) => this.onDisconnected(e))
  }

  onConnected(event: GamepadEvent) {
    const gamepad = event.gamepad
    this.gamepads.set(gamepad.index, this.getGamePadState(gamepad))
    console.log(`Gamepad ${gamepad.id} connected`)
    if (!this.isPolling) {
      this.startPolling()
    }
  }

  onDisconnected(event: GamepadEvent) {
    const gamepad = event.gamepad
    this.gamepads.delete(gamepad.index)
    console.log(`Gamepad ${gamepad.id} disconnected`)
    if (this.gamepads.size === 0) {
      this.stopPolling()
    }
  }

  startPolling() {
    if (this.isPolling) return false
    this.isPolling = true
    const poll = () => {
      const gamepads = navigator.getGamepads()
      this.processGamepads(gamepads)
      if (this.isPolling) {
        requestAnimationFrame(poll)
      }
    }
    requestAnimationFrame(poll)
    return true
  }

  stopPolling() {
    this.isPolling = false
  }

  processGamepads(gamepads: (Gamepad | null)[]) {
    for (const gamepad of gamepads) {
      if (!gamepad || !this.gamepads.has(gamepad.index)) continue
      this.checkButtons(gamepad)
      this.checkAxes(gamepad)
      // 更新按钮状态
      this.gamepads.set(gamepad.index, this.getGamePadState(gamepad))
    }
  }

  // 检查按钮按下状态
  checkButtons(gamepad: Gamepad) {
    const oldState = this.gamepads.get(gamepad.index)
    gamepad.buttons.forEach((button, index) => {
      const oldButton = (oldState && oldState.buttons[index]) || { pressed: false }
      if (button.pressed && !oldButton.pressed) {
        console.log(`按键 ${index} 位置: ${button.value} 按下`)
        this.handleButtonDown(index)
      } else if (button.pressed && oldButton.pressed) {
        this.handleButtonPress(index)
      } else if (!button.pressed && oldButton.pressed) {
        console.log(`按键 ${index} 位置: ${button.value} 抬起`)
        this.handleButtonUp(index)
      }
    })
  }

  getGamePadState(gamepad: Gamepad) {
    return {
      buttons: Array.from(gamepad.buttons),
      axes: Array.from(gamepad.axes),
      id: gamepad.id,
      index: gamepad.index,
    }
  }

  // 检查摇杆状态
  checkAxes(gamepad: Gamepad) {
    gamepad.axes.forEach((axis, index) => {
      if (Math.abs(axis) > 0.1) {
        // 忽略小的摇杆移动
        console.log(`摇杆 ${index} 位置: ${axis.toFixed(2)}`)
      }
    })
  }

  private handleButtonDown(buttonIndex: number) {
    const buttonCode = BUTTON_MAP[buttonIndex]
    switch (buttonCode) {
    }
  }

  private handleButtonPress(buttonIndex: number) {}

  private handleButtonUp(buttonIndex: number) {
    const buttonCode = BUTTON_MAP[buttonIndex];
    if (document.hidden) {
      console.log('页面不可见');
      // return false;
    }
    switch (buttonCode) {
      case EnumButtonCode.DPAD_UP:
        pageController.up()
        break
      case EnumButtonCode.DPAD_DOWN:
        pageController.down()
        break
      case EnumButtonCode.DPAD_LEFT:
        pageController.left()
        break
      case EnumButtonCode.DPAD_RIGHT:
        pageController.right()
        break
      case EnumButtonCode.LEFT_BUMPER:
        chrome.runtime.sendMessage({
          type: EnumTabAction.TOGGLE_LEFT,
        })
        break
      case EnumButtonCode.RIGHT_BUMPER:
        chrome.runtime.sendMessage({
          type: EnumTabAction.TOGGLE_RIGHT,
        })
        break
    }
  }
}

// 初始化内容脚本处理器
new GamePadController()
