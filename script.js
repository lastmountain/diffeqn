var layer_0 = document.getElementById('layer_0'), ctx_0 = layer_0.getContext('2d');
var layer_1 = document.getElementById('layer_1'), ctx_1 = layer_1.getContext('2d');

var width = layer_0.width;
var height = layer_0.height;


document.getElementById('data_1').value = 'y^2';
document.getElementById('data_2').value = 'x^2';

var circle_arr = [];

var g_dx;
var g_dy;

var t_x;
var t_y;

var scale = 60.0;

var colour_arr = ['#f368e0', '#ff9f43', '#ee5253', '#0abde3', '#1dd1a1', '#c8d6e5', '#feca57'];
var rand_colour;

var running;

var rand_eqns_x = ['y^2', 'y-0.5*x', 'y', 'x+y', '-x+4*y', '-3*x', '4*x', '-2*x + 3*y', '2*x + 3*y'];
var rand_eqns_y = ['x^2', 'sin(x)', '-2*x', 'x-y', '-2*x + 5*y', '3*x - 2*y', '2*x - y', '-3*x - 2*y', '-3*x + 2*y'];

function run() {
    running = true;
    document.getElementById('button').innerText = 'Stop';
    rand_colour = colour_arr[Math.floor(Math.random() * colour_arr.length)];

    ctx_0.clearRect(0,0,width,height);

    g_dx = math.parse(document.getElementById('data_1').value);
    g_dy = math.parse(document.getElementById('data_2').value);

    t_x = g_dx.compile();
    t_y = g_dy.compile();

    if (circle_arr === undefined || circle_arr.length == 0) {
        for (var i = 0; i < 100; i++) {
            circle_arr.push(new Circle(Math.random()*width, Math.random()* height));
        }
        animate();
    } else {
        running = false;
        document.getElementById('button').innerText = 'Run';
        circle_arr.length = 0;
    }

}

function rand_eqns() {
    if (running) {
        return;
    }
    var r = Math.floor(Math.random() * rand_eqns_x.length);
    document.getElementById('data_1').value = rand_eqns_x[r];
    document.getElementById('data_2').value = rand_eqns_y[r];
}

window.addEventListener('click', 
        function(event) {

            if (!running) {
                return;
            }

            var mx = event.x - 10;
            var my = event.y - 10;

            if (mx < 0 || mx > width || my < 0 || my > height) {
                return;
            }

            var x, y, xi, yi, h;
            //Eulers Method
            for (var i = -1; i <= 1; i+= 2) {
                mx = event.x - 10;
                my = event.y - 10;

                x = (event.x - 10) - 0.5*width;
                y = -1*(event.y - 10) + 0.5*height;
    
                x /= scale;
                y /= scale;
    
                h = 0.05;
                
                while(mx >= 0 && mx < width && my >= 0 && my < height) {
                    xi = x + i*t_x.evaluate({x,y}) * h;
                    yi = y + i*t_y.evaluate({x,y}) * h;

                    if (Math.abs(xi-x) < 0.001 && Math.abs(yi-y) < 0.001) {
                        break;
                    }
    
                    mx = (x * scale) + 0.5*width;
                    my =  -1*(y * scale) + 0.5*height;
    
                    ctx_0.beginPath();
                    ctx_0.moveTo(mx,my);
                    ctx_0.lineTo(( xi * scale) +  0.5*width , -1*(yi * scale) + 0.5*height);
    
                    ctx_0.strokeStyle = 'white';
                    ctx_0.stroke();
    
                    x = xi;
                    y = yi;
    
                }
            }

        });



function draw_grid() {

    ctx_0.beginPath();
    ctx_0.moveTo(width/2, 0);
    ctx_0.lineTo(width/2, height);
    ctx_0.lineWidth = 2;
    ctx_0.strokeStyle = "gray";
    ctx_0.stroke();

    ctx_0.moveTo(0, height/2);
    ctx_0.lineTo(width, height/2);
    ctx_0.stroke();
}

function animate() {
    if (circle_arr.length == 0) {
        return;
    } else {
        requestAnimationFrame(animate);
    }   
    ctx_1.clearRect(0,0,width,height);
    
    for (var i = 0; i < circle_arr.length; i++) {
        circle_arr[i].update();
        if (circle_arr[i].coords.x < 0 || circle_arr[i].coords.x > width   || 
            circle_arr[i].coords.y < 0 || circle_arr[i].coords.y > height || 
            (Math.abs(circle_arr[i].pos.dx) < 0.01 || Math.abs(circle_arr[i].pos.dy) < 0.01 ))  {
                circle_arr.splice(i, 1);
                circle_arr.push(new Circle(Math.random()* width, Math.random()* height));
        }
    }
}

function Circle(x,y) {
    this.pos = {
        dx: x - 0.5*width,
        dy: -1*y + 0.5*height
    }

    this.coords = {
        x: x,
        y: y
    }

    this.scope = {
        x:0,
        y:0
    }

    this.pos.dx /= scale;
    this.pos.dy /= scale;
    
    this.draw = function() {
        ctx_1.beginPath();
        ctx_1.arc(this.coords.x, this.coords.y, 2.5,0,10,false);
        ctx_1.strokeStyle = 'white';
        ctx_1.fillStyle = rand_colour;
        ctx_1.stroke(); 
        ctx_1.fill();
    }

    this.update = function() {

        this.scope.x = (this.coords.x - 0.5*width)/scale;
        this.scope.y = (-1*this.coords.y + 0.5*height)/scale;


        this.pos.dx = t_x.evaluate(this.scope);
        this.pos.dy = t_y.evaluate(this.scope);

        this.coords.x += this.pos.dx;
        this.coords.y -= this.pos.dy;

        this.draw();

    }
}

//draw_grid();