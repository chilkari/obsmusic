interface StaffMetric {
    name: string;
    top: number;
    bottom: number;
}

interface ScoreMetrics {
    baseWidth: number;
    baseHeight: number;
    viewportWidth: number;
    viewportHeight: number;
    scale: number;
    measures: number[];
    staves: StaffMetric[];
}

interface ScoreAction {
    type: string;
    data: any; // TODO - probably a better TS way of doing this
    /*
    filename: string | undefined;
    scoreData: ScoreMetrics | undefined;
    units: number | undefined;
    */
}

// Data around what is currently highlighted
interface ScoreSelection {
    modeX: "measure" | "beat" | "note",
    modeY: "all" | "staff",
    xIndex: number, // 0-based index to selected item
    yIndex: number, //
    xUnits: number, // number of selected units x-wise
    yUnits: number, // number of selected units y-wise
}

interface ScorePages {
    // Current page, as an index into the pages array
    activePageIndex: number,
    // list of pixels.measures[] indices representing the index into the
    // state.pixels.mesaures[] array representing the measure which should
    // be the left-most measure on each page.
    pages: number[],
}

interface ScoreState {
    image: string | undefined;
    scoreData: ScoreMetrics | undefined; // Original float (0-1) values from json
    pixels: ScoreMetrics | undefined; // Calculated pixel values given a certain zoom
    selection: ScoreSelection;
    pages: ScorePages;
}

interface StyleBounds {
    top: string;
    left: string;
    width: string;
    height: string;
    opacity: number;
}

interface MusicProps {
    state: ScoreState,
}

interface UnderlightProps {
    state: ScoreState,
}

export {
    StaffMetric,
    ScoreMetrics,
    ScorePages,
    ScoreAction,
    ScoreState,
    StyleBounds,
    MusicProps,
    UnderlightProps,
}
