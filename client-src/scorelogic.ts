import Module from "module";
import { isAbsolute } from "path";

import * as model from './model';

const DEFAULT_HEIGHT = 550
const HEIGHT_INCR = 50 // pixels to increase/decrease baseHeight to change scale
const PADDING_LEFT = 50 // Basic left padding for measures

function prepLoadedMusic(newState: model.ScoreState, action: model.ScoreAction): model.ScoreState {
	console.log('prepLoadedMusic entry')
    newState.image = `music/${action.data.filename}/${action.data.filename}.svg`, newState.scoreData = action.data.scoreData
    newState.pixels = calcPixels(action.data.scoreData, DEFAULT_HEIGHT)
    newState.pages = calcPages(newState)
	console.log('newState:', newState)
    return newState
}

// The score data contains float values for measurements
// such as measure and staff positions and width/height.
// When setting the zoom level or "scale" we precalculate
// all of these measurements into pixels so as to avoid
// computing dynamically and repeatedly.
function calcPixels(metrics: model.ScoreMetrics, desiredHeight: number):model.ScoreMetrics {

    const newPx = {
        baseWidth: 0,
        baseHeight: 0,
        viewportWidth: window.innerWidth || document.body.clientWidth,
        viewportHeight: window.innerHeight || document.body.clientHeight,
        scale: 0,
        measures: new Array<number>(metrics.measures.length),
        staves: new Array<model.StaffMetric>(metrics.staves.length),
    }

    newPx.scale = desiredHeight / metrics.baseHeight
    newPx.baseWidth = Math.floor(metrics.baseWidth * newPx.scale),
    newPx.baseHeight = Math.floor(metrics.baseHeight * newPx.scale),
    metrics.measures.forEach((m, i) => {
        newPx.measures[i] = Math.floor(newPx.baseWidth * metrics.measures[i])
    });
    metrics.staves.forEach((s, i) => {
        newPx.staves[i] = {
            name: metrics.staves[i].name,
            top: Math.floor(newPx.baseHeight * metrics.staves[i].top),
            bottom: Math.floor(newPx.baseHeight * metrics.staves[i].bottom),
        }
    });
    return newPx
}

// We're going to precalculate a list of "pages" for the entire score,
// placing the measure indices in an array of 'pages' representing the
// measure in the left-most position for each new page. As measures are
// different widths, we do this by walking through all of the measures
// and noting where we go past the right edge of the page.
function calcPages(state: model.ScoreState): model.ScorePages {
    if (!state.pixels) {
        return state.pages
    }
    const newPages = {
        activePageIndex: state.pages.activePageIndex,
        pages: [0],
    }
    let subtractPixelsForCurrentPage = 0;
    state.pixels.measures.forEach((v,i) => {
        const currentPagePixelValue = (PADDING_LEFT + v) - subtractPixelsForCurrentPage
        if (state.pixels && currentPagePixelValue > state.pixels.viewportWidth) {
            // We've reached a page boundary on the previous measure.
            newPages.pages.push(i-1)
            const previousMeasurePixel = state.pixels.measures[i-1]
            subtractPixelsForCurrentPage = previousMeasurePixel
        }
    })
    console.log('Returning new pages:', newPages)
    return newPages
}

function changeScale(newState: model.ScoreState, action: model.ScoreAction): model.ScoreState {
    if (!newState.pixels) {
        return newState
    }
    if (!newState.scoreData) {
        return newState
    }
    const newHeight = newState.pixels.baseHeight + (action.data.units * HEIGHT_INCR)
    console.log('changeScale. newHeight:', newHeight)
    newState.pixels = calcPixels(newState.scoreData, newHeight)
    newState.pages = calcPages(newState)
    return newState
}

function getScoreStyle(state: model.ScoreState): model.StyleBounds {
    // This style effectively shifts the entire score to keep the current
    // underlight on screen as much as possible.
    const s = {
        top: 0 + 'px',
        left: 0 + 'px',
        width: state.pixels?.baseWidth + 'px',
        height: state.pixels?.baseHeight + 'px',
        opacity: 1.0,
    }

    if (!state.pixels) {
        return s
    }

    // Find which page we're supposed to be on:
    let currentPage = 0;
    state.pages.pages.forEach((v,idx) => {
        if (state.selection.xIndex >= v) {
            currentPage = idx;
        }
    })
    const leftMeasureIndex = state.pages.pages[currentPage]
    const leftMeasurePixels = state.pixels.measures[leftMeasureIndex]
    // Right by padding_left, then left by the measure's pixel location on the entire sheet.
    s.left = (PADDING_LEFT + (-1 * leftMeasurePixels)) + 'px'
    return s
}


