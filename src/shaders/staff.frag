precision mediump float;

uniform bool color;

varying float point_deviation;

void main() {
  if(color) {
    float c = abs(point_deviation*3.);
    gl_FragColor = vec4(c*2., c*3., c*4., 1.);
  }
  else gl_FragColor = vec4(0., 0., 0., 1.);
}