import html, { Component, render } from './preact/index.js';
import { createRef } from './preact/preact.js';

import Shell from "./Shell.js";
import { CustomizationPanel } from "./Components.js";


const canvasCoordsToWebGL = (x, y) => {
    return [
        x,
        canvas.height - y,
    ]
}

class FireworkСreator {
    static randChoice = (value, chance, otherwise) => {
        return Math.random() < chance ? value : otherwise;
    }

    static randInt = (max, min=0) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    constructor() {
        /** @type {import('./Shell.js').ShellParams} */
        this.shellParams = {};

        /** @type {import('./Shell.js').ShellParams | import('./Shell.js').NestedShellNewParams} */
        this.currentShellParams = this.shellParams;
        this.subParamsCount = 0;
    }

    subParams = () => {
        this.subParamsCount++;

        this.currentShellParams.nestedExplosionParams = {}

        this.currentShellParams = this.currentShellParams.nestedExplosionParams;
    }

    setParams = (params) => {
        Object.assign(this.currentShellParams, params);
    }

    getParams = () => {
        this.currentShellParams = this.shellParams;

        return this.shellParams;
    }

    clearParams = () => {
        this.shellParams = {};
        this.currentShellParams = this.shellParams;
    }

    addCustomFirework = (x, y) => {
        if (x === undefined) {
            x = canvas.width / 2;
            y = canvas.height / 2;
        }
    
        const shellColor = {
            r: Math.random(),
            g: Math.random(),
            b: Math.random(),
            a: 1,
        }
    
        Shell.fireworks.push(
            new Shell({
                x, 
                y,
            }, 
                shellColor,
                this.shellParams
            )
        );
    }

    addRandomFirework = (x, y) => {
        const traceDisappearanceRule = FireworkСreator.randInt(1);
        let traceDisappearanceCoef = 1;
    
        if (traceDisappearanceRule === 0) {
            traceDisappearanceCoef = 0.04;
        }
    
        const initialHeadsQuantity = 40 + FireworkСreator.randInt(100);
    
        const firstShellColor = {
            r: Math.random(),
            g: Math.random(),
            b: Math.random(),
            a: 1,
        }

        const topSpaceLeft = canvas.height - y ;
    
        const vy = 10 + Math.random() * 30;
        const vx = 4 - 8 * Math.random();
        const explodeAfterFrames = topSpaceLeft / vy;
    
    
        const firstShellParams = {
            vReduction: 1.01 + Math.random() * 0.05,
            aReduction: 1.01 + Math.random() * 0.01,
            heads: [{
                x,
                y,
                vx,
                vy,
                avx: 0,
                avy: -0.2,
                ...firstShellColor,
            }],
            traceLengthFrames: 40,
            traceDisappearanceActivateAfterFrames: 10,
            traceDisappearanceRule: 1,
            traceDisappearanceCoef: 0.005,
            traceDisappearanceEachFrame: 40,
    
            headDisappearanceActivateAfterFrames: explodeAfterFrames,
            headDisappearanceRule: 1,
            headDisappearanceCoef: 1,
            headDisappearanceEachFrame: 1,
        }
        // #1
        this.setParams(firstShellParams);

        this.subParams();

        // #2
        this.setParams({
            skipFramesBeforeExplosion: explodeAfterFrames,
            eachFrameExplosion: 1,
            explosionRule: FireworkСreator.randInt(1),

            heads: initialHeadsQuantity,
            vMax: 4 + Math.random() * 10,
            vReduction: 1.05 + Math.random() * 0.05,
            aReduction: 1.01 + Math.random() * 0.01,
            rotateAng: Math.atan(-vx / vy),
    
            generateHeadsRule: FireworkСreator.randInt(9),
    
            traceLengthFrames: 10 + FireworkСreator.randInt(120),
            traceDisappearanceActivateAfterFrames: 40 + FireworkСreator.randInt(20),
            traceDisappearanceRule,
            traceDisappearanceCoef,
            traceDisappearanceEachFrame: 40,
    
            headDisappearanceActivateAfterFrames: 100,
            headDisappearanceRule: FireworkСreator.randInt(1),
            headDisappearanceCoef: 1,
            headDisappearanceEachFrame: 1,
        });

        // #3
        if (Math.random() < 0.8) {
            this.subParams();

            this.setParams(
                {
                    skipFramesBeforeExplosion: 40 + FireworkСreator.randInt(10),
                    eachFrameExplosion: FireworkСreator.randChoice(1, 0.8, Math.floor(initialHeadsQuantity / 4)),
                    explosionRule: FireworkСreator.randInt(1),
        
                    generateHeadsRule: 0,
        
                    traceDisappearanceActivateAfterFrames: 20,
                    traceLengthFrames: 10,
                    traceDisappearanceRule: FireworkСreator.randInt(1),
                    traceDisappearanceCoef: 1,
                    traceDisappearanceEachFrame: 1,
        
                    headDisappearanceActivateAfterFrames: 100,
                    headDisappearanceRule: FireworkСreator.randInt(1),
                    headDisappearanceCoef: 0.1,
                    headDisappearanceEachFrame: 1,
        
                    heads: FireworkСreator.randInt(10, 3),
                    vMax: 6*Math.random() + 0.3 ,
                    aReduction: 1.01,
                    vReduction: 1.1,
                }
            );
        }

        Shell.fireworks.push(
            new Shell({
                x, 
                y,
            }, 
                firstShellColor,
                this.getParams()
            )
        );

        this.clearParams();
    }
}

