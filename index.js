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

/**
 * Convenience higher order function that returns a call to drawStripes
 * @param {Array<string>} stripes Array of ctx.fillStyle values.
 */
function drawStripesFunc(stripes) {
    return (ctx) => {
        drawStripes(ctx, stripes);
    };
}

function resetStripesElement() {
    stripes.innerHTML = "";
}

let allDesigns = {
    none: new Background("None", resetStripesElement, (ctx) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }),

    "custom-image": new Background( //{{{
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
    ), //}}}

    "custom-javascript": new Background( //{{{
        "Custom JavaScript",
        () => {
            stripes.innerHTML = "TODO AGAIN";
        },
        (ctx) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.ellipse(
                canvas.width / 4,
                canvas.height / 5,
                canvas.width / 10,
                canvas.height / 10,
                0,
                0,
                2 * Math.PI,
            );
            ctx.fill();

            ctx.beginPath();
            ctx.ellipse(
                (canvas.width * 3) / 4,
                canvas.height / 5,
                canvas.width / 10,
                canvas.height / 10,
                0,
                0,
                2 * Math.PI,
            );
            ctx.fill();

            ctx.lineWidth = canvas.width / 30;
            ctx.beginPath();
            ctx.ellipse(
                canvas.width / 2,
                (canvas.height * 3) / 4,
                canvas.width / 4,
                canvas.height / 4,
                0,
                Math.PI,
                0,
            );
            ctx.stroke();
        },
    ), //}}}

    rainbow: new Background(
        "Rainbow",
        resetStripesElement,
        drawStripesFunc([
            "#e60000",
            "#ff8e00",
            "#ffef00",
            "#00821b",
            "#004bff",
            "#780089",
        ]),
    ),

    "progress-pride-ratio": new Background(
        "Progress Pride (Ratio)",
        resetStripesElement,
        (ctx) => {
            // Background rainbow
            drawStripes(ctx, [
                "#e60000",
                "#ff8e00",
                "#ffef00",
                "#00821b",
                "#004bff",
                "#780089",
            ]);

            // Ratios taken from svg version of flag
            // Black stripe
            ctx.fillStyle = "#000000";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(canvas.width * 0.16, 0);
            ctx.lineTo(canvas.width * 0.4773, canvas.height / 2);
            ctx.lineTo(canvas.width * 0.16, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.fill();

            // Brown stripe
            ctx.fillStyle = "#613915";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(canvas.width * 0.08, 0);
            ctx.lineTo(canvas.width * 0.3973, canvas.height / 2);
            ctx.lineTo(canvas.width * 0.08, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.fill();

            // Light blue stripe
            ctx.fillStyle = "#74d7ee";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(canvas.width * 0.3173, canvas.height / 2);
            ctx.lineTo(0, canvas.height);
            ctx.fill();

            // Light pink stripe
            ctx.fillStyle = "#ffafc8";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(canvas.width * -0.08, 0);
            ctx.lineTo(canvas.width * 0.2373, canvas.height / 2);
            ctx.lineTo(canvas.width * -0.08, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.fill();

            // White stripe
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(canvas.width * -0.16, 0);
            ctx.lineTo(canvas.width * 0.1573, canvas.height / 2);
            ctx.lineTo(canvas.width * -0.16, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.fill();
        },
    ),

    "progress-pride-angle": new Background(
        "Progress Pride (Angle)",
        resetStripesElement,
        (ctx) => {
            // Background rainbow
            drawStripes(ctx, [
                "#e60000",
                "#ff8e00",
                "#ffef00",
                "#00821b",
                "#004bff",
                "#780089",
            ]);

            const chevronAngle = 0.7896347613;
            const chevronWidth = canvas.width * 0.08;

            // Ratios taken from svg version of flag
            // Black stripe
            ctx.fillStyle = "#000000";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(chevronWidth * 2, 0);
            ctx.lineTo(
                chevronWidth * 2 + canvas.height / 2 / Math.tan(chevronAngle),
                canvas.height / 2,
            );
            ctx.lineTo(chevronWidth * 2, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.fill();

            // Brown stripe
            ctx.fillStyle = "#613915";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(chevronWidth, 0);
            ctx.lineTo(
                chevronWidth + canvas.height / 2 / Math.tan(chevronAngle),
                canvas.height / 2,
            );
            ctx.lineTo(chevronWidth, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.fill();

            // Light blue stripe
            ctx.fillStyle = "#74d7ee";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(
                canvas.height / 2 / Math.tan(chevronAngle),
                canvas.height / 2,
            );
            ctx.lineTo(0, canvas.height);
            ctx.fill();

            // Light pink stripe
            ctx.fillStyle = "#ffafc8";
            ctx.beginPath();
            ctx.moveTo(-chevronWidth, 0);
            ctx.lineTo(
                -chevronWidth + canvas.height / 2 / Math.tan(chevronAngle),
                canvas.height / 2,
            );
            ctx.lineTo(-chevronWidth, canvas.height);
            ctx.fill();

            // White stripe
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.moveTo(-2 * chevronWidth, 0);
            ctx.lineTo(
                -2 * chevronWidth + canvas.height / 2 / Math.tan(chevronAngle),
                canvas.height / 2,
            );
            ctx.lineTo(-2 * chevronWidth, canvas.height);
            ctx.fill();
        },
    ),

    lesbian5: new Background(
        "Lesbian (5)",
        resetStripesElement,
        drawStripesFunc([
            "#d62900",
            "#ff9b55",
            "#ffffff",
            "#d462a6",
            "#a50062",
        ]),
    ),

    lesbian7: new Background(
        "Lesbian (7)",
        resetStripesElement,
        drawStripesFunc([
            "#d62900",
            "#f07722",
            "#ff9b55",
            "#ffffff",
            "#d462a6",
            "#b75591",
            "#a50062",
        ]),
    ),

    gay5: new Background(
        "Gay (5)",
        resetStripesElement,
        drawStripesFunc([
            "#018e71",
            "#99e9c2",
            "#ffffff",
            "#7cafe3",
            "#3b1379",
        ]),
    ),

    gay7: new Background(
        "Gay (7)",
        resetStripesElement,
        drawStripesFunc([
            "#018e71",
            "#21cfac",
            "#99e9c2",
            "#ffffff",
            "#7cafe3",
            "#4f47cc",
            "#3b1379",
        ]),
    ),

    bisexual: new Background(
        "Bisexual",
        resetStripesElement,
        drawStripesFunc([
            "#d70071",
            "#d70071",
            "#9c4e97",
            "#0035aa",
            "#0035aa",
        ]),
    ),

    trans: new Background(
        "Transgender",
        resetStripesElement,
        drawStripesFunc([
            "#5bcffa",
            "#f5abb9",
            "#ffffff",
            "#f5abb9",
            "#5bcffa",
        ]),
    ),

    nonbinary: new Background(
        "Non-binary",
        resetStripesElement,
        drawStripesFunc(["#fff42f", "#fefefe", "#9c59d1", "#292929"]),
    ),

    "nonbinary-war": new Background(
        "Non-binary (wartime)",
        resetStripesElement,
        drawStripesFunc(["#fff42f", "#292929", "#9c59d1", "#fefefe"]),
    ),

    pansexual: new Background(
        "Pansexual",
        resetStripesElement,
        drawStripesFunc(["#ff1b8d", "#ffd900", "#1bb3ff"]),
    ),

    asexual: new Background(
        "Asexual",
        resetStripesElement,
        drawStripesFunc(["#000000", "#a5a5a5", "#ffffff", "#810081"]),
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
