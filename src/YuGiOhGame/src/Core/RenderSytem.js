import { THEMES } from "../themes.js";
import CardRenderer from "./CardRenderer.js";
import { fontPaths } from "../globals.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

export const CANVAS_WIDTH = canvas.width;
export const CANVAS_HEIGHT = canvas.height;

/** Encapsulates rendering logic. */
export default class RenderSystem {
    /**
     * @param {Array} spriteSheetPaths The relative paths to the sprite sheets.
     */
    constructor(spriteSheetPaths) {
        this.assetsLoaded = 0;
        this.assetsTotal = spriteSheetPaths.length + Object.keys(fontPaths).length;
        this.ready = false;
        this.ctx = ctx;
        this.canvas = canvas;

        // Enlarged images look blurry if smoothing is enabled.
        // Should always remain disabled to retain the pixelated aesthetic.
        ctx.imageSmoothingEnabled = false;

        ctx.textAlign = "center";

        // Focus the canvas so that the player doesn't have to click on it.
        canvas.focus();

        this.spriteSheets = this.loadSpriteSheets(spriteSheetPaths);

        this.fonts = this.loadFonts(fontPaths);

        this.card = new CardRenderer(canvas, ctx, this.spriteSheets, this);
    }

    /**
     * Loads the sprite sheets and emits a ready signal if all assets are loaded.
     * @param {Array} paths Relative paths to the spritesheets.
     * @returns An array of images, which are loaded when this.ready is true.
     */
    loadSpriteSheets(paths) {
        let spriteSheets = [];

        paths.forEach((path, index) =>
        {
            const img = new Image();

            // Update load progress and report ready once all assets loaded
            img.onload = () => {
                this.assetsLoaded++;
                this.ready = (this.assetsLoaded === this.assetsTotal);
            }

            img.src = path;
            spriteSheets[index] = img;
        });
        
        return spriteSheets;
    }

    /**
     * Loads the fonts and adds them to the document, emitting a ready signal if all assets are loaded.
     * @param {Array} fontPaths Relative paths to the font files.
     * @returns The array of loaded fonts.
     */
    loadFonts(fontPaths) {
        let fonts = {}
        
        for (const [name, path] of Object.entries(fontPaths)) {
            const font = new FontFace(
                name,
                `url(${path})`
            );

            fonts[name] = font;

            font.load().then(font => {
				document.fonts.add(font);
                this.assetsLoaded++;
                this.ready = (this.assetsLoaded === this.assetsTotal);
			});
        };

        return fonts;
	}

