export class PathDrawer {
     constructor(xEqn, yEqn, context, scale) {
          this.xeqn = xEqn;
          this.yeqn = yEqn;
          this.context = context;
          this.scale = scale;
          this.width = context.canvas.width;
          this.height = context.canvas.height;
     }

     draw(x,y) {
          console.log(x,y);
          let xn, yn;
          let h = 0.05;
          this.context.strokeStyle = 'white';
          
          while (!this.isPathOutsideBox(x,y)) {
               const dx = h*math.evaluate(this.xeqn, {x: x/this.scale, y:y/this.scale})
               const dy = h*math.evaluate(this.yeqn, {x: x/this.scale, y:y/this.scale});

               if (this.isPathStopping(dx,dy)) {
                    break;
               }
               xn = x + dx;
               yn = y + dy;

               this.context.beginPath();
               this.context.moveTo(x,y);
               this.context.lineTo(xn, yn);
               this.context.stroke();

               x = xn;
               y = yn;

          }

     }

     updateEqns(eqns) {
          this.xeqn = eqns.x;
          this.yeqn = eqns.y;
     }

     isPathOutsideBox(x,y) {
          return x <= -1/2*this.width || x >= 1/2*this.width || y <= -1/2*this.height || y >= 1/2*this.height;
     }
     
     isPathStopping(dx,dy) {
          return Math.abs(dx) < 1/this.scale && Math.abs(dy) < 1/this.scale;
     }
}