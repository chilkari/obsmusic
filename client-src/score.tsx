import React, { useReducer, useEffect } from 'react';

import * as model from './model';
import * as scorelogic from './scorelogic';

function reducer(state: model.ScoreState, action: model.ScoreAction):model.ScoreState {
	const newState = JSON.parse(JSON.stringify(state))
	// console.log('reducer entry. action:', action)
	switch (action.type) {
		case 'prepLoadedMusic':
			return scorelogic.prepLoadedMusic(newState, action)
		case 'moveSelectionX':
			return scorelogic.moveSelectionX(newState, action)
		case 'extendSelectionX':
			return scorelogic.extendSelectionX(newState, action)
		case 'allStaves':
			return scorelogic.allStaves(newState, action)
        case 'moveSelectionY':
            return scorelogic.moveSelectionY(newState, action)
        case 'moveToStart':
            return scorelogic.moveToStart(newState, action)
        case 'moveToEnd':
            return scorelogic.moveToEnd(newState, action)
		case 'toggleCurrentMeasureAnchor':
			return scorelogic.toggleCurrentMeasureAnchor(newState)
        case 'toggleUnderlight':
            return scorelogic.toggleUnderlight(newState, action)
        // extendSelectionY makes sense for scores with > 2 staves.
        // Not needed for piano scores at the moment.
		case 'changeScale':
			return scorelogic.changeScale(newState, action)
		default:
			throw new Error();
  }
}

const initialState: model.ScoreState = {
    image: undefined,
    underlightVisible: true,
    scoreData: undefined,
    pixels: undefined,
    selection: {
        modeX: "measure",
        modeY: "all",
        xIndex: 0, // 0-based index to selected item
        yIndex: 0, //
        xUnits: 1, // number of selected units x-wise
        yUnits: 0, // TODO - consider. Set to 0 as this is _added_ for staff index from current...
        anchoredMeasureIndex: null
    },
    pages: {
        activePageIndex: 0,
        pages: [0],
    }
}


function Music(props: model.MusicProps) {
    if (props.state.scoreData === null) {
        return <p>Loading...</p>
    } else {
        const s = {
            top: 0 + 'px',
            left: 0 + 'px',
            width: props.state.pixels?.baseWidth + 'px',
            height: props.state.pixels?.baseHeight + 'px',
        }
        return (
            <img id="music" style={s} src={props.state.image} />
        )
    }
}

function Underlight(props: model.UnderlightProps) {
    if (props.state.scoreData === null) {
        return null
    } else {
        const s = scorelogic.getUnderlightStyle(props.state)
        return (
            <div id="underlight" style={s} />
        )
    }

}

function Score() {

    const [state, dispatch] = useReducer(reducer, initialState);

    function handleKeydown(e:KeyboardEvent) {
        console.log('keydown:', e)
        if (e.code == 'KeyL') {
            if (e.shiftKey) {
                dispatch({
                    type: 'extendSelectionX',
                    data: {
                        units: 1,
                    },
                })
            } else {
                dispatch({
                    type: 'moveSelectionX',
                    data: {
                        units: 1,
                    },
                })
            }
        }
        if (e.code == 'KeyH') {
            if (e.shiftKey) {
                dispatch({
                    type: 'extendSelectionX',
                    data: {
                        units: -1,
                    },
                })
            } else {
                dispatch({
                    type: 'moveSelectionX',
                    data: {
                        units: -1,
                    },
                })
            }
        }
        // A == "all staves mode vs a single staff"
        if (e.code == 'KeyA') {
            dispatch({
                type: 'allStaves',
                data: {
                    units: 1,
                },
            })
        }
        if (e.code == 'KeyJ') {
            dispatch({
                type: 'moveSelectionY',
                data: {
                    units: 1,
                },
            })
        }
        if (e.code == 'KeyK') {
            dispatch({
                type: 'moveSelectionY',
                data: {
                    units: -1,
                },
            })
        }
        if (e.code == 'Equal') {
            dispatch({
                type: 'changeScale',
                data: {
                    units: 1,
                },
            })
        }
        if (e.code == 'Minus') {
            dispatch({
                type: 'changeScale',
                data: {
                    units: -1,
                },
            })
        }
        if (e.code == 'Digit0') {
            dispatch({
                type: 'moveToStart',
                data: {},
            })
        }
        if (e.code == 'Digit4' && e.shiftKey) {
            dispatch({
                type: 'moveToEnd',
                data: {},
            })
        }
        if (e.code == 'Space') {
            dispatch({
                type: 'toggleUnderlight',
                data: {},
            })
        }
        if (e.code == 'Period') {
            dispatch({
                type: 'toggleCurrentMeasureAnchor',
                data: {},
            })
        }
    }

    function loadScoreData(filename: string) {
        // TODO - consider removing this cachebuster once stable score data.
        const cb = Math.random()*1000
        const url = `music/${filename}/${filename}.json?cb=${cb}`
        fetch(url).then(
            res => res.json()).then(
                result => {
                    setTimeout(() => {
                        dispatch({
                            type: 'prepLoadedMusic',
                            data: {
                                filename: filename,
                                scoreData: result,
                            }
                        })
                    }, 1000
                    )
                }).catch(console.log);
    }

    useEffect(() => {
        const filename = 'doubledozen'
        loadScoreData(filename)
        document.addEventListener('keydown', handleKeydown);
        return () => {
            document.removeEventListener('keydown', handleKeydown);
        }
    }, [])

    const s = scorelogic.getScoreStyle(state)
    return (
		<div id="score" style={s}>
            <Music state={state} />
            <Underlight state={state} />
        </div>
    );
}

export default Score