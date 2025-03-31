const DIR_MAP: Record<string, KeyboardEventInit> = {
  UP: {
    key: 'ArrowUp',
    code: 'ArrowUp',
    keyCode: 38,
  },
  DOWN: {
    key: 'ArrowDown',
    code: 'ArrowDown',
    keyCode: 40,
  },
  LEFT: {
    key: 'ArrowLeft',
    code: 'ArrowLeft',
    keyCode: 37,
  },
  RIGHT: {
    key: 'ArrowRight',
    code: 'ArrowRight',
    keyCode: 39,
  },
}

function simulateKeydown(option: KeyboardEventInit) {
  const event = new KeyboardEvent('keydown', option)
  window.dispatchEvent(event)
  setTimeout(() => {
    const event = new KeyboardEvent('keyup', option)
    window.dispatchEvent(event)
  }, 100)
}

document.addEventListener('keydown', function (event) {
  console.log('code:', event.code)
  console.log('key:', event.key)
  console.log('keyCode:', event.keyCode)
})

export class PageController {
  up() {
    const height = window.innerHeight
    window.scrollBy({ top: -height, behavior: 'smooth' })
  }

  down() {
    const height = window.innerHeight
    window.scrollBy({ top: height, behavior: 'smooth' })
  }

  left() {
    simulateKeydown(DIR_MAP.LEFT)
  }

  right() {
    simulateKeydown(DIR_MAP.RIGHT)
  }
}
