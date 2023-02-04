export class Point {

     constructor(pos, rad, colour, context) {
          this.poisition = pos;
          // this.velocity = vel;
          this.radius = rad;
          this.colour = colour;
          this.context = context;
          // this.eqn = eqn;
     }

     updatePosition(dx, dy) {
          // const dx = math.evaluate(this.eqn.x, this.poisition);
          // const dy = math.evaluate(this.eqn.y, this.poisition);

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

     getPosition() {
          return this.poisition;
     }

};