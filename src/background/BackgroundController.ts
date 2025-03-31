import { EnumTabAction } from '../enums'

function clampIndex(index: number, min: number, max: number) {
  if (index < min) {
    return max
  }
  if (index > max) {
    return min
  }
  return index
}

export class BackgroundController {
  constructor() {
    this.init()
  }

  private async init() {
    this.setupMessageListeners()
  }

  private setupMessageListeners() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === EnumTabAction.TOGGLE_LEFT) {
        this.prev()
      } else if (message.type === EnumTabAction.TOGGLE_RIGHT) {
        this.next()
      }
    })
  }

  private prev() {
    chrome.tabs.query({}).then((list) => {
      const activeIndex = list.findIndex((tab) => tab.active)
      const prevIndex = clampIndex(activeIndex - 1, 0, list.length - 1)
      const id = list[prevIndex].id
      if (id) {
        chrome.tabs.update(list[activeIndex].id!, { active: false })
        chrome.tabs.update(id, { active: true })
      }
    })
  }

  private next() {
    chrome.tabs.query({}).then((list) => {
      const activeIndex = list.findIndex((tab) => tab.active)
      const nextIndex = clampIndex(activeIndex + 1, 0, list.length - 1)
      const id = list[nextIndex].id
      if (id) {
        chrome.tabs.update(list[activeIndex].id!, { active: false })
        chrome.tabs.update(id, { active: true })
      }
    })
  }
}

// 初始化后台控制器
const controller = new BackgroundController()
