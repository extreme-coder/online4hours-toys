class Circle{
    constructor(x,y,col){
      this.x = x
      this.y = y
      this.col = col
    }
    
    draw(){
      fill(this.col)
      circle(this.x,this.y,22,22)
    }
  }