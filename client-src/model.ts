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
    filename: string;
    scoreData: ScoreMetrics;
    type: string;
}

interface ScoreState {
    image: string | undefined;
    scoreData: ScoreMetrics | undefined; // Original float (0-1) values from json
    pixels: ScoreMetrics | undefined; // Calculated pixel values given a certain zoom
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
    ScoreAction,
    ScoreState,
    StyleBounds,
    MusicProps,
    UnderlightProps,
}
