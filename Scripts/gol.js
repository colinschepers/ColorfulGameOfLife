const aliveThreshold = 256 / 2;

function gameOfLifeStep(grid, width, height, evolutionRate) {
    newGrid = new Array(grid.length).fill(0);
    for (let loc = 0; loc < grid.length; loc++) {
        const newValue = calculateNewValue(grid, loc, width, height, evolutionRate);
        newGrid[loc] = Math.min(Math.max(newValue, 0), 255)
    }        
    return newGrid
}

function calculateNewValue(grid, loc, width, height, evolutionRate) {
    const currentValue = grid[loc]
    const isAlive = currentValue >= aliveThreshold
    
    var aliveCount = 0
    for (const nLoc of getNeighbourLocations(loc, width, height)) {
        if (grid[nLoc] >= aliveThreshold) {
            aliveCount++;
        }
    }

    if (isAlive) {
        const willDie = aliveCount < 2 || aliveCount > 3
        if (willDie) {
            return (aliveThreshold * (1 - evolutionRate)) + (0 * evolutionRate)
        } else {
            return (currentValue * (1 - evolutionRate)) + (255 * evolutionRate)
        }
    } else {
        const isBorn = aliveCount === 3
        if (isBorn) {
            return (aliveThreshold * (1 - evolutionRate)) + (255 * evolutionRate)
        } else {
            return (currentValue * (1 - evolutionRate)) + (0 * evolutionRate)
        }
    }
}

function* getNeighbourLocations(loc, width, height) {
    const row = Math.floor(loc / width);
    const col = loc % width
    yield wrapAround(row - 1, col - 1, width, height)
    yield wrapAround(row - 1, col,  width, height)
    yield wrapAround(row - 1, col + 1,  width, height)
    yield wrapAround(row, col - 1,  width, height)
    yield wrapAround(row, col + 1,  width, height)
    yield wrapAround(row + 1, col - 1,  width, height)
    yield wrapAround(row + 1, col,  width, height)
    yield wrapAround(row + 1, col + 1,  width, height)
}

function wrapAround(row, col, width, height) {
    const wrappedRow = (row + height) % height;
    const wrappedCol = (col + width) % width;
    return wrappedRow * height + wrappedCol
}
