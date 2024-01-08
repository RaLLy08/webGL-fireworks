# webGL-fireworks
https://rally08.github.io/webGL-fireworks/


( improved version of https://github.com/RaLLy08/canvas-fireworks )


## Files

### `Points.js`

- The Points сlass for the task of creating, iteration and modifications of color and vertex buffers for each point.

### `Particles.js`

- The Particles class extends Points class to control the number of particles, change velocity and acceleration of the particles.
- 
### `Shell.js`

- The main class that controls the fireworks components such as the head and the trail, which also sets the conditions for the detonation time, adds fireworks to the rendering pool.
- 
### `index.js`

- Includes classes for creating random parameters for the Shield class, also iterates through the pool of fireworks in the order to webGL rendering.
  
### `sound.js`

- Contains a function for playing and distorting sound

### `Components.js`

- Contains auxiliary components for display using the preact library
