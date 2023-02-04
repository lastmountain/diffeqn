import {Point} from "./Point.js";

var container = document.getElementById('container');

var layer_0 = document.createElement('canvas'), ctx_0 = layer_0.getContext('2d');
var layer_1 = document.createElement('canvas'), ctx_1 = layer_1.getContext('2d');

var testLayer = document.createElement('canvas');
var testContext = testLayer.getContext('2d');

document.getElementById('button1').addEventListener("click", run);
document.getElementById('button2').addEventListener("click", rand_eqns);

var width;
var height;

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

     container.style.width = width + 'px';
     container.style.height = height + 'px';

}


var circle_arr = [];

var scale = 60.0;

var colour_arr = ['#f368e0', '#ff9f43', '#ee5253', '#0abde3', '#1dd1a1', '#c8d6e5', '#feca57'];
var rand_colour;

var running;

var rand_eqns_x = ['y^2', 'y-0.5*x', 'y', 'x+y', '-x+4*y', '-3*x', '4*x', '-2*x + 3*y', '2*x + 3*y'];
var rand_eqns_y = ['x^2', 'sin(x)', '-2*x', 'x-y', '-2*x + 5*y', '3*x - 2*y', '2*x - y', '-3*x - 2*y', '-3*x + 2*y'];

{
    let a = Math.floor(Math.random() * rand_eqns_x.length);
    document.getElementById('boxX').value = rand_eqns_x[a];
    a = Math.floor(Math.random() * rand_eqns_x.length);
    document.getElementById('boxY').value = rand_eqns_y[a];
}

function run() {
    console.log("runnung");
    running = true;
    document.getElementById('button1').innerText = 'Stop';
    rand_colour = colour_arr[Math.floor(Math.random() * colour_arr.length)];

    ctx_0.clearRect(0,0,width,height);

    if (circle_arr === undefined || circle_arr.length == 0) {
        for (var i = 0; i < 200; i++) {
            // circle_arr.push(new Circle(Math.random()*width, Math.random()* height, rand_colour));
            circle_arr.push(new Point(getRandomCoordinate(), 2.5, rand_colour, testContext));
        }
        animate();
    } else {
        running = false;
        document.getElementById('button1').innerText = 'Run';
        circle_arr.length = 0;
    }

}

function rand_eqns() {
    if (running) {
        alert("First Stop the current rendering.");
        return;
    }
    let r = Math.floor(Math.random() * rand_eqns_x.length);
    document.getElementById('boxX').value = rand_eqns_x[r];
    r = Math.floor(Math.random() * rand_eqns_x.length);
    document.getElementById('boxY').value = rand_eqns_y[r];
}

function getRandomCoordinate() {
    const x = (Math.random() * width) - 0.5*width;
    const y = (Math.random()*height - 0.5*height);
    return {x: x, y: y};
}

