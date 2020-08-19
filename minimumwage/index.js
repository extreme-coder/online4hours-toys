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

function createCurve(attribute) { 
    plotArr = []
    for (let i = 0; i < 30; i++) { 
        sum = 0
        for (let j = 0; j < 100; j++) { 
            sum += simulator(50, 50, 20, 90, i)[attribute]
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
    let qualities = createCurve("quality_of_life")
    console.log(qualities)
    qualityGraph = setupGraph("Effect of Minimum Wage on Worker's Quality of Life", 20, "Quality of Life(income-price ratio)", 10, 10, qualities)
}

function draw(){ 
    background(0)
    drawGraph(qualityGraph)
}