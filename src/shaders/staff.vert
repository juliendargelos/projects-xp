precision mediump float;

uniform mat4 projection;
uniform mat4 view;
uniform float size;
uniform float far_width;
uniform mat4 transformation;
uniform vec2 raycasting_mouse;
uniform float time;
uniform float width;
uniform float deviation;
uniform float base_deviation;

attribute vec2 position;

varying float point_deviation;

void main() {
  float pointer_deviation = pow(.2 - min(.2, distance(raycasting_mouse, position)*.5), 2.)*deviation + base_deviation;
  float wave_deviation = sin(position.x*10. + position.y*10. + time*.005)*.07;
  point_deviation = wave_deviation*pointer_deviation*10.;
  gl_Position = projection*view*(transformation*vec4(position.x, point_deviation, position.y, 1.));
  gl_PointSize = width*10./(gl_Position.z + 1.);
}