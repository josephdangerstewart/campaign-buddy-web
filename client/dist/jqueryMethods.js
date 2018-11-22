Array.prototype.isArray = true;

var overlayFunctions = [];
var modal;
var saveModel;
var eventClassMask = [
  "dropdown-text",
  "remove-skill"
];

function goTo(s1,s2,method,callback) {
  $("#"+s1).hide('slide',{
    direction:(method == "back" ? "right" : "left")
  },200, function() {
    $("#"+s2).show('slide',{
      direction:(method == "back" ? "left" : "right")
    },200,callback)
  })
}

function slideOut(el, direction ,callback, duration) {
  $("#"+el).hide('slide', {
    direction: (direction || "left")
  }, duration || 200, callback)
}

function slideIn(el, direction ,callback, duration) {
  $("#"+el).show('slide', {
    direction: (direction || "right")
  }, duration || 200, callback)
}

function fade(el, inOut, callback, duration) {
  if (inOut=="out") {
    $("#" + el).hide('fade', {}, duration || 500, callback);
  } else {
    $("#" + el).show('fade', {}, duration || 500, callback)
  }
}

function stopEvent(event) {
  for (let i = 0; i < eventClassMask.length; i++) {
    let curTarget = event.target;
    while (curTarget.tagName && curTarget.tagName != "body") {
      if (curTarget.classList && curTarget.classList.contains(eventClassMask[i]))
        return true;
      curTarget = curTarget.parentNode;
    }
  }

  return false;
}

function overlayClick(event) {
  if (stopEvent(event)) {
    return;
  }

  for (let i = 0; i < overlayFunctions.length; i++) {
    overlayFunctions[i]();
  }

  overlayFunctions = [];
}

document.getElementsByTagName("html")[0].onclick = overlayClick;
