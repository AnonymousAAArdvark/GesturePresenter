(()=>{function e(e,t){if(window.location.href.includes("docs.google.com/presentation")){const n=document.querySelector(".punch-present-iframe");n&&n.contentWindow?function(e,t,n){let o=new KeyboardEvent("keydown",{key:t,keyCode:n,code:t,bubbles:!0,shiftKey:!1,ctrlKey:!1,metaKey:!1});e.dispatchEvent(o),setTimeout((()=>{let o=new KeyboardEvent("keyup",{key:t,keyCode:n,code:t,bubbles:!0,shiftKey:!1,ctrlKey:!1});e.dispatchEvent(o)}),100)}(n.contentDocument||n.contentWindow.document,e,t):console.warn("Google Slides presentation iframe not found")}else console.warn("Unsupported presentation platform")}chrome.runtime.onMessage.addListener((function(t,n,o){"Left"===t.gesture?e("ArrowLeft",37):"Right"===t.gesture&&e("ArrowRight",39)}))})();