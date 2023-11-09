class Shell {
    /**
     * @param {Shell} posAndColor - parent shell from wich coordinates will be taken
     * @param {{
     * headsQuantity: Number, 
     * vMax: Number,
     * traceLengthFrames: Number,
     * vReduction: Number,
     * aReduction: Number,
     * traceDisappearanceActivateAfterFrames: Number,
     * }} params
     */

    constructor(posAndColor, params) {
        this.x = posAndColor.x; 
        this.y = posAndColor.y;
        
        this.r = posAndColor.r;
        this.g = posAndColor.g;
        this.b = posAndColor.b;
        this.a = posAndColor.a;

        this.headsQuantity = params.headsQuantity;
        this.vMax = params.vMax;

        this.nestedExplosionParams = params.nestedExplosionParams;
        
        this.traceLengthFrames = params.traceLengthFrames;
        this._lifeFrames = 0;


        this.traces = new Points(gl); // static points
        this.heads = new Particles(gl); 

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

        this.state = {
            explodedHeadsQuantity: 0,
            visibleTracesQuantity: this.headsQuantity * this.traceLengthFrames,
            visibleHeadsQuantity: this.headsQuantity,
        };
    }
    
    generateHeads() {
        const { vMax, x, y, r, g, b, a } = this;
        const tracesSerie = [];

        for (let i = 0; i < this.headsQuantity; i += 1) {
            const angle = Math.PI * 2 * i / this.headsQuantity;

            let vx = Math.cos(angle);
            let vy = Math.sin(angle);

            // if (vy > 0) {
            //     vy = Math.sqrt(1 - (Math.abs(vx) - 1) ** 2);    
            // } else {
            //     vy = Math.acos(1 - Math.abs(vx)) - Math.PI;
            // }

            // vx = 16 * Math.sin(i)**3;
            // vy = 13 * Math.cos(i) - 5* Math.cos(2*i) - 2 * Math.cos(3*i) - Math.cos(4*i);

            // vx = 16 * Math.sin(i)**3;
            // vy = 13 * Math.cos(i) - 5* Math.cos(2*i) - 2 * Math.cos(3*i) - Math.cos(4*i);
            // vx += vx*0.3* Math.random();
            // vy += vy*0.3* Math.random();
            // vx *= 0.1;
            // vy *= 0.1;

            tracesSerie.push({ 
                x: x + Math.cos(angle),
                y: y + Math.sin(angle),
                vx: vx * vMax * Math.random(),
                vy: vy * vMax * Math.random(),
                avx: 0,
                avy: -0.04,
                r, g, b, a
            });
        }

        return tracesSerie;
    }



    frame() {
        const { heads, traces } = this;

        if (this._lifeFrames === 0) {
            const arr = this.generateHeads();

            if (this.nestedExplosionParams && this.nestedExplosionParams.explosionRule === 0) {
                this.permutate(arr);
            }

            heads.addPoints(
                arr
            );
        }

        this._lifeFrames++;

        heads.move(
            this.vReduction,
            this.aReduction
        );

        if (this._lifeFrames <= this.traceLengthFrames) {
            this.addTraces();
        }

        if (
            this.nestedExplosionParams && 
            this._lifeFrames >= this.nestedExplosionParams.skipFramesBeforeExplosion && 
            this.state.explodedHeadsQuantity < this.headsQuantity
        ) {
            // remove heads after explosion
            this.explodeHeads(this.nestedExplosionParams.eachFrameExplosion);
        }

        if (this._lifeFrames >= this.traceDisappearanceActivateAfterFrames && this.state.visibleTracesQuantity > 0) {   
            this.state.visibleTracesQuantity = this.disapearParticles(
                this.traceDisappearanceRule, 
                this.traceDisappearanceCoef, 
                this.traceDisappearanceEachFrame,
                this.traces,
                this.state.visibleTracesQuantity
            );
        }

        if (this._lifeFrames >= this.headDisappearanceActivateAfterFrames) {
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
            fireworks.splice(
                fireworks.indexOf(this), 1
            );
        }
    }
    //fix collors
    // add all setings, reductions, etc to shell

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

            fireworks.push(
                new Shell(
                    {   
                        x,
                        y,
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