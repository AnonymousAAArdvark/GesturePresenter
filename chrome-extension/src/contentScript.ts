interface GestureRequest {
  gesture: string;
}

chrome.runtime.onMessage.addListener(function(request: GestureRequest, sender, sendResponse) {
  if (request.gesture === "Left") {
    simulateKeyPress("ArrowLeft", 37);
  } else if (request.gesture === "Right") {
    simulateKeyPress("ArrowRight", 39);
  }
});

function simulateKeyPress(key: string, keyCode: number): void {
  const currentUrl = window.location.href;

  // Check for Google Slides
  if (currentUrl.includes("docs.google.com/presentation")) {
    const googleSlidesIframe = document.querySelector('.punch-present-iframe') as HTMLIFrameElement;
    if (googleSlidesIframe && googleSlidesIframe.contentWindow) {
      const presDoc = googleSlidesIframe.contentDocument || googleSlidesIframe.contentWindow.document;
      dispatchKeyEvent(presDoc, key, keyCode);
    } else {
      console.warn('Google Slides presentation iframe not found');
    }
  }
  else {
    console.warn('Unsupported presentation platform');
  }
}

function dispatchKeyEvent(target: Document | Element, key: string, keyCode: number) {
  let keyDownEvent = new KeyboardEvent("keydown", {
    key: key,
    keyCode: keyCode,
    code: key,
    bubbles: true,
    shiftKey: false,
    ctrlKey: false,
    metaKey: false
  });
  target.dispatchEvent(keyDownEvent);

  setTimeout(() => {
    let keyUpEvent = new KeyboardEvent("keyup", {
      key: key,
      keyCode: keyCode,
      code: key,
      bubbles: true,
      shiftKey: false,
      ctrlKey: false,
    });
    target.dispatchEvent(keyUpEvent);
  }, 100);
}