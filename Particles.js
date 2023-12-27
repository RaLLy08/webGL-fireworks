import Points from './Points.js';

/**
 * @typedef {Object} ParticleParams
 * @property {number} x - x coordinate
 * @property {number} y - y coordinate
 * @property {number} vx - velocity x
 * @property {number} vy - velocity y
 * @property {number} avx - acceleration x
 * @property {number} avy - acceleration y
 * @property {number} r - red
 * @property {number} g - green
 * @property {number} b - blue
 * @property {number} a - alpha
 */

export default class Particles extends Points {
    constructor() {
        super();
        this.velocities = new Float32Array(0);
        this.accelerations = new Float32Array(0);
    }
    
    clear() {
        super.clear();
        this.velocities = new Float32Array(0);
        this.accelerations = new Float32Array(0);
    }

    /**
     * @param {Array.<ParticleParams>} params
     * @returns {Particles}
     */
    addPoints(params) {
        const fillFrom = this.vertices.length;

        this.vertices = this.expandArray(params.length, this.vertices);
        this.velocities = this.expandArray(params.length, this.velocities);
        this.accelerations = this.expandArray(params.length, this.accelerations);
        this.colors = this.expandArray(params.length, this.colors, Points.COLOR_COMPONENTS);

        for (let i = 0; i < params.length; i++) {
            const { 
                x, y, 
                vx, vy, 
                avx, avy, 
                r, g, b, a 
            } = params[i];

            // [x => i*2 + 0]...
            this.vertices[i * Points.VERTEX_COMPONENTS + fillFrom] = x;
            // [y => i*2 + 1]...
            this.vertices[i * Points.VERTEX_COMPONENTS + 1 + fillFrom] = y;

            // velocities
            this.velocities[i * Points.VERTEX_COMPONENTS + fillFrom] = vx;
            this.velocities[i * Points.VERTEX_COMPONENTS + 1 + fillFrom] = vy;

            // accelerations
            this.accelerations[i * Points.VERTEX_COMPONENTS + fillFrom] = avx;
            this.accelerations[i * Points.VERTEX_COMPONENTS + 1 + fillFrom] = avy;

            // colors
            this.colors[i * Points.COLOR_COMPONENTS + fillFrom] = r;
            this.colors[i * Points.COLOR_COMPONENTS + 1 + fillFrom] = g;
            this.colors[i * Points.COLOR_COMPONENTS + 2 + fillFrom] = b;   
            this.colors[i * Points.COLOR_COMPONENTS + 3 + fillFrom] = a;
        }

        return this;
    }

    move(vReduction = 1, aReduction = 1) {
        for (let i = 0; i < this.velocities.length; i+= Points.VERTEX_COMPONENTS) {
            const vx = this.velocities[i];
            const vy = this.velocities[i + 1];
            const avx = this.accelerations[i];
            const avy = this.accelerations[i + 1];

            //v resistance
            this.velocities[i] /= vReduction;
            this.velocities[i + 1] /= vReduction;

            // a resistance
            this.accelerations[i] /= aReduction;
            this.accelerations[i + 1] /= aReduction;

            this.vertices[i] += vx;
            this.vertices[i + 1] += vy;

            this.velocities[i] += avx;  
            this.velocities[i + 1] += avy;

            // if (this.vertices[i] + vx > canvas.width || this.vertices[i] + vx < 0) {
            //     this.velocities[i] *= -1;
            // }

            // if (this.vertices[i + 1] + vy > canvas.height || this.vertices[i + 1] + vy < 0) {
            //     this.velocities[i + 1] *= -1;
            // }
        }
    }
}