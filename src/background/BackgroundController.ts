export class BackgroundController {

    constructor() {
        this.init();
    }

    private async init() {
        this.setupMessageListeners();
    }



    private setupMessageListeners() {
        // 监听来自 offscreen 的消息
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            console.log(message);
        });
    }
}

// 初始化后台控制器
const controller = new BackgroundController();