layer_0.addEventListener('click', 
        function(event) {
            //alert(event.x + "," + event.y);
            if (!running) {
                return;
            }

            var mx = event.x;
            var my = event.y;
            // if (mx < 0 || mx > width || my < 0 || my > height) {
            //     return;
            // }
            var x, y, xn, yn, dt, dx, dy,h;
            var KX_1, KY_1, KX_2, KY_2, KX_3, KY_3, KX_4, KY_4;
            var tx,ty;
            var done;

            //Runge Kutta order 4
            for (var i = -1; i <= 1; i+= 2) {
                mx = event.x;
                my = event.y;

                x = (event.x - 10) - 0.5*width;
                y = -1*(event.y - 10) + 0.5*height;
    
                x /= scale;
                y /= scale;

                xn = x;
                yn = y;
                h = 0.05;
                dt = 0;

                done = false;
                
                while(!done && dt < 5) {
                    KX_1 = i*t_x.evaluate({x,y})*h;
                    KY_1 = i*t_y.evaluate({x,y})*h;
                    dt += h;
                    // console.log(KX_1, KY_1);
                    tx = x;
                    ty = y;
                    //console.log(dt);
                    x = tx + 0.5*dt*KX_1;
                    y = ty + 0.5*dt*KY_1;
                    // console.log(x, y);
                    KX_2 = i*t_x.evaluate({x,y})*h;
                    KY_2 = i*t_y.evaluate({x,y})*h;
                    //console.log(KX_2, KY_2);
                    x = tx + 0.5*dt*KX_2;
                    y = ty + 0.5*dt*KY_2;
                    KX_3 = i*t_x.evaluate({x,y})*h;
                    KY_3 = i*t_y.evaluate({x,y})*h;

                    x = tx + dt*KX_3;
                    y = ty + dt*KY_3;
                    
                    KX_4 = i*t_x.evaluate({x,y})*h;
                    KY_4 = i*t_y.evaluate({x,y})*h;

                    x = tx;
                    y = ty;
                    //console.log(tx, ty); 
                    dx = (1/6)*dt*(KX_1 + 2*KX_2 + 2*KX_3 + KX_4);
                    dy = (1/6)*dt*(KY_1 + 2*KY_2 + 2*KY_3 + KY_4);

                    //console.log(dx, dy);

                    xn += dx;
                    yn += dy;

                    // if (Math.abs(xn-x) < 0.001 && Math.abs(yn-y) < 0.001) {
                    //     done = true;
                    // }

                    if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
                        done = true;
                    }
                    //console.log(dx,dy);
                    mx = (x * scale) + 0.5*width;
                    my =  -1*(y * scale) + 0.5*height;
                    //console.log(mx, my);
    
                    ctx_0.beginPath();
                    ctx_0.moveTo(mx,my);
                    ctx_0.lineTo(( xn * scale) +  0.5*width , -1*(yn * scale) + 0.5*height);
    
                    ctx_0.strokeStyle = 'white';
                    ctx_0.stroke();
    
                    x = xn;
                    y = yn;
                }
            }

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
    if (circle_arr.length == 0) {
        return;
    } else {
        requestAnimationFrame(animate);
    }
    // Store the current transformation matrix
    testContext.save();

    // Use the identity matrix while clearing the canvas
    testContext.setTransform(1, 0, 0, 1, 0, 0);
    testContext.clearRect(0, 0, testContext.canvas.width, testContext.canvas.height);

    // Restore the transform
    testContext.restore();
    for (var i = 0; i < circle_arr.length; i++) {

        const pointPosition = circle_arr[i].getPosition();
        if (!isPointInContext(pointPosition))  {
                circle_arr.splice(i, 1);
        } else {
            const dx = math.evaluate(document.getElementById('boxX').value, pointPosition) / scale;
            const dy = math.evaluate(document.getElementById('boxY').value, pointPosition) / scale;
            circle_arr[i].updatePosition(dx,dy);
        }
    }

}

function isPointInContext(pos) {
    return pos.x > -1*width / 2 && pos.x < width /2 && 
    pos.y > -1*height / 2 && pos.y < height / 2;
}

// function Circle(x,y, colour) {
//     this.pos = {
//         dx: x - 0.5*width,
//         dy: -1*y + 0.5*height
//     }

//     this.coords = {
//         x: x,
//         y: y
//     }

//     this.scope = {
//         x:0,
//         y:0
//     }

//     this.colour = colour;
//     this.pos.dx /= scale;
//     this.pos.dy /= scale;
    
//     this.draw = function() {
//         ctx_1.beginPath();
//         ctx_1.arc(this.coords.x, this.coords.y, 2.5,0,10,false);
//         //ctx_1.strokeStyle = 'white';
//         //ctx_1.fillStyle = rand_colour;
//         ctx_1.stroke(); 
//         ctx_1.fill();
//     }

//     this.update = function() {

//         this.scope.x = (this.coords.x - 0.5*width)/scale;
//         this.scope.y = (-1*this.coords.y + 0.5*height)/scale;


//         this.pos.dx = t_x.evaluate(this.scope);
//         this.pos.dy = t_y.evaluate(this.scope);

//         this.coords.x += this.pos.dx;
//         this.coords.y -= this.pos.dy;

//         //ctx_1.fillStyle = shadeColor(this.colour, Math.abs(10*(this.pos.dx + this.pos.dy)));
//         ctx_1.fillStyle = this.colour;
//         this.draw();

//     }
// }
//draw_grid();
