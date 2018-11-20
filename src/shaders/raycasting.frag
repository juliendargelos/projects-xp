precision mediump float;

uniform vec2 raycasting_mouse;
uniform bool display;

varying vec2 coordinates;

void main() {
  if(display) {
    float mouse_distance = distance(raycasting_mouse, (coordinates - .5)*2.);
    if(mouse_distance <= .05 && mouse_distance >= .045) gl_FragColor = vec4(0., 0., 0., 0.);
    else gl_FragColor = vec4(coordinates*.5 + vec2(.25, 0.), 0., .6);
  }
  else gl_FragColor = vec4(coordinates*.5 + vec2(.25, 0.), 0., 1.);
}