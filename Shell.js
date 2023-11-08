class Shell {
    /**
     * @param {Shell} posAndColor - parent shell from wich coordinates will be taken
     * @param {{
     * headsQuantity: Number, 
     * vMax: Number,
     * maxTracesSeries: Number,
     * vReduction: Number,
     * aReduction: Number,
     * headExplosionAfterFrames: Number,
     * startDisapearAfterFrames: Number,
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

        // this.skipFramesBeforeExplosion = params.skipFramesBeforeExplosion;
        // this.vertices = params.vertices;
        // this.verticeIndex = params.verticeIndex;

        
        this.maxTracesSeries = params.maxTracesSeries;
        this._tracesSeries = 0;


        this.traces = new Points(gl); // static points
        this.heads = new Particles(gl); 

        this.aReduction = params.aReduction;
        this.vReduction = params.vReduction;

        this.headExplosionAfterFrames = params.headExplosionAfterFrames;
        this.startDisapearAfterFrames = params.startDisapearAfterFrames;

        this.state = {
            explodedHeadsQuantity: 0,
            visibleTracesQuantity: this.headsQuantity * this.maxTracesSeries,
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

        if (this._tracesSeries === 0) {
            heads.addPoints(
                this.generateHeads()
            );
        }

        this._tracesSeries++;

        heads.move(
            this.vReduction,
            this.aReduction
        );

        if (this._tracesSeries <= this.maxTracesSeries) {
            this.addTraces();
        }

        if (this._tracesSeries >= this.headExplosionAfterFrames && this.state.explodedHeadsQuantity < this.headsQuantity) {
            // remove heads after explosion
            this.explodeHeads(1, 1);
        }

        if (this._tracesSeries >= this.startDisapearAfterFrames && this.state.visibleTracesQuantity > 0) {   
            this.disapearTraces(0, 1, this.headsQuantity);
        }

        if (this.state.visibleTracesQuantity <= 0) {
            // this.heads = null;
            this.traces.clear();
            // this.heads.clear();
            
            // fireworks.splice(
            //     fireworks.indexOf(this), 1
            // );
        }
    }
    //fix collors
    // add all setings, reductions, etc to shell

    explodeHeads(type, affectedCount) {
        const params = {
            headsQuantity: 10,
            vMax: 2,
            maxTracesSeries: 10,
            aReduction: 1.01,
            vReduction: 1.1,
            startDisapearAfterFrames: 20,
        };

        if (type === 0) {
            this.fromFirstToLastExplosion(affectedCount, params);
        }

        if (type === 1) {
            this.randomExplosion(affectedCount, params);
        }

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

    randomExplosion(affectedCount, params) {
        if (this.state.explodedHeadsQuantity === 0) {
            for (let i = this.headsQuantity - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));

                [
                    this.heads.vertices[i * Points.VERTEX_COMPONENTS], 
                    this.heads.vertices[j * Points.VERTEX_COMPONENTS]
                ] = 
                [
                    this.heads.vertices[j * Points.VERTEX_COMPONENTS], 
                    this.heads.vertices[i * Points.VERTEX_COMPONENTS]
                ];
                [
                    this.heads.vertices[i * Points.VERTEX_COMPONENTS + 1],
                     this.heads.vertices[j * Points.VERTEX_COMPONENTS + 1]
                ] = 
                [
                    this.heads.vertices[j * Points.VERTEX_COMPONENTS + 1], 
                    this.heads.vertices[i * Points.VERTEX_COMPONENTS + 1]
                ];
            }
        }


        this.fromFirstToLastExplosion(affectedCount, params);
    }

    /**
     * @param {Number} affectedCount - the number of colors affected by the reductionCoef each frame
     * @param {Number} reductionCoef - the coefficient by which the alpha channel will be reduced
     * @returns {number} - the number of colors which alpha channel more than 0
     */
    randomDisappearance(reductionCoef, affectedCount) {
        const randomIndexes = new Set();

        for (let i = 0; i < affectedCount; i++) {
            randomIndexes.add(Math.floor(Math.random() * this.state.visibleTracesQuantity));
        }

        let visibleQuantity = 0;

        for (const trace of this.traces) {
            const { a, index } = trace;
            
            if (a > 0) {
                if (randomIndexes.has(visibleQuantity)) {
                    for (let i = 0; i < affectedCount; i++) {
                        this.traces.colors[index * Points.COLOR_COMPONENTS + Points.A_INDEX] -= reductionCoef;
                    }

                }
                    visibleQuantity += 1;
                }
            }  

            return visibleQuantity;
    }

    fromFirstToLastDisappearance(reductionCoef, affectedCount) {
        let visibleQuantity = 0;

        for (const trace of this.traces) {
            const { a, index } = trace;
            
            if (a > 0) {
                if (visibleQuantity < affectedCount) {
                    this.traces.colors[index * Points.COLOR_COMPONENTS + Points.A_INDEX] -= reductionCoef;
                }
                    visibleQuantity += 1;
                }
        }  

        return visibleQuantity;
    }

    disapearTraces(type, reductionCoef, affectedCount) {
        if (type === 0) {
            this.state.visibleTracesQuantity = this.randomDisappearance(reductionCoef, affectedCount);
        }

        if (type === 1) {
            this.state.visibleTracesQuantity = this.fromFirstToLastDisappearance(reductionCoef, affectedCount);
        }

    }

    addTraces() {
        this.traces.addVertices(
            this.heads.vertices
        ).addColors(
            this.heads.colors
        );
    }
}