import html, { Component, render } from './preact/index.js';


export function CustomizationPanel({
    onSelectChange,
    onInputChange,
    onSliderChange,
    maxSliderValues,
    sliderValues,
    outputSliderValues,
    onCloseClick,
    selectValues,
    onRandomizeClick,
    autoRandomFirework,
}) { 
    const style = {
        panel: {
            position: 'absolute',
            top: '10px',
            left: '10px',
            height: '100%',
            zIndex: '100',
        },
        contentContainer: {
            display: 'flex',
            flexDirection: 'column',
        },
        content: {
            opacity: autoRandomFirework ? '0.5' : '1',
            pointerEvents: autoRandomFirework ? 'none' : 'all',
        },
    }

    const handleSliderChange = index => (e) => {
        onSliderChange(index, e);
    }

    const handleSelectorChange = index => (e) => {
        onSelectChange(index, e);
    }

    const handleInputChange = index => (e) => {
        onInputChange(index, e);
    }


    return html`
        <div class="customization-panel" style=${style.panel}>
            <div style=${style.contentContainer}>
                <div class="customization-panel-content" style=${style.content}>
                    <div>
                        <input onchange=${handleSliderChange(0)} type="range" min="0" max="100" value=${sliderValues[0]} class="slider" id="heads"></input>
                            *
                        <input type="number" min="-1000" max="1000" onchange=${handleInputChange(0)} value=${maxSliderValues[0]}></input>
                            = 
                        <span>${outputSliderValues[0]}</span>
                        <label for="myRange"> - Number of heads</label>
                    </div>
                    <div>
                        <input onchange=${handleSliderChange(1)} type="range" min="0" max="100" value=${sliderValues[1]} class="slider" id="vMax"></input>
                            *
                        <input type="number" min="-1000" max="1000" onchange=${handleInputChange(1)} value=${maxSliderValues[1]}></input>
                            =
                        <span>${outputSliderValues[1]}</span>
                        <label for="vMax"> - Max Velocity</label>
                    </div>
                    <div>
                        <input onchange=${handleSliderChange(2)} type="range" min="0" max="100" value=${sliderValues[2]} class="slider" id="vReduction"></input>
                            *
                        <input type="number" min="-1000" max="1000" onchange=${handleInputChange(2)} value=${maxSliderValues[2]}></input>
                            =
                        <span>${outputSliderValues[2]}</span>
                        <label for="vReduction"> - Velocity Reduction</label>
                    </div>
                    <div>
                        <input onchange=${handleSliderChange(3)} type="range" min="0" max="100" value=${sliderValues[3]} class="slider" id="aReduction"></input>
                            *
                        <input type="number" min="-1000" max="1000" onchange=${handleInputChange(3)} value=${maxSliderValues[3]}></input>
                            =
                        <span>${outputSliderValues[3]}</span>
                        <label for="aReduction"> - Acceleration Reduction</label>
                    </div>
                    <div>
                        <input onchange=${handleSliderChange(4)} type="range" min="0" max="100" value=${sliderValues[4]} class="slider" id="rotateAng"></input>
                            *
                        <input type="number" min="-1000" max="1000" onchange=${handleInputChange(4)} value=${maxSliderValues[4]}></input>
                            =
                        <span>${outputSliderValues[4]}</span>
                        <label for="rotateAng"> - Rotate Angle</label>
                    </div>
                    <div>
                        <select onchange=${handleSelectorChange(0)} id="generateHeadsRule" defaultValue=${selectValues[0]}>
                            <option value="0">cirlce</option>
                            <option value="1">heart</option>
                            <option value="2">flower</option>
                            <option value="3">spiral</option>
                            <option value="4">hypotrochoid</option>
                            <option value="5">buterfly</option>
                            <option value="6">cloverleaf</option>
                            <option value="7">helix</option>
                            <option value="8">ripple</option>
                            <option value="9">mobius</option>
                        </select>
                        <label for="generateHeadsRule">Generate Heads Rule</label>
                    </div>
                    <fieldset>
                        <legend>Trace</legend>
                        <div>
                            <input onchange=${handleSliderChange(5)} type="range" min="0" max="100" value=${sliderValues[5]} class="slider" id="traceLengthFrames"></input>
                                *
                            <input type="number" min="-1000" max="1000" onchange=${handleInputChange(5)} value=${maxSliderValues[5]}></input>
                                =
                            <span>${outputSliderValues[5]}</span>
                            <label for="traceLengthFrames"> - Length In Frames</label>
                        </div>
                        <div>
                            <input onchange=${handleSliderChange(6)} type="range" min="0" max="100" value=${sliderValues[6]} class="slider" id="traceDisappearanceActivateAfterFrames"></input>
                                *
                            <input type="number" min="-1000" max="1000" onchange=${handleInputChange(6)} value=${maxSliderValues[6]}></input>
                                =
                            <span>${outputSliderValues[6]}</span>
                            <label for="traceDisappearanceActivateAfterFrames"> - Disappearance Activate After Frames</label>
                        </div>
                        <div>
                            <select onchange=${handleSelectorChange(1)} id="traceDisappearanceRule" defaultValue=${selectValues[1]}>
                                <option value="0">random</option>
                                <option value="1">from tail to head</option>
                            </select>
                            <label for="traceDisappearanceRule"> - Disappearance Rule</label>
                        </div>
                        <div>
                            <input onchange=${handleSliderChange(7)} type="range" min="0" max="100" value=${sliderValues[7]} class="slider" id="traceDisappearanceCoef"></input>
                                *
                            <input disabled type="number" min="-1000" max="1000" onchange=${handleInputChange(7)} value=${maxSliderValues[7]}></input>
                                =
                            <span>${outputSliderValues[7]}</span>
                            <label for="traceDisappearanceCoef"> - Disappearance Coef</label>
                        </div>
                        <div>
                            <input onchange=${handleSliderChange(8)} type="range" min="0" max="100" value=${sliderValues[8]} class="slider" id="traceDisappearanceEachFrame"></input>
                                *
                            <input type="number" min="-1000" max="1000" onchange=${handleInputChange(8)} value=${maxSliderValues[8]}></input>
                                =
                            <span>${outputSliderValues[8]}</span>
                            <label for="traceDisappearanceEachFrame"> - Disappearance Each Frame</label>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>Heads</legend>
                        <div>
                            <input onchange=${handleSliderChange(9)} type="range" min="0" max="100" value=${sliderValues[9]} class="slider" id="headDisappearanceActivateAfterFrames"></input>
                                *
                            <input type="number" min="-1000" max="1000" onchange=${handleInputChange(9)} value=${maxSliderValues[9]}></input>
                                =
                            <span>${outputSliderValues[9]}</span>
                            <label for="headDisappearanceActivateAfterFrames"> - Disappearance Activate After Frames</label>
                        </div>
                        <div>
                            <select onchange=${handleSelectorChange(2)} id="headDisappearanceRule" defaultValue=${selectValues[2]}>
                                <option value="0">random</option>
                                <option value="1">from tail to head</option>
                            </select>
                            <label for="headDisappearanceRule"> - Disappearance Rule</label>
                        </div>
                        <div>
                            <input onchange=${handleSliderChange(10)} type="range" min="0" max="100" value=${sliderValues[10]} class="slider" id="headDisappearanceCoef"></input>
                                *
                            <input type="number" min="-1000" max="1000" disabled onchange=${handleInputChange(10)} value=${maxSliderValues[10]}></input>
                                =
                            <span>${outputSliderValues[10]}</span>
                            <label for="headDisappearanceCoef"> - Disappearance Coef</label>
                        </div>
                        <div>
                            <input onchange=${handleSliderChange(11)} type="range" min="0" max="100" value=${sliderValues[11]} class="slider" id="headDisappearanceEachFrame"></input>
                                *
                            <input type="number" min="-1000" max="1000" onchange=${handleInputChange(11)} value=${maxSliderValues[11]}></input>
                                =
                            <span>${outputSliderValues[11]}</span>
                            <label for="headDisappearanceEachFrame"> - Disappearance Each Frame</label>
                        </div>
                    </fieldset> 
                    
                </div>

                <div>
                    <label for="randomize">Randomize (disable customization) </label>
                    <input type="checkbox" id="randomize" name="randomize" value="randomize" checked=${autoRandomFirework} onchange=${onRandomizeClick}></input>
                </div>
            </div>

            <button onclick=${onCloseClick}>x</button>
        </div>
    `
}