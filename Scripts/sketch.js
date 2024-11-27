const canvasSize = 1200;
const menuSize = 50;

const minNumColors = 1;
const maxNumColors = 3;
const defaultNumColors = 3;

const minEvolutionRate = 0.0;
const maxEvolutionRate = 1.0;
const defaultEvolutionRate = 0.1;
const stepEvolutionRate = 0.01;

const minGridSize = 3;
const maxGridSize = 100;
const defaultGridSize = 50;

const minFramerate = 1;
const maxFramerate = 30;
const defaultFramerate = 20;

var redGrid, greenGrid, blueGrid;
var gridSizeLabel, gridSizeSlider, gridSizeValue;
var framerateLabel, framerateSlider, framerateValue;
var isPaused;

function setup() {
    createCanvas(canvasSize, canvasSize + menuSize);
    initMenu();
    resetGrid();
    drawOnce();
}

function draw() {
    if (!isPaused) {
        updateState();
        drawOnce();
    }
}

function drawOnce() {
    noStroke();
    background(0);
    frameRate(framerateSlider.value());
    drawCells();
    drawGrid();
}

function drawGrid() {
    stroke(255);

    const gridSize = gridSizeSlider.value();
    const cellSize = canvasSize / gridSize;
    for (let i = 0; i <= canvasSize; i += cellSize) {
        line(i, 0, i, canvasSize);
        line(0, i, canvasSize, i);
    }
}

function drawCells() {
    noStroke();

    const gridSize = gridSizeSlider.value();
    const cellSize = canvasSize / gridSize;
    for (let i = 0; i < gridSize * gridSize; i++) {
        fill(redGrid[i], greenGrid[i], blueGrid[i]);
        x = (i % gridSize) * cellSize
        y = Math.floor(i / gridSize) * cellSize
        rect(x, y, cellSize, cellSize)
    }
}

function resetGrid() {
    const numColors = numColorsSlider.value();
    
    isPaused = true;
    redGrid = randomGrid();
    blueGrid = ((numColors >= 2) ? randomGrid() : emptyGrid());
    greenGrid = ((numColors >= 3) ? randomGrid() : emptyGrid());
}

function emptyGrid() {
    const gridSize = gridSizeSlider.value();
    return new Array(gridSize * gridSize).fill(0);
}

function randomGrid(grid) {
    grid = emptyGrid();
    for (let i = 0; i <= grid.length; i += 1) {
        loc = randomInt(0, grid.length)
        grid[loc] = randomInt(0, 255)
    }
    return grid
}

function updateState() {
    const gridSize = gridSizeSlider.value();
    const evolutionRate = evolutionRateSlider.value();
    redGrid = gameOfLifeStep(redGrid, gridSize, gridSize, evolutionRate);
    greenGrid = gameOfLifeStep(greenGrid, gridSize, gridSize, evolutionRate);
    blueGrid = gameOfLifeStep(blueGrid, gridSize, gridSize, evolutionRate);
}

