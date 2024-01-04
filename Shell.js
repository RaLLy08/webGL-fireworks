import Points from './Points.js';
import Particles from './Particles.js';


/**
 * @typedef {Object} ShellParams
 * @property {number | Array.<import('./Particles.js').ParticleParams>} heads - the number of heads suround x, y or custom heads (if not set, heads will be generated from initialHeadsQuantity)
 * @property {number} traceLengthFrames - the number of frames during which traces will be generated
 * 
 * @property {number} generateHeadsRule - the rule defines the way of heads generation (only with type heads = number)
 * @property {number} vMax - the maximum velocity of heads (only with type heads = number)
 * @property {number} rotateAng - the angle of rotation of heads in radians (only with type heads = number)
 * 
 * @property {number} aReduction - the coefficient by which acceleration will be divided each frame
 * @property {number} vReduction - the coefficient by which velocity will be divided each frame

 * @property {number} traceDisappearanceActivateAfterFrames - the number of frames after which traces will start to disappear
 * @property {number} traceDisappearanceRule - the rule defines the way of traces disapearance
 * @property {number} traceDisappearanceCoef - the coefficient by which the alpha channel will be subtracted each frame
 * @property {number} traceDisappearanceEachFrame - the number of traces which alpha channel will be subtracted by disappearanceCoef each frame
 * 
 * @property {number} headDisappearanceActivateAfterFrames - the number of frames after which heads will start to disappear
 * @property {number} headDisappearanceRule - the rule defines the way of heads disapearance
 * @property {number} headDisappearanceCoef - the coefficient by which the alpha channel will be subtracted each frame
 * @property {number} headDisappearanceEachFrame - the number of heads which alpha channel will be subtracted by disappearanceCoef each frame
 * 
 * @property {NestedShellParams} nestedExplosionParams - the parameters of nested explosion
*/

/**
 * @typedef {Object} NestedShellNewParams
 * @property {number} skipFramesBeforeExplosion - the number of skipped frames before explosion
 * @property {number} eachFrameExplosion - the number of heads which will explode each frame
 * @property {number} explosionRule - the rule defines the way of heads explosion
 * @typedef {ShellParams & NestedShellNewParams} NestedShellParams
*/


export default class Shell {
    /**
     * @type {Array.<Shell>}
    */
    static fireworks = [];
    /**
     * @param {x: number, y: number} initialPosition - initial position of shell
     * @param {r: number, g: number, b: number, a: number} initialColor - initial color of shell (0.0 - 1.0)
     * @param {ShellParams} params
     */

    constructor(
        initialPosition, 
        initialColor, 
        params
    ) {
        this.x = initialPosition.x; 
        this.y = initialPosition.y;
        
        this.r = initialColor.r;
        this.g = initialColor.g;
        this.b = initialColor.b;
        this.a = initialColor.a;

        this.customHeads = params.heads;
        this.initialHeadsQuantity = params.heads;

        if (Array.isArray(params.heads)) {
            this.initialHeadsQuantity = params.heads.length;
        }

        this.vMax = params.vMax;
        this.rotateAng = params.rotateAng;

        this.nestedExplosionParams = params.nestedExplosionParams;
        this.traceLengthFrames = params.traceLengthFrames;

        this.aReduction = params.aReduction;
        this.vReduction = params.vReduction;

        this.traceDisappearanceActivateAfterFrames = params.traceDisappearanceActivateAfterFrames;
        this.traceDisappearanceRule = params.traceDisappearanceRule;
        this.traceDisappearanceCoef = params.traceDisappearanceCoef;
        this.traceDisappearanceEachFrame = params.traceDisappearanceEachFrame;

        this.headDisappearanceActivateAfterFrames = params.headDisappearanceActivateAfterFrames;
        this.headDisappearanceRule = params.headDisappearanceRule;
        this.headDisappearanceCoef = params.headDisappearanceCoef;
        this.headDisappearanceEachFrame = params.headDisappearanceEachFrame;

        this.generateHeadsRule = params.generateHeadsRule;

        this.traces = new Points(); // static points
        this.heads = new Particles();

        /** 
         * @type {
         * explodedHeadsQuantity: number - the number of sub fireworks which were added to Shell.fireworks
         * visibleTracesQuantity: number - the number of traces which alpha channel more than 0
         * visibleHeadsQuantity: number - the number of heads which alpha channel more than 0
         * lifeFrames: number
         * }
         * @access protected
         */
        this.state = {
            lifeFrames: 0,
            explodedHeadsQuantity: 0,
            visibleTracesQuantity: this.initialHeadsQuantity * this.traceLengthFrames,
            visibleHeadsQuantity: this.initialHeadsQuantity,
        };
    }

    generateHeads() {
        const { vMax, x, y, r, g, b, a } = this;
        /** @type {Array.<import('./Particles.js').ParticleParams>} */
        const tracesSerie = [];

        for (let i = 0; i < this.initialHeadsQuantity; i += 1) {
            const angle = Math.PI * 2 * i / this.initialHeadsQuantity;

            let vx = Math.cos(angle);
            let vy = Math.sin(angle);


            if (this.generateHeadsRule === 0) {
                vx = vx * vMax * Math.random();
                vy = vy * vMax * Math.random();
            }

            if (this.generateHeadsRule === 1) {
                vx = 16 * Math.sin(i)**3;
                vy = 13 * Math.cos(i) - 5* Math.cos(2*i) - 2 * Math.cos(3*i) - Math.cos(4*i);
                vx += vx*0.6* Math.random();
                vy += vy*0.6* Math.random();

                vx *= 0.04 * vMax;
                vy *= 0.04 * vMax;
            } 

            if (this.rotateAng) {
                vx = vx * Math.cos(this.rotateAng) - vy * Math.sin(this.rotateAng);
                vy = vx * Math.sin(this.rotateAng) + vy * Math.cos(this.rotateAng);
            }

            const gravity = -0.04;

            tracesSerie.push({ 
                x,
                y,
                vx,
                vy,
                avx: 0,
                avy: gravity,
                r, g, b, a
            });
        }

        return tracesSerie;
    }

