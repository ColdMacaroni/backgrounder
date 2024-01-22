/** @type {HTMLCanvasElement} */
let canvas;

/**
 * @description The div that holds all the settings and such
 * @type {HTMLDivElement} */
let controls;

/** @type {HTMLImageElement} */
let image = new Image();

/** @type {CanvasRenderingContext2D} */
let context;

let allDesigns = {
    whatevre: function (ctx) {
        // do some drawing;
    },
};

function bodyLoad() {
    canvas = document.getElementById("main-canvas");
    context = canvas.getContext("2d");
    controls = document.getElementById("controls");

    // From https://stackoverflow.com/a/38968948
    // https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_operations#droptargets
    // Allow drag and drop image
    canvas.ondragover = canvas.ondragenter = (event) => {
        event.preventDefault();

        event.target.classList.add("dragover");
    };

    canvas.ondragleave = (event) => {
        event.target.classList.remove("dragover");
    };

    canvas.ondrop = (event) => {
        event.preventDefault();
        event.target.classList.remove("dragover");

        let file = event.dataTransfer.files[0];

        // Update input box
        document.getElementById("image-input").files = event.dataTransfer.files;

        loadImage(file);
    };
}

/**
 * Updates the canvas's width and height with the image's and redraws.
 * Meant to be called after an image is loaded.
 */
function enableCanvas() {
    canvas.width = image.width;
    canvas.height = image.height;

    redrawCanvas();
}
image.onload = enableCanvas;

/**
 * Redraws the canvas stack: Background -> User Image -> Overlay?
 */
function redrawCanvas() {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
}

/**
 * Meant to be called when an image is reset.
 * For example: Before a new image has loaded.
 */
function disableCanvas() {
    canvas.width = "30%";
}

function imageUploaded(event) {
    loadImage(event.target.files[0]);
}

function loadImage(file) {
    disableCanvas();
    image.src = URL.createObjectURL(file);

    console.log(file.name);
}