function initMenu() {
    const numCols = 6;
    const itemWidth = canvasSize / numCols;

    startButton = createButton('Start');
    startButton.position(itemWidth * 0, canvasSize);
    startButton.class('menu-item');
    startButton.style('height', menuSize / 2 + 'px');
    startButton.style('width', itemWidth + 'px');
    startButton.mousePressed(function () {
        isPaused = false;
    });

    pauseButton = createButton('Pause');
    pauseButton.position(itemWidth * 0, canvasSize + menuSize / 2);
    pauseButton.class('menu-item');
    pauseButton.style('height', menuSize / 2 + 'px');
    pauseButton.style('width', itemWidth + 'px');
    pauseButton.mousePressed(function () {
        isPaused = true;
    });

    clearButton = createButton('Step');
    clearButton.position(itemWidth * 1, canvasSize);
    clearButton.class('menu-item');
    clearButton.style('height', menuSize / 2 + 'px');
    clearButton.style('width', itemWidth + 'px');
    clearButton.mousePressed(function () {
        isPaused = true;
        updateState()
        drawOnce();
    });

    clearButton = createButton('Randomize');
    clearButton.position(itemWidth * 1, canvasSize + menuSize / 2);
    clearButton.class('menu-item');
    clearButton.style('height', menuSize / 2 + 'px');
    clearButton.style('width', itemWidth + 'px');
    clearButton.mousePressed(function () {
        resetGrid();
        drawOnce();
    });

    numColorsLabel = createButton('Color channels');
    numColorsLabel.position(itemWidth * 2, canvasSize);
    numColorsLabel.class('menu-item');
    numColorsLabel.addClass('menu-item-no-hover');
    numColorsLabel.style('height', menuSize / 2 + 'px');
    numColorsLabel.style('width', itemWidth + 'px');

    numColorsSlider = createSlider(minNumColors, maxNumColors, defaultNumColors);
    numColorsSlider.position(itemWidth * 2, canvasSize + menuSize / 2);
    numColorsSlider.input(numColorsUpdated);
    numColorsSlider.class('menu-item');
    numColorsSlider.style('height', menuSize / 2 + 'px');
    numColorsSlider.style('width', itemWidth * 0.7 + 'px');

    numColorsValue = createInput('' + numColorsSlider.value());
    numColorsValue.position(itemWidth * 2.7, canvasSize + menuSize / 2);
    numColorsValue.input(numColorsUpdated);
    numColorsValue.class('menu-item');
    numColorsValue.style('height', menuSize / 2 + 'px');
    numColorsValue.style('width', itemWidth * 0.3 + 'px');

    evolutionRateLabel = createButton('Evolution rate');
    evolutionRateLabel.position(itemWidth * 3, canvasSize);
    evolutionRateLabel.class('menu-item');
    evolutionRateLabel.addClass('menu-item-no-hover');
    evolutionRateLabel.style('height', menuSize / 2 + 'px');
    evolutionRateLabel.style('width', itemWidth + 'px');

    evolutionRateSlider = createSlider(minEvolutionRate, maxEvolutionRate, defaultEvolutionRate, stepEvolutionRate);
    evolutionRateSlider.position(itemWidth * 3, canvasSize + menuSize / 2);
    evolutionRateSlider.input(evolutionRateUpdated);
    evolutionRateSlider.class('menu-item');
    evolutionRateSlider.style('height', menuSize / 2 + 'px');
    evolutionRateSlider.style('width', itemWidth * 0.7 + 'px');

    evolutionRateValue = createInput('' + evolutionRateSlider.value());
    evolutionRateValue.position(itemWidth * 3.7, canvasSize + menuSize / 2);
    evolutionRateValue.input(evolutionRateUpdated);
    evolutionRateValue.class('menu-item');
    evolutionRateValue.style('height', menuSize / 2 + 'px');
    evolutionRateValue.style('width', itemWidth * 0.3 + 'px');
    
    gridSizeLabel = createButton('Grid size');
    gridSizeLabel.position(itemWidth * 4, canvasSize);
    gridSizeLabel.class('menu-item');
    gridSizeLabel.addClass('menu-item-no-hover');
    gridSizeLabel.style('height', menuSize / 2 + 'px');
    gridSizeLabel.style('width', itemWidth + 'px');

    gridSizeSlider = createSlider(minGridSize, maxGridSize, defaultGridSize);
    gridSizeSlider.position(itemWidth * 4, canvasSize + menuSize / 2);
    gridSizeSlider.input(gridSizeUpdated);
    gridSizeSlider.class('menu-item');
    gridSizeSlider.style('height', menuSize / 2 + 'px');
    gridSizeSlider.style('width', itemWidth * 0.7 + 'px');

    gridSizeValue = createInput('' + gridSizeSlider.value());
    gridSizeValue.position(itemWidth * 4.7, canvasSize + menuSize / 2);
    gridSizeValue.input(gridSizeUpdated);
    gridSizeValue.class('menu-item');
    gridSizeValue.style('height', menuSize / 2 + 'px');
    gridSizeValue.style('width', itemWidth * 0.3 + 'px');

    framerateLabel = createButton('Framerate');
    framerateLabel.position(itemWidth * 5, canvasSize);
    framerateLabel.class('menu-item');
    framerateLabel.addClass('menu-item-no-hover');
    framerateLabel.style('height', menuSize / 2 + 'px');
    framerateLabel.style('width', itemWidth + 'px');

    framerateSlider = createSlider(minFramerate, maxFramerate, defaultFramerate);
    framerateSlider.position(itemWidth * 5, canvasSize + menuSize / 2);
    framerateSlider.input(framerateUpdated);
    framerateSlider.class('menu-item');
    framerateSlider.style('height', menuSize / 2 + 'px');
    framerateSlider.style('width', itemWidth * 0.7 + 'px');

    framerateValue = createInput('' + framerateSlider.value());
    framerateValue.position(itemWidth * 5.7, canvasSize + menuSize / 2);
    framerateValue.input(framerateUpdated);
    framerateValue.class('menu-item');
    framerateValue.style('height', menuSize / 2 + 'px');
    framerateValue.style('width', itemWidth * 0.3 + 'px');
}

function numColorsUpdated(event) {
    value = event.target.value
    if (value >= minNumColors && value <= maxNumColors) {
        numColorsSlider.value(value);
        numColorsValue.value(value);
        resetGrid();
        drawOnce();
    }
}

function evolutionRateUpdated(event) {
    value = event.target.value
    if (value >= minEvolutionRate && value <= maxEvolutionRate) {
        evolutionRateSlider.value(value);
        evolutionRateValue.value(value);
    }
}

function gridSizeUpdated(event) {
    value = event.target.value
    if (value >= minGridSize && value <= maxGridSize) {
        gridSizeSlider.value(value);
        gridSizeValue.value(value);
        resetGrid();
        drawOnce();
    }
}

function framerateUpdated(event) {
    value = event.target.value
    if (value >= minFramerate && value <= maxFramerate) {
        framerateSlider.value(value);
        framerateValue.value(value);
    }
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
