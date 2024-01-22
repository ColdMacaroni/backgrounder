/** @type {HTMLCanvasElement} */
let canvas;

/**
 * @description Used to download the image given by the user
 * @type {HTMLImageElement}
 * */
let image = new Image();

/** @type {HTMLOListElement}*/
let stripes;

/** @type {HTMLSelectElement} */
let dropdown;

/** @type {CanvasRenderingContext2D} */
let context;

class Background {
    /**
     * @param {function(): void} setup The function called once when this is selected.
     * @param {function(CanvasRenderingContext2D): void} draw The function called when redrawing.
     */
    constructor(setup, draw) {
        this.setup = setup;
        this.draw = draw;
    }
}

let allDesigns = {
    none: new Background(
        () => {
            stripes.innerHTML = "";
        },
        (ctx) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        },
    ),
    test1: new Background(
        () => {
            stripes.innerHTML = "<li>Whatt!! Test 1!?!</li>";
        },
        (ctx) => {
            ctx.fillStyle = "green";
            // ctx.fill();
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        },
    ),

    test2: new Background(
        () => {
            stripes.innerHTML = "<li>Omg you picked test 2</li>";
        },
        (ctx) => {
            ctx.fillStyle = "red";
            // ctx.fill();
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        },
    ),
    "custom-image": new Background(
        () => {
            stripes.innerHTML = "TODO";
        },
        (ctx) => {
            ctx.fillStyle = "#ff00dc";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "black";
            ctx.fillRect(
                canvas.width / 2,
                0,
                canvas.width / 2,
                canvas.height / 2,
            );
            ctx.fillRect(
                0,
                canvas.height / 2,
                canvas.width / 2,
                canvas.height / 2,
            );
        },
    ),
};

function bodyLoad() {
    canvas = document.getElementById("main-canvas");
    context = canvas.getContext("2d");
    dropdown = document.getElementById("background-select");
    stripes = document.getElementById("stripes");

    // Start with a square canvas bc it looks better.
    canvas.height = canvas.width;

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

function saveCanvas() {
    // Adapted from: https://stackoverflow.com/a/58652379
    let downloadLink = document.createElement("a");

    downloadLink.setAttribute(
        "download",
        `backgrounder-${Math.round(Math.random() * 9999)}.png`,
    );

    canvas.toBlob(function (blob) {
        let url = URL.createObjectURL(blob);
        downloadLink.setAttribute("href", url);
        downloadLink.click();
    });
}

/**
 * Redraws the canvas stack: Background -> User Image -> Overlay?
 */
function redrawCanvas() {
    allDesigns[dropdown.value].draw(context);
    console.log(allDesigns[dropdown.value]);
    context.drawImage(image, 0, 0);
}

/**
 * Meant to be called when an image is reset.
 * For example: Before a new image has loaded.
 */
function disableCanvas() {
    canvas.width = "30%";
}

function updateDropdown(_event) {
    allDesigns[dropdown.value].setup();
    redrawCanvas();
}

function imageUploaded(event) {
    loadImage(event.target.files[0]);
}

function loadImage(file) {
    disableCanvas();
    image.src = URL.createObjectURL(file);

    console.log(file.name);
}
