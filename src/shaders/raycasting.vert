precision mediump float;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 transformation;
uniform float offset;

attribute vec2 position;

varying vec2 coordinates;

void main() {
  coordinates = (position.xy*.5 + .5);
  gl_Position = projection*view*(transformation*vec4(position.x, offset, position.y, 1.));
}