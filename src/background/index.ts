import { BackgroundController } from "./BackgroundController";
console.log('background is running')
if(!chrome.BackgroundController) {
    chrome.BackgroundController = new BackgroundController();
}

