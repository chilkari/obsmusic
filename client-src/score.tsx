import React, { useReducer, useEffect } from 'react';

import * as model from './model';
import * as scorelogic from './scorelogic';

function reducer(state: model.ScoreState, action: model.ScoreAction):model.ScoreState {
	const newState = JSON.parse(JSON.stringify(state))
	console.log('reducer entry. action:', action)
	switch (action.type) {
		case 'prepLoadedMusic':
			return scorelogic.prepLoadedMusic(newState, action)
		/*
		case 'moveSelection':
			return scorelogic.moveSelection(newState, action)
		case 'extendSelection':
			return scorelogic.extendSelection(newState, action)
		case 'moveToStart':
			return scorelogic.moveToStart(newState)
		case 'moveToEnd':
			return scorelogic.moveToEnd(newState)
		case 'setOffset':
			return scorelogic.setOffset(newState)
		case 'toggleUnderlight':
			newState.runtime.underlightVisible = !newState.runtime.underlightVisible
			return newState
		case 'changeScale':
			// FIXME - debounce
			return scorelogic.changeScale(newState, action)
			*/
		default:
			throw new Error();
  }
}

const initialState: model.ScoreState = {
    image: undefined,
    scoreData: undefined,
    pixels: undefined,
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

    /*
    const s = {
        margin: '0px',
        padding: '0px',
        width: '1920px',
        height: '550px',
    }
    */



    function handleKeydown(e:Event) {
        console.log('keydown:', e)
		/*
        if (e.code == 'KeyL') {
            if (e.shiftKey) {
                dispatch({
                    type: 'extendSelection',
                    units: 1,
                })
            } else {
                dispatch({
                    type: 'moveSelection',
                    units: 1,
                })
            }
        }
        if (e.code == 'KeyH') {
            if (e.shiftKey) {
                dispatch({
                    type: 'extendSelection',
                    units: -1,
                })
            } else {
                dispatch({
                    type: 'moveSelection',
                    units: -1,
                })
            }
        }
        if (e.code == 'Period') {
            dispatch({
                type: 'setOffset',
            })
        }
        if (e.code == 'Space') {
            dispatch({
                type: 'toggleUnderlight',
            })
        }
        if (e.code == 'Equal') {
            dispatch({
                type: 'changeScale',
                units: 1,
            })
        }
        if (e.code == 'Minus') {
            dispatch({
                type: 'changeScale',
                units: -1,
            })
        }
        if (e.code == 'Digit0') {
            dispatch({
                type: 'moveToStart',
            })
        }
        if (e.code == 'Digit4' && e.shiftKey) {
            dispatch({
                type: 'moveToEnd',
            })
        }
		*/
    }

    function loadScoreData(filename: string) {
        const cb = Math.random()*1000
        const url = `music/${filename}/${filename}.json?cb=${cb}`
        fetch(url).then(
            res => res.json()).then(
                result => {
                    setTimeout(() => {
                        dispatch({
                            type: 'prepLoadedMusic',
                            filename: filename,
                            scoreData: result,
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

    console.log(`Setting music width to ${state.pixels?.baseWidth}`)
    console.log(`Setting music height to ${state.pixels?.baseHeight}`)
    const s = {
        top: 0 + 'px',
        left: 0 + 'px',
        width: state.pixels?.baseWidth + 'px',
        height: state.pixels?.baseHeight + 'px',
    }
    return (
		<div id="score" style={s}>
            <Music state={state} />
            <Underlight state={state} />
        </div>
    );
}

export default Score