const fc = new FireworkСreator();

const createProgram = (gl, variables) => {
    function createShader(gl, type, source) {
        const shader = gl.createShader(type); // создание шейдера

        gl.shaderSource(shader, source);      // устанавливаем шейдеру его программный код
        gl.compileShader(shader); 
        // компилируем шейдер

        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {                        // если компиляция прошла успешно - возвращаем шейдер
            return shader;
        }
        
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    function createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        gl.linkProgram(program);

        const success = gl.getProgramParameter(program, gl.LINK_STATUS);

        if (success) {
            return program;
        }

        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
        
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, 
        `
            precision mediump float;

            // атрибут, который будет получать данные из !!буфера
            attribute vec2 ${variables.position};
            attribute vec4 ${variables.color};

            uniform vec2 ${variables.canvasSize};

            varying vec4 v_color;

            vec2 posToClipSpace(vec2 position) {
                return (position / ${variables.canvasSize}) * 2.0 - 1.0;
            }
            
            // все шейдеры имеют функцию main
            void main() {
                v_color = ${variables.color};

                vec2 clipPosition = posToClipSpace(${variables.position});
                gl_PointSize = 2.0;
                // gl_Position - специальная переменная вершинного шейдера,
                // которая отвечает за установку положения
                gl_Position = vec4(clipPosition, 0, 1);
            }
        `
    );

    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, 
    `
        precision mediump float;

        varying vec4 v_color;

        void main() {
            // gl_FragColor - spec variable for fragment shader
            gl_FragColor = v_color;
        }
    `
    );

    const program = createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    return program;
}

