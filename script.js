var ourInstance = null;
var originWidth = 1280;
var originHeight = 720;
var scaleToFit = true;

var canvas = document.querySelector("#unity-canvas");
var container = canvas.parentElement;
var loadingBar = document.querySelector("#unity-loading");
var loadingText = document.querySelector("#unity-loading-text");
var config = {
    dataUrl: "Build/Metamask.data",
    frameworkUrl: "Build/Metamask.framework.js",
    codeUrl: "Build/Metamask.wasm",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "RealityChain",
    productName: "2dverse: UniqueOne World",
    productVersion: "0.9.1.U",
};
container.setAttribute("isportrait", false);

function onResize() {
    var w;
    var h;

    if (window.innerWidth > window.innerHeight) {
        container.setAttribute("isportrait", false);
    } else {
        container.setAttribute("isportrait", true);
    }

    if (scaleToFit) {
        w = window.innerWidth;
        h = window.innerHeight;
        var r = originHeight / originWidth;

        if (container.getAttribute("isportrait").toLowerCase() == "true") {
            r = originWidth / originHeight;
        }

        if (w * r > window.innerHeight) {
            w = Math.min(w, Math.ceil(h / r));
        }
        h = Math.floor(w * r);
    } else {
        if (container.getAttribute("isportrait").toLowerCase() == "true") {
            w = originHeight;
            h = originWidth;
        } else {
            w = originWidth;
            h = originHeight;
        }
    }

    container.style.width = canvas.style.width = w + "px";
    container.style.height = canvas.style.height = h + "px";
    container.style.top = Math.floor((window.innerHeight - h) / 2) + "px";
    container.style.left = Math.floor((window.innerWidth - w) / 2) + "px";
}

function toggleOrientation(isportrait) {
    container.setAttribute("isportrait", isportrait);
    onResize();
}

function callUnityResize(objName, objCallback) {
    onResize();
    ourInstance.Module.SendMessage(objName, objCallback, container.getAttribute("isportrait").toLowerCase());
}

function openTwitch(targetChannel) {
    var options = {
        width: 400,
        height: 300,
        channel: targetChannel,
        // only needed if your site is also embedded on embed.example.com and othersite.example.com
        parent: ["embed.example.com", "othersite.example.com"]
    };
    var player = new Twitch.Player("div-embed", options);
    player.setVolume(0.5);

    document.getElementById("div-embed").style.display = "block";
    dragElement(document.getElementById("div-embed"));
}

function closeEmbed() {
    document.getElementById("div-embed").style.display = "none";
    document.getElementById("div-embed").innerHTML = "<div id='div-embed-header'>Click here to move</div>";
}

function openYoutube(targetChannel) {
    document.getElementById("div-embed").style.display = "block";

    var el = document.createElement("div");
    el.id = "youtube-embed";
    el.innerHTML = "<iframe width='400' height='300' src='https://www.youtube.com/embed/live_stream?channel=" + targetChannel + "' frameborder='0' allowfullscreen></iframe>";
    document.getElementById("div-embed").appendChild(el);

    dragElement(document.getElementById("div-embed"));
}

function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById(elmnt.id + "-header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

createUnityInstance(canvas, config, (progress) => {
    loadingText.innerHTML = "Loading " + Math.ceil(100 * progress) + "%";
}).then(function(instance) {
    loadingBar.style.display = "none";
    ourInstance = instance;
    callUnityResize();
});
