export class Point {

     constructor(pos, rad, colour, context) {
          this.poisition = pos;
          this.radius = rad;
          this.colour = colour;
          this.context = context;
     }

     updatePosition(dx, dy) {

          this.poisition.x += dx;
          this.poisition.y += dy;
          this.draw();
     }

     draw() {
          this.context.fillStyle = this.colour;
          this.context.beginPath();
          this.context.arc(this.poisition.x, this.poisition.y, this.radius, 0, 2*Math.PI);
          this.context.stroke(); 
          this.context.fill();
     }

     resetPoint(pos) {
          this.poisition = pos;
          this.dx = 0;
          this.dy = 0;
     }

     getPosition() {
          return this.poisition;
     }

};