function getUnderlightStyle(state: model.ScoreState): model.StyleBounds {
    // The underlight's position is based on the score being a large single
    // canvas. Then a wrapper "score" div containing both the music and this
    // underlight are shifted together to keep the underlight on the screen.
    const underlightBounds = {
        top: '0px',
        left: '0px',
        width: '1px',
        height: '1px',
        opacity: 1.0,
    }
    if (state.pixels) {
        if (state.pixels.staves.length == 0) {
            return underlightBounds;
        }
        // Top/Height
        if (state.selection.modeY === 'all') {
            console.log('all staves mode')
            underlightBounds.top = state.pixels.staves[0].top + 'px';
            underlightBounds.height = (state.pixels.staves[state.pixels.staves.length-1].bottom - state.pixels.staves[0].top) + 'px';
        } else if (state.selection.modeY === 'staff') {
            console.log('staff mode. yIndex:', state.selection.yIndex)
            underlightBounds.top = state.pixels.staves[state.selection.yIndex].top + 'px';
            underlightBounds.height = (state.pixels.staves[state.selection.yIndex + state.selection.yUnits].bottom - state.pixels.staves[state.selection.yIndex].top) + 'px';
        }
        // Left/Width
        if (state.selection.modeX === 'measure') {
            underlightBounds.left = state.pixels.measures[state.selection.xIndex] + 'px';
            underlightBounds.width = (state.pixels.measures[
                state.selection.xIndex + state.selection.xUnits
            ] - state.pixels.measures[state.selection.xIndex]) + 'px';
        }
    }
    return underlightBounds;
}

function moveSelectionX(newState: model.ScoreState, action: model.ScoreAction): model.ScoreState {
    let newStart = newState.selection.xIndex
    const u = action.data.units
    newStart = newState.selection.xIndex + u
    if (newStart < 0) {
        newStart = 0
    }
    if (newState.pixels && newStart > newState.pixels.measures.length-2) {
        newStart = newState.pixels.measures.length-2
    }
    newState.selection.xIndex = newStart
    return newState
}

function extendSelectionX(newState: model.ScoreState, action: model.ScoreAction): model.ScoreState {
    let newXUnits = newState.selection.xUnits
    const u = action.data.units
    newXUnits = newXUnits + u
    if (newXUnits < 1) {
        newXUnits = 1
    }
    // Ensure the extension doesn't go beyond remaining measures
    if (newState.pixels) {
        const remainingMeasures = newState.pixels.measures[length] - newState.selection.xIndex;
        if (newXUnits > remainingMeasures) {
            newXUnits = remainingMeasures
        }
    }
    newState.selection.xUnits = newXUnits
    return newState
}

function allStaves(newState: model.ScoreState, action: model.ScoreAction): model.ScoreState {
    newState.selection.modeY = 'all'
    return newState
}

function moveSelectionY(newState: model.ScoreState, action: model.ScoreAction): model.ScoreState {
    newState.selection.modeY = 'staff'
    let newStart = newState.selection.yIndex
    const u = action.data.units
    newStart = newStart + u
    if (newStart < 0) {
        newStart = 0
    }
    if (newState.pixels && newStart > newState.pixels.staves.length-1) {
        newStart = newState.pixels.staves.length-1
    }

    newState.selection.yIndex = newStart
    return newState
}

function moveToStart(newState: model.ScoreState, action: model.ScoreAction): model.ScoreState {
    newState.selection.xIndex = 0
    return newState
}
function moveToEnd(newState: model.ScoreState, action: model.ScoreAction): model.ScoreState {
    if (!newState.pixels) {
        return newState
    }
    newState.selection.xIndex = newState.pixels.measures.length-2
    return newState
}


export {
    prepLoadedMusic,
    getUnderlightStyle,
    moveSelectionX,
    extendSelectionX,
    allStaves,
    moveSelectionY,
    moveToStart,
    moveToEnd,
    changeScale,
    getScoreStyle,
}
