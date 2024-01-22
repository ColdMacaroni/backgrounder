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
     * @name {string} name The pretty name of the background
     * @param {function(): void} setup The function called once when this is selected.
     * @param {function(CanvasRenderingContext2D): void} draw The function called when redrawing.
     */
    constructor(name, setup, draw) {
        this.name = name;
        this.setup = setup;
        this.draw = draw;
    }
}

/**
 * @param {CanvasRenderingContext2D} ctx The canvas context
 * @param {Array<string>} stripes Array of ctx.fillStyle values.
 */
function drawStripes(ctx, stripes) {
    let stripeHeight = canvas.height / stripes.length;
    for (let i = 0; i < stripes.length; i++) {
        console.log(stripes[i]);
        ctx.fillStyle = stripes[i];
        ctx.fillRect(0, stripeHeight * i, canvas.width, stripeHeight);
    }
}

function resetStripesElement() {
    stripes.innerHTML = "";
}

let allDesigns = {
    none: new Background("None", resetStripesElement, (ctx) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }),
    trans: new Background("Trans", resetStripesElement, (ctx) => {
        drawStripes(ctx, ["#5bcffa", "#f5abb9", "white", "#f5abb9", "#5bcffa"]);
    }),

    "custom-image": new Background(
        "Custom Image",
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

    "custom-javascript": new Background(
        "Custom JavaScript",
        () => {
            stripes.innerHTML = "TODO AGAIN";
        },
        (ctx) => {},
    ),
};

function bodyLoad() {
    canvas = document.getElementById("main-canvas");
    context = canvas.getContext("2d");
    dropdown = document.getElementById("background-select");
    stripes = document.getElementById("stripes");

    // Populate dropdown
    for (let [id, obj] of Object.entries(allDesigns)) {
        console.log(allDesigns);
        console.log(id, obj);
        dropdown.innerHTML += `<option value="${id.toString()}">${obj.name}</option>`;
    }

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

//  TODO:  Test how this behaves when saving an image bigger than what the css allows
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
