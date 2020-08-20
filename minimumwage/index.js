class Worker {
    constructor(minWage) { 
        this.skill = Math.floor(Math.random() * 10) + 20
        this.margin = Math.floor(Math.random() * 10)
        this.askWage = this.skill - this.margin
        if (this.askWage < minWage) { 
            this.askWage = minWage
            this.margin = this.skill - minWage
        }
        this.isEmployed = false
        this.quality = 0
    }

    employ() {
        this.isEmployed = true
    }

    qualityOfLife(price) { 
        if (this.isEmployed) {
            this.quality = this.askWage / price
        } else {
            this.quality = 0
        }
        return this.quality
    }
}

class EntryLevel extends Worker{ 
    constructor(minWage) {
        super(minWage)
        this.skill = Math.floor(Math.random() * 10) + 10
        this.margin = Math.floor(Math.random() * 10)
        this.askWage = this.skill - this.margin
        if (this.askWage < minWage) { 
            this.askWage = minWage
            this.margin = this.skill - minWage
        }
    }
}

function simulator(workNum, partNum, minEmployed, maxEmployed, minWage) { 
    //Create workers
    workers = []
    for (let i = 0; i < workNum; i++) { 
        workers.push(new Worker(minWage))
    }
    for (let i = 0; i < partNum; i++) { 
        workers.push(new EntryLevel(minWage))
    }
    //Employ workers
    let workerMargins = [...workers].sort((a, b) => { return a.margin - b.margin }).reverse()
    let hiredWorkers = []
    workerMargins.map((worker) => { 
         if (hiredWorkers.length >= maxEmployed) {
             return;
         } else if (hiredWorkers.length < minEmployed) {
             worker.employ()
             hiredWorkers.push(worker)
         } else if (worker.margin > 0) { 
             worker.employ()
             hiredWorkers.push(worker)
         }
    })
    //Determine price levels
    let skillSum = hiredWorkers.map((worker) => (worker.skill)).reduce((a, b) => (a + b))
    let wageSum = hiredWorkers.map((worker) => (worker.askWage)).reduce((a, b) => (a + b))
    let price = Math.round((wageSum / skillSum)*100)/100
    //Determine quality of life
    let qualities = workers.map((worker) => (worker.qualityOfLife(price)))
    let avgQuality = (Math.round(((qualities.reduce((a, b) => (a + b))) / workers.length)*100))/100
    //Misc stats
    let employed = hiredWorkers.length
    let avgWage = wageSum / employed
    let nonEntryWages = hiredWorkers.filter((worker) => (!(worker instanceof EntryLevel))).map((worker) => (worker.askWage))
    let nonEntryAvgWage = (nonEntryWages.reduce((a, b) => (a + b)))/nonEntryWages.length
    let wages = hiredWorkers.map((worker) => (worker.askWage))
    let natMinimum = Math.min(...wages)
    let nonEntryMinimum = Math.min(...nonEntryWages)
    let avgMargin = (hiredWorkers.map((worker) => (worker.margin)).reduce((a, b) => (a + b))) / employed
    let employmentRate = employed / workers.length

    return {
        employment: employmentRate,
        price_level: price,
        quality_of_life: avgQuality,
        average_wage: avgWage,
        average_experienced_wage: nonEntryAvgWage,
        natural_minimum_wage: natMinimum,
        natural_experienced_minimum_wage: nonEntryMinimum
    }
}

function setupGraph(title, yAxisLim, yAxisTitle, xPos, yPos, array) { 
    plot = new GPlot(this);
    plot.setPos(xPos, yPos);
    plot.setXLim(0, 30);
    plot.setYLim(0, yAxisLim);
    plot.getXAxis().getAxisLabel().setText("Minimum Wage");
    plot.getYAxis().getAxisLabel().setText(yAxisTitle);
    plot.getTitle().setText(title);
    plot.setPoints(array);
    plot.setLineColor(this.color(255, 0, 0));
    return plot
}

let workSlider
let partSlider
let minSlider
let maxSlider

function createCurve(attribute) { 
    plotArr = []
    for (let i = 0; i < 30; i++) { 
        sum = 0
        for (let j = 0; j < 100; j++) { 
            sum += simulator(workSlider.value(), partSlider.value(), (workSlider.value()+partSlider.value())*minSlider.value()/100, (workSlider.value()+partSlider.value())*maxSlider.value()/100, i)[attribute]
        }
        plotArr.push(new GPoint(i,sum/100))
    }
    return plotArr
}

function drawGraph(graph) { 
    graph.defaultDraw()
}

let qualityGraph = null

function setup(){ 
    createCanvas(1200, 800)
    workSlider = createSlider(0, 100, 50)
    workSlider.position(900, 50)
    partSlider = createSlider(0, 100, 50)
    partSlider.position(900, 100)
    minSlider = createSlider(1, 100, 20)
    minSlider.position(900, 150)
    maxSlider = createSlider(1, 100, 90)
    maxSlider.position(900,200)
}

function draw(){ 
    background(255)
    let qualities = createCurve("quality_of_life")
    let employments = createCurve("employment")
    let incomes = createCurve("average_wage")
    let prices = createCurve("price_level")
    qualityGraph = setupGraph("Effect of Minimum Wage on the Quality of Life of Workers", 20, "Quality of Life(income-price ratio)", 0, 0, qualities)
    employmentGraph = setupGraph("Effect of Minimum Wage on Employment", 1, "% Employed", 450, 0, employments)
    incomeGraph = setupGraph("Effect of Minimum Wage on Average Wages", 30, "Average Wage", 0, 300, incomes)
    priceGraph = setupGraph("Effect of Minimum Wage on Price Levels", 2, "Commodity Prices", 450, 300, prices)
    drawGraph(qualityGraph)
    drawGraph(employmentGraph)
    drawGraph(incomeGraph)
    drawGraph(priceGraph)
    textSize(15)
    text("Workers",1030,55)
    text("Entry Level Workers",1030,105)
    text("Minimum Employment %",1030,155)
    text("Maximum Employment %",1030,205)
}