    /** Clears the canvas. */
    clear() {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    /**
     * Sets the canvas to a specified background color.
     * @param {String} color The color to set the canvas to (hex values defined in themes.js).
     */
    background(color) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    /**
     * Draws a horizontal line at a specified position and width.
     * @param {Number} x The x coordinate to begin the line at.
     * @param {Number} y The y coordinate to draw the line at.
     * @param {Number} width The length of the line in pixels.
     */
    line(x, y, width) {
        ctx.beginPath();

        ctx.strokeStyle = THEMES.Colors.White;
        ctx.lineWidth = 5;

        ctx.moveTo(x, y); // Move the virtual pen to starting (x, y)
        ctx.lineTo(x + width, y); // Draw a digital path to target (x, y)
        ctx.stroke();
    }

    /**
     * Draws large centered text at a specified height.
     * @param {String} text The text to display.
     * @param {Number} y The height or y coordinate where the text will display.
     * @param {String} color The color to draw the text, white by default.
     */
    headerText(text, y, color = THEMES.Colors.White) {
        ctx.fillStyle = color;
        ctx.font = `${THEMES.FontSizes.Large}px ${THEMES.Fonts.CardName}`;
        ctx.fillText(text, CANVAS_WIDTH / 2, y, CANVAS_WIDTH);
    }

    /**
     * Draws regular (medium-sized) text at a specified position.
     * @param {String} text The text to display.
     * @param {Number} x The x coordinate to draw the text at.
     * @param {Number} y The y coordinate to draw the text at.
     */
    text(text, x, y) {
        ctx.font = `${THEMES.FontSizes.Medium}px ${THEMES.Fonts.Default}`;
        ctx.fillStyle = THEMES.Colors.White;
        ctx.fillText(text, x, y);
    }

    /**
     * Measures the pixel size of the given text string.
     * @param {String} text The text to be measured.
     * @param {Number} fontSize The size of the font to be measured.
     * @param {String} fontFace The name of the FontFace to be measured.
     * @returns An object containing width and height properties of that string.
     */
    measureText(text, fontSize, fontFace = THEMES.Fonts.Default) {
        ctx.font = `${fontSize}px ${fontFace}`;
        const m = this.ctx.measureText(text);
        return {
            width: m.width,
            height: m.actualBoundingBoxAscent + m.actualBoundingBoxDescent
        }
    }

    /**
     * Wraps text into word-based lines that fit within a fixed width.
     * @param {String} text The text to wrap.
     * @param {Number} maxWidth The available width for each line.
     * @param {Number} fontSize The font size to use while measuring.
     * @param {String} fontFace The font face to use while measuring.
     * @returns {Array<Array<String>>} Paragraphs, each containing arrays of words for individual lines.
     */
    wrapText(text, maxWidth, fontSize, fontFace = THEMES.Fonts.Default) {
        const paragraphs = String(text ?? "").replace(/\r\n/g, "\n").split("\n");
        const measuredSpaceWidth = this.measureText(" ", fontSize, fontFace).width;

        return paragraphs.map((paragraph) => {
            const words = paragraph.match(/\S+/g) || [];

            if (words.length === 0) {
                return [];
            }

            const lines = [];
            let currentLine = [];
            let currentLineWidth = 0;

            words.forEach((word) => {
                const wordWidth = this.measureText(word, fontSize, fontFace).width;
                const candidateLineWidth = currentLine.length === 0
                    ? wordWidth
                    : currentLineWidth + measuredSpaceWidth + wordWidth;

                if (currentLine.length > 0 && candidateLineWidth > maxWidth) {
                    lines.push(currentLine);
                    currentLine = [word];
                    currentLineWidth = wordWidth;
                } else {
                    currentLine.push(word);
                    currentLineWidth = candidateLineWidth;
                }
            });

            if (currentLine.length > 0) {
                lines.push(currentLine);
            }

            return lines;
        });
    }

    /**
     * Justifies a line by expanding the inter-word space width.
     * @param {Array<String>} words The words that belong to the line.
     * @param {Number} x The left edge of the line.
     * @param {Number} maxWidth The total width available for the line.
     * @param {Number} fontSize The font size used for measurement.
     * @param {String} fontFace The font face used for measurement.
     * @param {Boolean} justify Whether the line should be justified.
     * @returns {Array<Object>} The positioned words for drawing.
     */
    justifyLine(words, x, maxWidth, fontSize, fontFace, justify = true) {
        const measuredWords = words.map((word) => ({
            text: word,
            width: this.measureText(word, fontSize, fontFace).width,
        }));

        const totalWordWidth = measuredWords.reduce((total, word) => total + word.width, 0);
        const baseSpaceWidth = this.measureText(" ", fontSize, fontFace).width;
        const spaceCount = Math.max(words.length - 1, 0);
        const remainingWidth = maxWidth - totalWordWidth - (spaceCount * baseSpaceWidth);

        let spaceWidth = baseSpaceWidth;

        if (justify && words.length > 1 && remainingWidth > 0) {
            spaceWidth += remainingWidth / spaceCount;
        }

        let currentX = x;

        return measuredWords.map((word, index) => {
            const wordX = currentX;
            currentX += word.width + (index < measuredWords.length - 1 ? spaceWidth : 0);
            return { ...word, x: wordX };
        });
    }

    /**
     * Reduces line-height for dense text by considering both content length and font size.
     * Character count and font size each contribute to the reduction up to their respective
     * thresholds, after which the effect is capped. The result is also clamped to a minimum
     * multiplier to preserve readability.
     *
     * @param {String} text Text being laid out.
     * @param {Number} fontSize Current font size.
     * @param {Number} baseMultiplier Base line-height multiplier.
     * @returns {Number} Adjusted line-height multiplier.
     */
    getAdaptiveLineHeightMultiplier(text, fontSize, baseMultiplier = 1) {
        const characterCount = String(text ?? "").replace(/\s+/g, "").length;

        const CHARACTER_PRESSURE_THRESHOLD = 220;
        const FONT_PRESSURE_THRESHOLD = 24;
        const MAX_CHARACTER_REDUCTION = 0.12;
        const MAX_FONT_REDUCTION = 0.08;
        const MIN_LINE_HEIGHT_MULTIPLIER = 0.6;

        const textPressure = Math.min(1, characterCount / CHARACTER_PRESSURE_THRESHOLD);
        const fontPressure = Math.min(1, fontSize / FONT_PRESSURE_THRESHOLD);
        const reduction = (MAX_CHARACTER_REDUCTION * textPressure) + (MAX_FONT_REDUCTION * fontPressure);

        return Math.max(MIN_LINE_HEIGHT_MULTIPLIER, baseMultiplier * (1 - reduction));
    }

    /**
     * Builds a default layout for a given font size without trying to fit it to the textbox.
     * @param {String} text The text to layout.
     * @param {Object} bounds The textbox bounds.
     * @param {String} fontFace The font face to use.
     * @param {Number} fontSize The font size to use.
     * @param {Number} lineHeightMultiplier The line spacing multiplier.
     * @param {Number} spaceWidthFactor A multiplier applied to the measured space width when wrapping text.
     * @returns {Object} A layout object for the specified font size.
     */
    buildDefaultLayout(text, bounds, fontFace, fontSize, lineHeightMultiplier, spaceWidthFactor) {
        const paragraphs = this.wrapText(text, bounds.size.x, fontSize, fontFace, spaceWidthFactor);
        const lineHeight = fontSize * lineHeightMultiplier;
        const lines = [];
        let y = bounds.position.y;

        paragraphs.forEach((paragraphLines) => {
            if (paragraphLines.length === 0) {
                return;
            }

            paragraphLines.forEach((lineWords, lineIndex) => {
                const isLastLineOfParagraph = lineIndex === paragraphLines.length - 1;
                const justify = !isLastLineOfParagraph;
                const positionedWords = this.justifyLine(lineWords, bounds.position.x, bounds.size.x, fontSize, fontFace, justify);

                lines.push({ words: positionedWords, y, justify });
                y += lineHeight;
            });
        });

        return {
            fontSize,
            fontFace,
            lineHeight,
            lineHeightMultiplier,
            bounds,
            lines,
            height: y - bounds.position.y,
        };
    }

    /**
     * Builds a fitted layout by shrinking the text size in small discrete steps.
     * @param {String} text The text to layout.
     * @param {Object} bounds The textbox bounds containing position and size.
     * @param {String} fontFace The font to use.
     * @param {Number} initialFontSize The starting font size.
     * @param {Number} lineHeightMultiplier The multiplier for line height.
     * @returns {Object} A complete layout object ready for drawing.
     */
    buildFittedLayout(text, bounds, fontFace, initialFontSize, lineHeightMultiplier) {
        const minFontSize = Math.max(6, initialFontSize * 0.35);
        const fontSizeStep = 0.01;
        const initialLayout = this.buildDefaultLayout(text, bounds, fontFace, initialFontSize, lineHeightMultiplier);

        if (initialLayout.height <= bounds.size.y) {
            return initialLayout;
        }

        for (let fontSize = initialFontSize; fontSize >= minFontSize; fontSize -= fontSizeStep) {
            const adaptiveLineHeightMultiplier = this.getAdaptiveLineHeightMultiplier(text, fontSize, lineHeightMultiplier);
            const candidateLayout = this.buildDefaultLayout(text, bounds, fontFace, fontSize, adaptiveLineHeightMultiplier);

            if (candidateLayout.height <= bounds.size.y) {
                // Layout needs to be adjusted to spread out the remaining pixels evenly in the margin of the text.
                // Like this, the text should be spread evenly and the last line should not have any additional slack.
                let remainingSlack = bounds.size.y - candidateLayout.height;
                let totalLines = candidateLayout.lines.length;
                let slackPerLine = remainingSlack / totalLines;

                for (let line = 1; line < totalLines; line++) {
                    candidateLayout.lines[line].y += (slackPerLine * line);
                }
                
                return candidateLayout;
            }
        }
    }

    /**
     * Builds the final layout for a textbox by trying the default layout first and then
     * falling back to a fitted layout if the text overflows vertically.
     * @param {String} text The text to layout.
     * @param {Object} bounds The textbox bounds.
     * @param {String} fontFace The font face to use.
     * @param {Number} fontSize The starting font size to use.
     * @param {Number} lineHeightMultiplier The line spacing multiplier.
     * @returns {Object} A layout object ready for drawing.
     */
    buildTextLayout(text, bounds, fontFace, fontSize, lineHeightMultiplier) {
        const defaultLayout = this.buildDefaultLayout(text, bounds, fontFace, fontSize, lineHeightMultiplier);

        if (defaultLayout.height <= bounds.size.y) {
            return defaultLayout;
        }

        return this.buildFittedLayout(text, bounds, fontFace, fontSize, lineHeightMultiplier);
    }

    /**
     * Draws a precomputed text layout.
     * @param {Object} layout The layout object returned by buildTextLayout().
     * @param {CanvasRenderingContext2D} The context to draw to.
     */
    drawLayout(layout, ctx) {
        if (!layout) {
            return;
        }

        ctx.save();
        ctx.font = `${layout.fontSize}px ${layout.fontFace}`;
        ctx.textAlign = "left";
        ctx.fillStyle = THEMES.Colors.Black;

        layout.lines.forEach((line) => {
            line.words.forEach((word) => {
                ctx.fillText(word.text, word.x, line.y);
            });
        });

        ctx.restore();
    }

    /**
     * Draws a box at specified position and dimensions, with border by default.
     * @param {Vector} position The x and y coordinates of the box to draw.
     * @param {Vector} dimensions The height and width of the box to draw.
     * @param {Boolean} border Whether a white border should be drawn around the box, true by default.
     */
    box(position, dimensions, border = true) {
        ctx.fillStyle = THEMES.Colors.Black;
        ctx.fillRect(position.x, position.y, dimensions.x, dimensions.y);

        if (border) {
            ctx.strokeStyle = THEMES.Colors.White;
            ctx.strokeRect(position.x, position.y, dimensions.x, dimensions.y);
        }
    }

    /**
     * Draws a rounded box at specified position and dimensions, without border by default.
     * @param {String} color The color of the fill inside the box.
     * @param {Vector} position The x and y coordinates of the box to draw.
     * @param {Vector} dimensions The height and width of the box to draw.
     * @param {Boolean} border Whether a white border should be drawn around the box.
     */
    roundedBox(color, position, dimensions, border) {
        const RADIUS = 5;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(position.x, position.y, dimensions.x, dimensions.y, RADIUS);
        ctx.fill();

        if (border) {
            ctx.fillStyle = THEMES.Colors.White;
            ctx.beginPath();
            ctx.roundRect(position.x, position.y, dimensions.x, dimensions.y, RADIUS);
            ctx.stroke();
        }
    }
}