const createBuffers = (gl, variables, program) => {
    const locations = {
        // offset: gl.getUniformLocation(program, variables.shapeLocation),
        position: gl.getAttribLocation(program, variables.position),
        color: gl.getAttribLocation(program, variables.color),
        canvasSize: gl.getUniformLocation(program, variables.canvasSize),
    };

    // global variables
    gl.uniform2f(locations.canvasSize, canvas.width, canvas.height);

    // Link position buffer to attribute
    const positionBuffer = gl.createBuffer();
    const colorsBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // передаём в буфер вершины
    // gl.bufferData(gl.ARRAY_BUFFER, circles.vertices, gl.STATIC_DRAW);


    /*  
        // Указываем атрибуту, как получать данные от positionBuffer (ARRAY_BUFFER)
        const size = 2;          // 2 компоненты на итерацию
        const type = gl.FLOAT;   // наши данные - 32-битные числа с плавающей точкой
        const normalize = false; 
        const stride = 0;        // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
        const offset = 0;        // начинать с начала буфера
        gl.vertexAttribPointer(
            // index: which attr to use  
            locations.position, 
            // size: how many components in that attr 
            size, 
            // type: what is the type stored in the GPU buffer for this attr 
            type, 
            // normalize: determines how to convert ints to float (convert from 0-255 to 0-1) 
            normalize, 
            // stride: how many bytes to move forward to get the same attr for the next vertex 
            2 * Float32Array.BYTES_PER_ELEMENT, // if 0 = size * sizeof(type)
            // offset: how many bytes skip when reading attrs 
            offset
        );
    */

    //  buffer -> attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(locations.position);
    gl.vertexAttribPointer(
        locations.position, 
        2, 
        gl.FLOAT, 
        false, 
        2 * Float32Array.BYTES_PER_ELEMENT, 
        0
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer)
    gl.enableVertexAttribArray(locations.color)
    gl.vertexAttribPointer(
        locations.color, 
        4, 
        gl.FLOAT, 
        false, 
        4 * Float32Array.BYTES_PER_ELEMENT, 
        0
    )

    return {
        positionBuffer,
        colorsBuffer,
    }
}

