import { PathDrawer } from "./PathDrawer.js";
import {Point} from "./Point.js";

var container;
var layer_0, layer_1;
var testLayer;
var ctx_0, ctx_1;
var testContext;
var width, height;

function setUpCanvas() {
    container = document.getElementById('container');

    layer_0 = document.createElement('canvas');
    ctx_0 = layer_0.getContext('2d');
    layer_1 = document.createElement('canvas')
    ctx_1 = layer_1.getContext('2d');
    testLayer = document.createElement('canvas');
    testContext = testLayer.getContext('2d');
    
    document.getElementById('button1').addEventListener("click", run);
    document.getElementById('button2').addEventListener("click", randomizeEquations);

}
setUpCanvas();

window.onload = function() {
     console.log('loading');

     container.style.position = "relative";

     layer_0.style.position = "absolute";
     layer_1.style.position = "absolute";
     testLayer.style.position = "absolute";

     layer_0.style.zIndex = "0";
     layer_1.style.zIndex = "1";
     testLayer.style.zIndex = "2";

     container.appendChild(layer_0);
     container.appendChild(layer_1);
     container.appendChild(testLayer);
     resizeCanvas();
}

window.onresize = function() {
     console.log('resizing');
     resizeCanvas();
 
}

function resizeCanvas() {
     width = window.innerWidth;
     height = window.innerHeight;

     if (width >= (16/9)*height) {
          width /= 2;
          height -= 16;
     } else {
          width -= 16;
          height /= 2;
     }

     layer_0.width = width;
     layer_1.width = width;
     testLayer.width = width;

     layer_0.height = height;
     layer_1.height = height;
     testLayer.height = height;

    testContext.transform(1,0,0,-1,0.5*width, 0.5*height);
    ctx_0.transform(1,0,0,-1,0.5*width, 0.5*height);

    container.style.width = width + 'px';
    container.style.height = height + 'px';

}


var PointArray;
var scale;
var ColourArray;
var rand_colour;
var isRunning;

var randEqnsX;
var randEqnsY;

// var drawer = new PathDrawer(document.getElementById('boxX').value, document.getElementById('boxY').value, ctx_0, 60);

function setUpDrawingVars() {
    PointArray = [];
    scale = 60.0;
    ColourArray = ['#f368e0', '#ff9f43', '#ee5253', '#0abde3', '#1dd1a1', '#c8d6e5', '#feca57'];
    rand_colour;
    isRunning;
    
    randEqnsX = ['y^2', 'y-0.5*x', 'y', 'x+y', '-x+4*y', '-3*x', '4*x', '-2*x + 3*y', '2*x + 3*y'];
    randEqnsY = ['x^2', 'sin(x)', '-2*x', 'x-y', '-2*x + 5*y', '3*x - 2*y', '2*x - y', '-3*x - 2*y', '-3*x + 2*y'];
    
    let a = Math.floor(Math.random() * randEqnsX.length);
    document.getElementById('boxX').value = randEqnsX[a];
    a = Math.floor(Math.random() * randEqnsX.length);
    document.getElementById('boxY').value = randEqnsY[a];

}
setUpDrawingVars();

function run() {
    console.log("runnung");
    isRunning = true;
    document.getElementById('button1').innerText = 'Stop';
    rand_colour = ColourArray[Math.floor(Math.random() * ColourArray.length)];
    ctx_0.clearRect(-1/2*width,-1/2*height,width,height);

    if (PointArray === undefined || PointArray.length == 0) {
        for (var i = 0; i < 200; i++) {
            PointArray.push(new Point(getRandomCoordinate(), 2.5, rand_colour, testContext));
        }
        animate();
    } else {
        isRunning = false;
        document.getElementById('button1').innerText = 'Run';
        PointArray.length = 0;
    }

}

function randomizeEquations() {
    if (isRunning) {
        alert("First Stop the current rendering.");
        return;
    }
    let r = Math.floor(Math.random() * randEqnsX.length);
    document.getElementById('boxX').value = randEqnsX[r];
    r = Math.floor(Math.random() * randEqnsX.length);
    document.getElementById('boxY').value = randEqnsY[r];
}

function getRandomCoordinate() {
    const x = (Math.random() * width) - 0.5*width;
    const y = (Math.random()*height - 0.5*height);
    return {x: x, y: y};
}

testLayer.addEventListener('click', 
        function(event) {
            if (!isRunning) {
                return;
            }
            //  TODO
            //  Fix this later
            var drawer = new PathDrawer(document.getElementById('boxX').value, document.getElementById('boxY').value, ctx_0, 60);
            drawer.updateEqns({x: document.getElementById('boxX').value, y: document.getElementById('boxY').value});
            drawer.draw(event.x - width/2, height/2 - event.y);
            // console.log(drawer);
        });



function draw_grid() {

    ctx_1.beginPath();
    ctx_1.moveTo(width/2, 0);
    ctx_1.lineTo(width/2, height);
    ctx_1.lineWidth = 2;
    ctx_1.strokeStyle = "gray";
    ctx_1.stroke();

    ctx_1.moveTo(0, height/2);
    ctx_1.lineTo(width, height/2);
    ctx_1.stroke();
}

function animate() {
    if (PointArray.length == 0) {
        return;
    } else {
        requestAnimationFrame(animate);
    }
    // TODO
    // Make this better later
    testContext.save();
    testContext.setTransform(1, 0, 0, 1, 0, 0);
    testContext.clearRect(0, 0, testContext.canvas.width, testContext.canvas.height);
    testContext.restore();

    for (let i = 0; i < PointArray.length; i++) {

        const pointPosition = PointArray[i].getPosition();
        if (!isPointInContext(pointPosition))  {
                const random_coord = getRandomCoordinate();
                PointArray[i].resetPoint(random_coord);
                
        } else {
            const dx = math.evaluate(document.getElementById('boxX').value, {x: pointPosition.x / scale, y: pointPosition.y / scale});
            const dy = math.evaluate(document.getElementById('boxY').value, {x: pointPosition.x / scale, y: pointPosition.y / scale});
            if (isPointTooSlow(dx,dy)) {
                const random_coord = getRandomCoordinate();
                PointArray[i].resetPoint(random_coord);
            } else {
                PointArray[i].updatePosition(dx,dy);
            }
            
        }
    }

}

function isPointInContext(pos) {
    return pos.x > -1*width / 2 && pos.x < width /2 && 
    pos.y > -1*height / 2 && pos.y < height / 2;
}

function isPointTooSlow(dx, dy) {
    return Math.abs(dx) < 1 / (scale) && Math.abs(dy) < 1 / (scale);
}
