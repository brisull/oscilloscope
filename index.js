// forked from sasaplus1's "Canvas Oscilloscope" http://jsdo.it/sasaplus1/Ra2B
(function(){

  if (!window.HTMLCanvasElement) {
    return;
  }

  // http://d.hatena.ne.jp/calpo/20110523/p1
  window.requestAnimationFrame = (function(){
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback, element) {
        window.setTimeout(callback, 1000 / 60);
      };
  }());

  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  context.globalCompositeOperation = 'lighter';

  var frequencies = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  var sinFrequency = 1;
  var cosFrequency = 2;



  draw();



  function draw() {
    resize();
    drawWave();
    window.requestAnimationFrame(draw);
  }

  function drawWave() {
    drawWave.sin_x = drawWave.sin_x || 0;
    drawWave.cos_x = drawWave.cos_x || 0;

    context.strokeStyle = 'rgba(25, 255, 75, 0.8)';

    // omega = 2 * pi * f
    function getOmega(frequency) {
      return 2 * Math.PI * frequency;
    }

    // pixel = 2 * Math.PI * frequency * period / canvas.width
    // http://junzo.sakura.ne.jp/dsp4/dsp4.htm
    function getPixel(frequency) {
      return getOmega(frequency) * 1 / canvas.width;
    }

    var sin_pixel = getPixel(sinFrequency);
    var cos_pixel = getPixel(cosFrequency);

    function getWavePoints(start, count, pixel, triangle_func) {
      var points = [];

      for (var i = start, len = count; i < len; i++) {
        points.push(triangle_func(pixel * i) * getFactor() + 235);
      }

      return points;
    }

    function drawPoints(start, pixel, triangle_func, strokeStyle) {
      var path = getWavePoints(start, canvas.width + start, pixel, triangle_func);

      context.beginPath();
      context.moveTo(0, path[0]);

      for (var i = 1, len = path.length; i < len; i++) {
        context.lineTo(i, path[i]);
      }
      context.lineWidth = 14;
      context.strokeStyle = strokeStyle;
      context.stroke();
    }

    // Change the x increment to make the animation faster
    drawPoints(drawWave.sin_x+=5, sin_pixel, function(x){return Math.sin(x);}, 'rgba(25, 255, 75, 0.8)');
    drawPoints(drawWave.cos_x+=5, cos_pixel, function(x){return Math.cos(x);}, 'rgba(255, 0, 0, 0.8)');
  
    if (drawWave.sin_x > canvas.width || drawWave.cos_x> canvas.width) {
      drawWave.sin_x = 0;
      drawWave.cos_x = 0;
      sinFrequency = frequencies[Math.floor(Math.random() * frequencies.length)];
      cosFrequency = frequencies[Math.floor(Math.random() * frequencies.length)];
    }
  }

  function getFactor() {
    return canvas.height / 4;
  }

  function resize() {
    canvas.width = window.innerWidth /2;
    canvas.height = window.innerHeight;
  }

}());
