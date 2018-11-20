precision mediump float;

uniform mat4 projection;
uniform mat4 view;

attribute vec4 position;

varying vec4 color;

void main() {
  if(position.w == 0.) color = vec4(1., 0., 0., 1.);
  else if(position.w == 1.) color = vec4(0., 1., 0., 1.);
  else if(position.w == 2.) color = vec4(0., 0., 1., 1.);

  gl_Position = projection*view*vec4(position.xyz, 1.);
}