    addHeads() {
        const arr = Array.isArray(this.customHeads) ? this.customHeads : this.generateHeads();

        if (this.nestedExplosionParams && this.nestedExplosionParams.explosionRule === 0) {
            this.permutate(arr);
        }

        this.heads.addPoints(
            arr
        );
    }

    frame() {
        const { heads } = this;

        if (this.state.lifeFrames === 0) {
            this.addHeads();
        }

        this.state.lifeFrames++;

        heads.move(
            this.vReduction,
            this.aReduction
        );

        if (this.state.lifeFrames <= this.traceLengthFrames) {
            this.addTraces();
        }

        if (
            this.nestedExplosionParams && 
            this.state.lifeFrames >= this.nestedExplosionParams.skipFramesBeforeExplosion && 
            this.state.explodedHeadsQuantity < this.initialHeadsQuantity
        ) {
            this.explodeHeads(this.nestedExplosionParams.eachFrameExplosion);
        }

        if (this.state.lifeFrames >= this.traceDisappearanceActivateAfterFrames && this.state.visibleTracesQuantity > 0) {   
            this.state.visibleTracesQuantity = this.disapearParticles(
                this.traceDisappearanceRule, 
                this.traceDisappearanceCoef, 
                this.traceDisappearanceEachFrame,
                this.traces,
                this.state.visibleTracesQuantity
            );
        }

        if (this.state.lifeFrames >= this.headDisappearanceActivateAfterFrames) {
            this.state.visibleHeadsQuantity = this.disapearParticles(
                this.headDisappearanceRule, 
                this.headDisappearanceCoef, 
                this.headDisappearanceEachFrame,
                this.heads,
                this.state.visibleHeadsQuantity
            );
        }

        if (this.state.visibleTracesQuantity <= 0) {
            this.traces.clear();
        }

        if (this.state.visibleHeadsQuantity <= 0) {
            this.heads.clear();
        }

        if (this.state.visibleTracesQuantity <= 0 && this.state.visibleHeadsQuantity <= 0) {
            Shell.fireworks[Shell.fireworks.indexOf(this)] = null;
        }
    }

    explodeHeads(affectedCount) {
        this.fromFirstToLastExplosion(affectedCount, this.nestedExplosionParams);
        
        this.state.explodedHeadsQuantity += affectedCount;
    }

    fromFirstToLastExplosion(affectedCount, params) {
        // current explosion index
        const fromIndex = this.state.explodedHeadsQuantity * Points.VERTEX_COMPONENTS;

        for (let i = 0; i < affectedCount; i++) {
            const x = this.heads.vertices[fromIndex + i * Points.VERTEX_COMPONENTS];
            const y = this.heads.vertices[fromIndex + 1 + i * Points.VERTEX_COMPONENTS];

            Shell.fireworks.push(
                new Shell(
                    {   
                        x,
                        y,
                    },
                    {
                        r: this.r,
                        g: this.g,
                        b: this.b,
                        a: 1,
                    },
                    params
                )
            )

        }
    }

    permutate(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * @param {Number} rule - the rule defines the way of particles disapearance
     * @param {Number} reductionCoef - the coefficient by which the alpha channel will be reduced
     * @param {Number} affectedCount - the number of colors affected by the reductionCoef each frame
     * @param {Number} particles - the array of particles with colors
     * @param {Number} visibleQuantity - the number of colors which alpha channel more than 0
     * @returns {number} - the number of colors which alpha channel more than 0
     */
    disapearParticles(rule, reductionCoef, affectedCount, particles, visibleQuantity) {
        if (rule === 0) {
            return this.randomDisappearance(
                reductionCoef, 
                affectedCount, 
                particles, 
                visibleQuantity
            );
        }

        if (rule === 1) {
            return this.fromFirstToLastDisappearance(reductionCoef, affectedCount, particles);
        }

        return visibleQuantity;
    }

    randomDisappearance(reductionCoef, affectedCount, particles, currentVisibleQuantity) {
        const randomIndexes = new Set();

        for (let i = 0; i < affectedCount; i++) {
            randomIndexes.add(Math.floor(Math.random() * currentVisibleQuantity));
        }

        let visibleQuantity = 0;

        for (let i = 0; i < particles.colors.length; i += Points.COLOR_COMPONENTS) {
            const a = particles.colors[i + Points.A_INDEX];

            if (a > 0) {
                if (randomIndexes.has(visibleQuantity)) {
                    for (let j = 0; j < affectedCount; j++) {
                        particles.colors[i + Points.A_INDEX] -= reductionCoef;
                    }
                }

                visibleQuantity += 1;
            }
        }

        return visibleQuantity;
    }

    fromFirstToLastDisappearance(reductionCoef, affectedCount, particles) {
        let visibleQuantity = 0;

        for (const trace of particles) {
            const { a, index } = trace;
            
            if (a > 0) {
                if (visibleQuantity < affectedCount) {
                    particles.colors[index * Points.COLOR_COMPONENTS + Points.A_INDEX] -= reductionCoef;
                }
                visibleQuantity += 1;
            }
        }  

        return visibleQuantity;
    }

    addTraces() {
        this.traces.addVertices(
            this.heads.vertices
        ).addColors(
            this.heads.colors
        );
    }
}
