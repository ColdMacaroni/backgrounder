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

        /**  The button that showcases this background.
         * @type {HTMLButtonElement} */
        this.button = undefined;
    }
}

class BackgroundImage extends Background {
    /**
     * @name {string} name The pretty name of the background
     */
    constructor(name) {
        // Super overwrites setup and draw function names.
        super(
            name,
            () => {
                this.doSetup();
            },
            (ctx) => {
                this.doDraw(ctx);
            },
        );

        /**
         * Used to download the uploaded image.
         * @type {Image}
         */
        this.img = new Image();
        this.img.onload = redrawCanvas;

        /**
         * The element used to upload a background
         * @type {HTMLInputElement}
         */
        this.input = document.createElement("input");
        this.input.type = "file";
        this.input.id = "background-image-input";
        this.input.name = "background";
        this.input.onchange = (event) => {
            this.img.src = URL.createObjectURL(event.target.files[0]);
        };

        this.input.accept = "image/png, image/jpeg";
    }

    /** Creates the file input */
    doSetup() {
        extraControls.appendChild(this.input);
    }

    /** Draws either a missing texture or the given image. */
    doDraw(ctx) {
        const bgfile = this.input.files[0];
        if (!bgfile) {
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
        } else {
            ctx.drawImage(this.img, 0, 0, canvas.width, canvas.height);
        }
    }
}

/** All backgrounds available by default.
 * @type {Object.<string, Background>}
 */
let allDesigns = {
    none: new Background("None", resetControls, (ctx) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }),

    "custom-image": new BackgroundImage("Custom Image"),

    "custom-javascript": new Background( //{{{
        "Custom JavaScript",
        resetControls,
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
        resetControls,
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
        resetControls,
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
        resetControls,
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
        resetControls,
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
        resetControls,
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
        resetControls,
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
        resetControls,
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
        resetControls,
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
        resetControls,
        drawStripesFunc([
            "#5bcffa",
            "#f5abb9",
            "#ffffff",
            "#f5abb9",
            "#5bcffa",
        ]),
    ),

    queer: new Background(
        "Queer",
        resetControls,
        drawStripesFunc([
            "#000000",
            "#9adaeb",
            "#00a4e9",
            "#b6e717",
            "#ffffff",
            "#ffca05",
            "#fd6666",
            "#ffb0ca",
            "#000000",
        ]),
    ),

    nonbinary: new Background(
        "Non-binary",
        resetControls,
        drawStripesFunc(["#fff42f", "#fefefe", "#9c59d1", "#292929"]),
    ),

    "nonbinary-war": new Background(
        "Non-binary (wartime)",
        resetControls,
        drawStripesFunc(["#fff42f", "#292929", "#9c59d1", "#fefefe"]),
    ),

    intersex: new Background("Intersex", resetControls, (ctx) => {
        ctx.fillStyle = "#ffd800";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Ratio from svg on wikipedia
        const outerRad = (Math.min(canvas.height, canvas.width) * 43) / 150;
        const innerRad = Math.min(canvas.height, canvas.width) * 0.2025;

        ctx.fillStyle = "#7902aa";
        ctx.beginPath();
        ctx.ellipse(
            canvas.width / 2,
            canvas.height / 2,
            outerRad,
            outerRad,
            0,
            0,
            2 * Math.PI,
        );
        ctx.fill();

        ctx.fillStyle = "#ffd800";
        ctx.beginPath();
        ctx.ellipse(
            canvas.width / 2,
            canvas.height / 2,
            innerRad,
            innerRad,
            0,
            0,
            2 * Math.PI,
        );
        ctx.fill();
    }),

    pansexual: new Background(
        "Pansexual",
        resetControls,
        drawStripesFunc(["#ff1b8d", "#ffd900", "#1bb3ff"]),
    ),

    asexual: new Background(
        "Asexual",
        resetControls,
        drawStripesFunc(["#000000", "#a5a5a5", "#ffffff", "#810081"]),
    ),

    aromantic: new Background(
        "Aromantic",
        resetControls,
        drawStripesFunc([
            "#3aa740",
            "#a8d47a",
            "#ffffff",
            "#ababab",
            "#000000",
        ]),
    ),

    aroace: new Background(
        "Aroace",
        resetControls,
        drawStripesFunc([
            "#e38d00",
            "#edce00",
            "#ffffff",
            "#62b0dd",
            "#1a3555",
        ]),
    ),
};
