let gen
let dom
let mixed
let time
let repRate
let popOverTime
let circleArr
let plot
let autoPlay = false
let counter = 0

function setup() {
  createCanvas(960, 930);
  gen = 0
  dom = 33
  mixed = 34
  rec = 33
  time = 40
  repRate = 0.50
  popOverTime = geneticDrift(dom, mixed, rec, time, repRate)
  console.log(popOverTime)
  circleArr = []
  
  for(i=0; i<popOverTime[gen].dom; i++){
    let x = Math.floor(Math.random()*888)
    let y = Math.floor(Math.random()*398)+96
    circleArr.push(new Circle(x,y,color(153, 0, 0)))
  }
  for(i=0; i<popOverTime[gen].mixed; i++){
    let x = Math.floor(Math.random()*888)
    let y = Math.floor(Math.random()*398)+96
    circleArr.push(new Circle(x,y,color(153, 153, 153)))
  }
  for(i=0; i<popOverTime[gen].rec; i++){
    let x = Math.floor(Math.random()*888)
    let y = Math.floor(Math.random()*398)+96
    circleArr.push(new Circle(x,y,color(17, 85, 204)))
  }

 
}

function graph() {
  var currentPop = popOverTime.slice(0, gen)
  //Add Points
  domPoints = currentPop.map((pop,i)=>{
    return new GPoint(i+1,pop.dom+pop.mixed+pop.rec)
  })
  mixedPoints = currentPop.map((pop,i)=>{
    return new GPoint(i+1,pop.mixed+pop.rec)
  })
  recPoints = currentPop.map((pop,i)=>{
    return new GPoint(i+1,pop.rec)
  })

  //Setup Graph
  plot = new GPlot(this);
  plot.setPos(0, 600);
  plot.setXLim(1, time);
  plot.setYLim(0, dom+mixed+rec);
  plot.getXAxis().getAxisLabel().setText("Time (in generations)");
  plot.getYAxis().getAxisLabel().setText("Population Demographics");
  plot.getTitle().setText("Effects of Genetic Drift");
  plot.setPoints(domPoints);
  plot.setLineColor(this.color(153, 0, 0));
  plot.addLayer("layer 1", mixedPoints);
  plot.getLayer("layer 1").setLineColor(this.color(153, 153, 153));
  plot.addLayer("layer 2", recPoints);
  plot.getLayer("layer 2").setLineColor(this.color(17, 85, 204));
}

function reproduce(d,m,r){
  let dPhen = 2*d+m
  let rPhen = 2*r+m
  let totalPhen = dPhen+rPhen
  let dPer = dPhen/totalPhen
  let rPer = rPhen/totalPhen
  return {
    dom: dPer**2,
    mixed: 2*dPer*rPer,
    rec: rPer**2
  }
}

function geneticDrift(dom,mixed,rec,time,repRate){
  //Define size of population
  let size = dom+mixed+rec
  
  //Define population and population histogram
  let pop = {
    dom: dom,
    mixed: mixed,
    rec: rec
  }
  let popOverTime = []
  
  //Loop through generations
  for(let i=0; i<time; i++){
    //Add current population to histogram
    popOverTime.push(pop)
    
    //Determine how many survived of each phenotype
    let srvDom = 0
    let srvMixed = 0
    let srvRec = 0
    for(let i=0; i<Math.floor(size*repRate); i++){
      r = Math.random()*size
      if (r<pop.dom) {
         srvDom++
      } else if (pop.dom<=r<pop.dom+pop.mixed) {
         srvMixed++
      } else if (pop.dom+pop.mixed<=r<size) {
         srvRec++
      } else {
        return 'value error'
      }
    }
    
    //Determine new generation after surviving generation reproduces
    let newPop = reproduce(srvDom, srvMixed, srvRec)
    pop = {
      dom: Math.floor((newPop.dom)*size),
      mixed: Math.floor((newPop.mixed)*size),
      rec: Math.floor((newPop.rec)*size),
    }
  }
  
  //Return histogram of population
  return popOverTime
}

function updateCircles() {
  circleArr = []
  for(i=0; i<popOverTime[gen].dom; i++){
    let x = Math.floor(Math.random()*888)
    let y = Math.floor(Math.random()*398)+96
    circleArr.push(new Circle(x,y,'#990000ff'))
  }
  for(i=0; i<popOverTime[gen].rec; i++){
    let x = Math.floor(Math.random()*888)
    let y = Math.floor(Math.random()*398)+96
    circleArr.push(new Circle(x,y,'#1155ccff'))
  }
  for(i=0; i<popOverTime[gen].mixed; i++){
    let x = Math.floor(Math.random()*888)
    let y = Math.floor(Math.random()*398)+96
    circleArr.push(new Circle(x,y,'#999999ff'))
  }
}

function keyPressed(){
  switch (keyCode) {
    case LEFT_ARROW:
      if (gen > 0) {
        gen--
        console.log(gen)
        updateCircles()
      }
      break;
    case RIGHT_ARROW:
      if (gen < time - 1) {
        gen++
        updateCircles()
        break;
      }
  }
  
  console.log(circleArr)
}

function mousePressed() {
  if (480 <= mouseX <= 696 || 615 <= mouseY <= 687) {
    popOverTime = geneticDrift(dom, mixed, rec, time, repRate)
    console.log(popOverTime)
    gen = 0
    autoPlay=true
  }
}

function draw() {
  //Autoplay 
  if (autoPlay) {
    counter++
    if (counter > 20 && gen < time - 1) {
      gen++
      updateCircles()
      counter = 0
      console.log(circleArr)
    }
  }

  //Background
  background(0);
  
  //Box for Statistics
  fill('#b7b7b7ff')
  stroke(0)
  //rect(24,614,192,82)
  
  //Boxes for Legend
  fill('#990000ff')
  rect(696,776,24,24)
  fill('#1155ccff')
  rect(696,824,24,24)
  fill('#999999ff')
  rect(696,872,24,24)
  
  //Title
  textSize(48)
  textAlign(CENTER)
  fill(255)
  text('Genetic Drift: A Simulation',480,48)
  
  //Statistics
  textSize(15)
  textAlign(LEFT)
  text(('Population Size: '+(dom+mixed+rec).toString()),725,635)
  text('Reproduction Rate: '+(repRate*100).toString()+'%',725,660)
  text('Generation: '+(gen+1).toString()+'/'+time.toString(),725,685)
  
  //Legend
  textSize(17)
  text('Phenotype A - Dominant',725,794)
  text('Phenotype B - Recessive',725,842)
  text('Mixed',725,890)
  
  //Circles
  circleArr.map((circle)=>{
    circle.draw()
  })

  //Play Button
  fill(0)
  stroke(255)
  rect(480, 615, 216, 72)
  fill(255)
  triangle(573,633,573,669,603,651)

  //Graph
  graph()
  plot.beginDraw();
  plot.drawBackground();
  plot.drawBox();
  plot.drawXAxis();
  plot.drawYAxis();
  plot.drawTopAxis();
  plot.drawRightAxis();
  plot.drawTitle();
  plot.drawFilledContours(GPlot.HORIZONTAL, 0.05);
  plot.drawLabels();
  plot.endDraw();
}