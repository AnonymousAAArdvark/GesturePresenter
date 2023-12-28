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
  const presIframe = document.querySelector('.punch-present-iframe') as HTMLIFrameElement;
  if (!presIframe || !presIframe.contentWindow) {
    console.warn('No presentation iframe found');
    return;
  }
  const presDoc = presIframe.contentDocument || presIframe.contentWindow.document;

  let keyDownEvent = new KeyboardEvent("keydown", {
    key: key,
    keyCode: keyCode,
    code: key,
    bubbles: true,
    shiftKey: false,
    ctrlKey: false,
    metaKey: false
  });
  presDoc.dispatchEvent(keyDownEvent);

  setTimeout(() => {
    let keyUpEvent = new KeyboardEvent("keyup", {
      key: key,
      keyCode: keyCode,
      code: key,
      bubbles: true,
      shiftKey: false,
      ctrlKey: false,
    });
    presDoc.dispatchEvent(keyUpEvent);
  }, 100);
}