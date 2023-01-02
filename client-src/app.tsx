import React, {useState, useRef, useEffect} from 'react'
import * as ReactDOM from 'react-dom/client'
import Score from './score'

function OBSMusicControl() {
    return (
		<Score />
    )
}

const obsMusicControl = <OBSMusicControl />
const app = ReactDOM.createRoot(document.getElementById('app') as Element);
app.render(obsMusicControl);
