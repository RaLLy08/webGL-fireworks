class Points {
    static VERTEX_COMPONENTS = 2; // [x, y]
    static COLOR_COMPONENTS = 4; // [r, g, b, a]
    static X_INDEX = 0;
    static Y_INDEX = 1;
    static R_INDEX = 0;
    static G_INDEX = 1;
    static B_INDEX = 2;
    static A_INDEX = 3;
    constructor() {
        this.vertices = new Float32Array(0);
        this.colors = new Float32Array(0);
    }

    *[Symbol.iterator]() {
        for (let i = 0; i < this.vertices.length / Points.VERTEX_COMPONENTS; i++) {
            const positionFromIndex = i * Points.VERTEX_COMPONENTS;
            const colorFromIndex = i * Points.COLOR_COMPONENTS;

            yield {
                x: this.vertices[positionFromIndex],
                y: this.vertices[positionFromIndex + 1],
                r: this.colors[colorFromIndex],
                g: this.colors[colorFromIndex + 1],
                b: this.colors[colorFromIndex + 2],
                a: this.colors[colorFromIndex + 3],
                index: i,
            }
        }
    }

    clear() {
        this.vertices = new Float32Array(0);
        this.colors = new Float32Array(0);
    }

    get quantity() {
        return this.vertices.length / Points.VERTEX_COMPONENTS;
    }

    expandArray(length, array, vc = Points.VERTEX_COMPONENTS) {
        const newArray = new Float32Array(
            length * vc + array.length
        );

        newArray.set(array);

        return newArray;
    }

    addVertices(vertices) {
        const fillFrom = this.vertices.length;

        this.vertices = this.expandArray(vertices.length, this.vertices, 1);

        for (let i = 0; i < vertices.length; i++) {
            this.vertices[i + fillFrom] = vertices[i];
        }

        return this;
    }

    addColors(colors) {
        const fillFrom = this.colors.length;

        this.colors = this.expandArray(colors.length, this.colors, 1);

        for (let i = 0; i < colors.length; i++) {
            this.colors[i + fillFrom] = colors[i];
        }

        return this;
    }
}