const beforeDraw = (gl) => {
    gl.clearColor(5 / 255, 25 / 255, 55 / 255, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
}



class App extends Component {
    state = { customizationModeOn: false, autoRandomFirework: true };
    maxSliderValues =   [100, 10, 2, 2, 360, 100, 200, 1, 10, 10, 1, 10];
    outputSliderValues = [50, 5, 1, 1, 0, 50, 100, 0.5, 5, 5, 0.5, 5];
    selectValues = [0, 0, 0]

    sliderValues = this.outputSliderValues.map((value, index) => {
        return value * 100 / this.maxSliderValues[index];
    });
    
    componentDidUpdate() {
    }

    toggleCustomizationMode() {
        this.setState({ 
            ...this.state,
            customizationModeOn: !this.state.customizationModeOn,
        });
    }

    onCanvasClick(x, y) {
        if (this.state.autoRandomFirework) {
            fc.addRandomFirework(x, y);
            return;
        }

        this.makeCustomFirework(x, y);
    }

    showCustomFirework() {
        Shell.fireworks.length = 0;

        this.makeCustomFirework();
    }

    makeCustomFirework(x, y) {
        let shellParams = fc.getParams();


        const sliderKeys = [
            'heads',
            'vMax',
            'vReduction',
            'aReduction',
            'rotateAng',

            'traceLengthFrames',
            'traceDisappearanceActivateAfterFrames',
            'traceDisappearanceCoef',
            'traceDisappearanceEachFrame',

            'headDisappearanceActivateAfterFrames',
            'headDisappearanceCoef',
            'headDisappearanceEachFrame',
        ];

        const selectKeys = [
            'generateHeadsRule',
            'traceDisappearanceRule',
            'headDisappearanceRule',
        ]

        for (let i = 0; i < selectKeys.length; i++) {
            shellParams[selectKeys[i]] = this.selectValues[i];
        }

        for (let i = 0; i < sliderKeys.length; i++) {
            let value = this.outputSliderValues[i];

            if (i === 4) {
                value = value * Math.PI / 180;
            }

            shellParams[
                sliderKeys[i]
            ] = value;
        }

        if (Object.keys(shellParams).length === 0) {
            fc.setParams(shellParams);
        }


        fc.addCustomFirework(x, y);
    }

    getCustimizationPanel() {
        if (this.state.customizationModeOn) {
            return CustomizationPanel({
                onSelectChange: (i, e) => {
                    this.selectValues[i] = +e.target.value;
                    this.setState({
                        ...this.state
                    });
                    this.showCustomFirework();
                },
                onSliderChange: (i, e) => {
                    this.sliderValues[i] = +e.target.value;
                    this.outputSliderValues[i] = this.sliderValues[i] * this.maxSliderValues[i] / 100;

                    this.setState({
                        ...this.state
                    });

                    this.showCustomFirework();
                },
                onInputChange: (i, e) => {
                    this.maxSliderValues[i] = +e.target.value;
                    this.outputSliderValues[i] = this.sliderValues[i] * this.maxSliderValues[i] / 100;

                    this.setState({
                        ...this.state
                    });

                    this.showCustomFirework();
                },
                maxSliderValues: this.maxSliderValues,
                sliderValues: this.sliderValues,
                outputSliderValues: this.outputSliderValues,
                selectValues: this.selectValues,
                autoRandomFirework: this.state.autoRandomFirework,
                onCloseClick: () => {
                    this.toggleCustomizationMode();
                },
                onRandomizeClick: () => {
                    this.setState({
                        ...this.state,
                        autoRandomFirework: !this.state.autoRandomFirework,
                    })
                }
            });
        }
    }

    componentDidMount() {
        /** @type {HTMLCanvasElement} */
        const canvas = document.getElementById('canvas');
        canvas.width = window.innerWidth*0.9;
        canvas.height = window.innerHeight*0.8;

        const gl = canvas.getContext('webgl');

        if (!gl) {
            alert('webgl not supported');
        }

        const variables = {
            position: 'a_position',
            color: 'a_color',
            canvasSize: 'canvasSize',
        }

        const program = createProgram(gl, variables);


        const { positionBuffer, colorsBuffer } = createBuffers(gl, variables, program);



        beforeDraw(gl);

        let prevTime = 0;

        const frame = (time) => {
            if (Math.trunc(time) % 4 === 0) {
                fps.innerText = (1000 / (time - prevTime)).toFixed(1);
            }

            let numOfHeads = 0;
            let numOfTraces = 0;

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.clearColor(5 / 255, 25 / 255, 55 / 255, 1);
            // gl.clearColor(1, 1, 1, 1);

            for (let i = 0; i < Shell.fireworks.length; i++) {
                const shell = Shell.fireworks[i];
                if (shell === null) {
                    continue;
                }

                const { heads, traces } = shell;

                numOfHeads += heads.quantity;
                numOfTraces += traces.quantity;

                shell.frame();

                // traces data to GPU
                gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, traces.colors, gl.STREAM_DRAW);

                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
                gl.bufferData(gl.ARRAY_BUFFER, traces.vertices, gl.STREAM_DRAW);
                
                gl.drawArrays(gl.POINTS, 0, traces.quantity);

                // heads data to GPU
                gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, heads.colors, gl.STREAM_DRAW);

                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
                gl.bufferData(gl.ARRAY_BUFFER, heads.vertices, gl.STREAM_DRAW);
                
                gl.drawArrays(gl.POINTS, 0, heads.quantity);
            }

            for (let i = 0; i < Shell.fireworks.length; i++) {
                if (Shell.fireworks[i] === null) {
                    Shell.fireworks.splice(i, 1);
                }
            }
            

            shellsCount.innerText = `${Shell.fireworks.length}`; 
            headsCount.innerText = `${numOfHeads}`;
            tracesCount.innerText = `${numOfTraces}`;

            prevTime = time
            requestAnimationFrame(frame);
        }

        frame()

        canvas.onclick = (e) => {
            const [x, y] = canvasCoordsToWebGL(e.offsetX, e.offsetY);
            this.onCanvasClick(x, y);
        }

    }
    
    render() {
        return html`
            <div class="container">
                <div style="position: relative">
                    <canvas id="canvas" style="border: solid"> </canvas>
                    ${this.getCustimizationPanel()}
                </div>
                <div class="info">
                    <span>
                        FPS: <span id="fps"></span>
                    </span>
                    <span>
                        Shells: <span id="shellsCount"></span>
                    </span>
                    <span>
                        Heads: <span id="headsCount"></span>
                    </span>
                    <span>
                        Traces: <span id="tracesCount"></span>
                    </span>
                </div>

                <div class="controls">
                    <button onclick=${() => {
                        this.setState({
                            ...this.state,
                            autoRandomFirework: false,
                            customizationModeOn: true,
                        })
                    }}>Customize Firework</button>
                </div>
            </div>  
        `
    }
}

render(html`<${App} />`, document.getElementById('root'));