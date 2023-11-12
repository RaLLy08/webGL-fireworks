/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth*0.9;
canvas.height = window.innerHeight*0.8;

const gl = canvas.getContext('webgl');

if (!gl) {
    alert('webgl not supported');
}

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

const variables = {
    position: 'a_position',
    color: 'a_color',
    canvasSize: 'canvasSize',
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
    // фрагментные шейдеры не имеют точности по умолчанию, поэтому нам необходимо её
    precision mediump float;

    varying vec4 v_color;

    void main() {
        // gl_FragColor - специальная переменная фрагментного шейдера.
        // Она отвечает за установку цвета.
        gl_FragColor = v_color;
    }
`
);

const program = createProgram(gl, vertexShader, fragmentShader);


gl.useProgram(program);


const locations = {
    // offset: gl.getUniformLocation(program, variables.shapeLocation),
    position: gl.getAttribLocation(program, variables.position),
    color: gl.getAttribLocation(program, variables.color),
    canvasSize: gl.getUniformLocation(program, variables.canvasSize),
};

// global variables
gl.uniform2f(locations.canvasSize, canvas.width, canvas.height);

// Привязываем буфер положений
const positionBuffer = gl.createBuffer();
const colorsBuffer = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// передаём в буфер вершины
// gl.bufferData(gl.ARRAY_BUFFER, circles.vertices, gl.STATIC_DRAW);


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



gl.clearColor(5 / 255, 25 / 255, 55 / 255, 1);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

gl.enable(gl.BLEND);
// gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

/**
 * @type {Array.<Shell>}
 */
const fireworks = [];




// let oldVertices = new Float32Array();
// let oldColors = new Float32Array();
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


    
    for (let i = 0; i < fireworks.length; i++) {
        const shell = fireworks[i];
        if (shell === null) {
            continue;
        }

        const { heads, traces } = shell;

        numOfHeads += heads.quantity;
        numOfTraces += traces.quantity;

        shell.frame();

                        
        gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, traces.colors, gl.STREAM_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, traces.vertices, gl.STREAM_DRAW);
        
        gl.drawArrays(gl.POINTS, 0, traces.quantity);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, heads.colors, gl.STREAM_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, heads.vertices, gl.STREAM_DRAW);
        
        gl.drawArrays(gl.POINTS, 0, heads.quantity);
    }

    for (let i = 0; i < fireworks.length; i++) {
        if (fireworks[i] === null) {
            fireworks.splice(i, 1);
        }
    }
    

    shellsCount.innerText = `${fireworks.length}`; 
    headsCount.innerText = `${numOfHeads}`;
    tracesCount.innerText = `${numOfTraces}`;

    prevTime = time
    requestAnimationFrame(frame);
}

frame()

// setInterval(() => {
//     frame();
// }, 100);

const canvasCoordsToWebGL = (x, y) => {

    return [
        x,
        canvas.height - y,
    ]
}

const randInt = (max, min=0) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randChance = (value, chance, otherwise) => {
    return Math.random() < chance ? value : otherwise;
}

const addFirework = (x, y) => {
    const traceDisappearanceRule = randInt(1);
    let traceDisappearanceCoef = 1;

    if (traceDisappearanceRule === 0) {
        traceDisappearanceCoef = 0.04;
    }

    const headsQuantity = 40 + randInt(100);

    let nestedExplosionParams;

    if (Math.random() < 0.8) {
        nestedExplosionParams = {
            skipFramesBeforeExplosion: 40 + randInt(10),
            eachFrameExplosion: randChance(1, 0.8, Math.floor(headsQuantity / 4)),
            explosionRule: randInt(1),

            generateHeadsRule: 0,

            traceDisappearanceActivateAfterFrames: 20,
            traceLengthFrames: 10,
            traceDisappearanceRule: randInt(1),
            traceDisappearanceCoef: 1,
            traceDisappearanceEachFrame: 1,

            headDisappearanceActivateAfterFrames: 100,
            headDisappearanceRule: randInt(1),
            headDisappearanceCoef: 0.1,
            headDisappearanceEachFrame: 1,

            headsQuantity: randInt(10, 3),
            vMax: 4*Math.random() + 0.3 ,
            aReduction: 1.01,
            vReduction: 1.1,
        };
    }

    const shellParams = {
        headsQuantity,
        vMax: 4 + Math.random() * 10,
        vReduction: 1.05 + Math.random() * 0.05,
        aReduction: 1.01 + Math.random() * 0.01,
        rotateAng: 0,

        generateHeadsRule: randChance(0, 0.6, 1),

        traceLengthFrames: 10 + randInt(120),
        traceDisappearanceActivateAfterFrames: 40 + randInt(20),
        traceDisappearanceRule,
        traceDisappearanceCoef,
        traceDisappearanceEachFrame: 40,

        headDisappearanceActivateAfterFrames: 100,
        headDisappearanceRule: randInt(1),
        headDisappearanceCoef: 1,
        headDisappearanceEachFrame: 1,

        nestedExplosionParams,
    };

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

    shellParams.rotateAng = Math.atan(-vx / vy);

    const firstShellParams = {
        headsQuantity: 1,
        vReduction: 1.01 + Math.random() * 0.05,
        aReduction: 1.01 + Math.random() * 0.01,
        customHeads: [{
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

        nestedExplosionParams: {
            skipFramesBeforeExplosion: explodeAfterFrames,
            eachFrameExplosion: 1,
            explosionRule: randInt(1),
            ...shellParams,
        },
    }

    fireworks.push(
        new Shell({
            x, 
            y,
            ...firstShellColor,
        }, 
            firstShellParams
        )
    );
}

canvas.onclick = (e) => {
    const [x, y] = canvasCoordsToWebGL(e.offsetX, e.offsetY);

    addFirework(x, y);
}