precision mediump float;

uniform sampler2D image;
uniform vec2 unit;

varying vec2 uv;

void main() {
  // vec4 color = texture2D(image, uv);

  vec4 p1 = texture2D(image, vec2(uv.x - unit.x*4., uv.y));
  vec4 p2 = texture2D(image, vec2(uv.x - unit.x*3., uv.y));
  vec4 p3 = texture2D(image, vec2(uv.x - unit.x*2., uv.y));
  vec4 p4 = texture2D(image, vec2(uv.x - unit.x*1., uv.y));
  vec4 p5 = texture2D(image, vec2(uv.x            , uv.y));
  vec4 p6 = texture2D(image, vec2(uv.x + unit.x*1., uv.y));
  vec4 p7 = texture2D(image, vec2(uv.x + unit.x*2., uv.y));
  vec4 p8 = texture2D(image, vec2(uv.x + unit.x*3., uv.y));
  vec4 p9 = texture2D(image, vec2(uv.x + unit.x*4., uv.y));

  vec4 color = (p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9)/9.;

  float grayscale = (color.r + color.g + color.b)/3.*(1. - min(1., sqrt(pow((uv.x - .5)*2., 2.) + pow((uv.y - .5)*2., 2.))));

  gl_FragColor = vec4(grayscale, grayscale, grayscale, 1.);
}