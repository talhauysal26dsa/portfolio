// Animated liquid-gradient background (WebGL). Falls back to the CSS gradient if WebGL is missing.
(() => {
  const c = document.getElementById('shader');
  const gl = c.getContext('webgl', { antialias: false, premultipliedAlpha: false });
  if (!gl) { c.classList.add('fallback'); return; }

  const vs = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
  const fs = `
precision highp float;
uniform vec2 r; uniform float t; uniform vec2 m; uniform float s;
vec3 hash3(vec2 p){vec3 q=vec3(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)),dot(p,vec2(419.2,371.9)));return fract(sin(q)*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  float a=hash3(i).x,b=hash3(i+vec2(1,0)).x,c=hash3(i+vec2(0,1)).x,d=hash3(i+vec2(1,1)).x;
  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 R=mat2(.8,.6,-.6,.8);for(int i=0;i<5;i++){v+=a*noise(p);p=R*p*2.03;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/r; vec2 p=(gl_FragCoord.xy-.5*r)/min(r.x,r.y);
  p.y+=s*.00025;
  float T=t*.045;
  vec2 q=vec2(fbm(p*1.3+T),fbm(p*1.3-T+3.1));
  vec2 w=vec2(fbm(p*1.6+2.*q+vec2(1.7,9.2)+T*1.3+m*.35),fbm(p*1.6+2.*q+vec2(8.3,2.8)-T));
  float f=fbm(p*1.2+2.2*w);
  vec3 deep=vec3(.10,.06,.28);
  vec3 violet=vec3(.42,.20,.95);
  vec3 cyan=vec3(.05,.72,.86);
  vec3 pink=vec3(.98,.28,.70);
  vec3 amber=vec3(1.,.62,.28);
  vec3 col=deep;
  col=mix(col,violet,smoothstep(.2,.7,f));
  col=mix(col,cyan,smoothstep(.4,.9,w.x)*.85);
  col=mix(col,pink,smoothstep(.5,.9,w.y)*.75);
  col=mix(col,amber,smoothstep(.72,1.,f*q.y*1.6)*.55);
  // keep text readable: darken the middle band a little, vignette edges
  float vig=smoothstep(1.25,.2,length(p*vec2(.8,1.)));
  col*=.52+.48*vig;
  col=pow(col,vec3(.95));
  gl_FragColor=vec4(col,1.);
}`;
  const sh = (type, src) => { const x = gl.createShader(type); gl.shaderSource(x, src); gl.compileShader(x); return x; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { c.classList.add('fallback'); return; }
  gl.useProgram(pr);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(pr, n);
  const ur = U('r'), ut = U('t'), um = U('m'), us = U('s');

  // render at reduced resolution: it's a soft gradient, nobody sees the pixels
  const scale = 0.4;
  const resize = () => { c.width = Math.ceil(innerWidth * scale); c.height = Math.ceil(innerHeight * scale); gl.viewport(0, 0, c.width, c.height); };
  resize(); addEventListener('resize', resize);
  let mx = 0, my = 0, tx = 0, ty = 0;
  addEventListener('pointermove', e => { tx = e.clientX / innerWidth - .5; ty = .5 - e.clientY / innerHeight; });
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const t0 = performance.now();
  const frame = now => {
    mx += (tx - mx) * .03; my += (ty - my) * .03;
    gl.uniform2f(ur, c.width, c.height);
    gl.uniform1f(ut, still ? 20 : (now - t0) / 1000);
    gl.uniform2f(um, mx, my);
    gl.uniform1f(us, scrollY);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!still) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
})();
