import Module from "module";

import * as model from './model';

const DEFAULT_HEIGHT = 550
const HEIGHT_INCR = 100 // pixels to increase/decrease baseHeight to change scale
const PADDING_LEFT = 85 // Basic left padding for measures
const PADDING_TOP = 85 // Basic top padding for staves

/*
interface StaffMetric {
    name: string;
    top: number;
    bottom: number;
}

interface ScoreMetrics {
    baseWidth: number;
    baseHeight: number;
    scale: number;
    measures: number[];
    staves: StaffMetric[];
}

interface ScoreAction {
    filename: string; scoreData: ScoreMetrics;
}

interface ScoreState {
    image: string;
    scoreData: ScoreMetrics; // Original float (0-1) values from json
    pixels: ScoreMetrics; // Calculated pixel values given a certain zoom
}
*/

function prepLoadedMusic(newState: model.ScoreState, action: model.ScoreAction): model.ScoreState {
	console.log('prepLoadedMusic entry')
    newState.image = `music/${action.filename}/${action.filename}.svg`, newState.scoreData = action.scoreData
    newState.pixels = calcPixels(action.scoreData, DEFAULT_HEIGHT)
	console.log('newState:', newState)
	/*
    newState.runtime.selection = calcSelectionBounds(
        newState.runtime.px,
        newState.runtime.selection.start,
        newState.runtime.selection.end,
        )
	*/
    // newState.runtime.viewport = calcViewport(newState.runtime)
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

function getUnderlightStyle(state: model.ScoreState): model.StyleBounds {
    return {
        top: '0px',
        left: '0px',
        width: '100px',
        height: '100px',
        opacity: 1.0,
    }
}



export {
    prepLoadedMusic,
    getUnderlightStyle,
}
