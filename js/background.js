chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('control.html',{
	  state: "fullscreen",
	  id: "mainWindow",
    'bounds': {
      'width': 1300,
      'height': 800
    }
  });
});
