//---IMPORT---//
import canvas from "./utils/canvas.js";

import { 
    debug, loopPause, setLoopPause, setLoopPauseCb, 
    mouseX, mouseY, mousedown, ctrl
} from "./utils/inputs.js";


//---VARIABLE---//
// ASSETS //
const assetUrl = `${location.pathname.split("/").slice(1, -1).join("/")}/assets`;
console.log(assetUrl);
const optionsSvg = `${assetUrl}/images/icons/options.svg`;
const deleteSvg = `${assetUrl}/images/icons/delete.svg`;

// HTML Element //
const playBtn = {
    el: document.getElementById("play-btn"),
    state: false,
    init: function(){
        this.textEl = this.el.querySelector(".btn_text"),

        this.el.addEventListener("click", e => {
            if(this.state){
                this.pause();
            }else{
                this.play();
            }
        });
    },
    play: function(){
        this.state = true;
        this.textEl.innerText = "Pause";
        setLoopPause(false);
    },
    pause: function(){
        this.state = false;
        this.textEl.innerText = "Play";
        setLoopPause(true);
    },
}

const optionsBtn = {
    el: document.getElementById("options-btn"),
    containerEl: document.getElementById("options-container"),

    state: false,

    init: function(){
        this.imgEl = this.el.querySelector("img"),

        this.el.addEventListener("click", e => {
            if(this.state){
                this.close();
            }else{
                this.open();
            }
        });
    },
    open: function(){
        this.state = true;
        this.containerEl.classList.remove("hide");
        this.imgEl.src = deleteSvg;
    },
    close: function(){
        this.state = false;
        this.containerEl.classList.add("hide");
        this.imgEl.src = optionsSvg;
    },
}

const nextBtn = {
    el: document.getElementById("next-btn"),

    init: function(){
        this.el.addEventListener("click", e => {
            nextWorldStep();
        });
    },
}

// loops
let physicLoop = null;
const RATE = 60; // 60
const FRAMERATE = 1000 / RATE;
let physicLoopEnd = false;
let physicLoopTime = null;


let renderLoop = null;
let renderTimePrev = null;


const worldWidth = 150;
const worldHeight = 50;
let world = createEmptyWorld(worldWidth, worldHeight);
const cellColor = "#F65946";
const cursorCellColor = "#FFFFFF88";
let cellSize;
let cellStartX;
let cellStartY;
let cellEndX;
let cellEndY;


//---MAIN---//
////
//
world[0][1] = 1; // y | x
world[1][1] = 1;
world[2][1] = 1;

world[5][10] = 1;
world[6][10] = 1;
world[7][11] = 1;
world[4][12] = 1;
world[5][13] = 1;
world[6][13] = 1;


world[9][19] = 1;
world[8][18] = 1;
world[10][17] = 1;
world[10][18] = 1;
world[10][19] = 1;

world[47][98] = 1;
world[48][98] = 1;
world[49][98] = 1;
//
////


playBtn.init();
optionsBtn.init();
nextBtn.init();

canvas.init();

setLoopPauseCb(() => {
    if(loopPause){
        playBtn.play();
    }else{
        playBtn.pause();
    }
});


window.addEventListener('resize', setSize, false);


setSize();

// start physic loop
update();

// start render loop
renderTimePrev = performance.now();
render(renderTimePrev);


//---FUNCTION---//
function setSize(){
    cellSize = Math.floor(Math.min(canvas.el.width / worldWidth, canvas.el.height / worldHeight));
    cellStartX = Math.floor((canvas.el.width / 2) - ((worldWidth / 2) * cellSize));
    cellStartY = Math.floor((canvas.el.height / 2) - ((worldHeight / 2) * cellSize));
    cellEndX = (worldWidth * cellSize) + cellStartX;
    cellEndY = (worldHeight * cellSize) + cellStartY;
}

// loops
function stopRender() {
    cancelAnimationFrame(renderLoop);
    renderLoop = null;
}
function render(t) {
    renderLoop = requestAnimationFrame(render);

    // if(loopPause)
    //     stopRender();

    const deltaT = t - renderTimePrev;
    renderTimePrev = t;
    

    if(physicLoopEnd || physicLoopTime < FRAMERATE){
        // console.log(deltaT);
        canvas.draw();


        // WORLD //
        world.forEach((_line, _y) => {
            _line.forEach((_value, _x) => {
                // console.log(_value, _x, _y);

                if(_value){
                    canvas.ctx.fillStyle = cellColor;
                    canvas.ctx.fillRect(cellStartX + (_x * cellSize), cellStartY + (_y * cellSize), cellSize, cellSize);
                }else{

                }
            });
        });


        // CURSOR //
        const canvasRect = canvas.el.getBoundingClientRect();
        const mX = mouseX - canvasRect.left - window.scrollX - cellStartX;
        const mY = mouseY - canvasRect.top - window.scrollY - cellStartY;

        if(
            mX > 0 
            && mX < (cellEndX - cellStartX) 
            && mY > 0 
            && mY < (cellEndY - cellStartY)

            && !optionsBtn.state
        ){
            const indexX = Math.floor(mX / cellSize);
            const indexY = Math.floor(mY / cellSize);
            const x = cellStartX + (indexX * cellSize);
            const y = cellStartY + (indexY * cellSize);

            canvas.ctx.fillStyle = cursorCellColor;
            canvas.ctx.fillRect(x, y, cellSize, cellSize);

            if(mousedown){
                if(ctrl){
                    world[indexY][indexX] = 0;
                }else{
                    world[indexY][indexX] = 1;
                }
            }
        }


        const borderSize = 2;
        const longSize = cellSize + borderSize;
        canvas.ctx.fillStyle = "#FFFFFF";
        canvas.ctx.fillRect(cellStartX - borderSize, cellStartY - borderSize, longSize, borderSize);
        canvas.ctx.fillRect(cellStartX - borderSize, cellStartY - borderSize, borderSize, longSize);

        canvas.ctx.fillRect(cellEndX + borderSize - longSize, cellStartY - borderSize, longSize, borderSize);
        canvas.ctx.fillRect(cellEndX, cellStartY - borderSize, borderSize, longSize);

        canvas.ctx.fillRect(cellStartX - borderSize, cellEndY, longSize, borderSize);
        canvas.ctx.fillRect(cellStartX - borderSize, cellEndY - longSize + borderSize, borderSize, longSize);

        canvas.ctx.fillRect(cellEndX, cellEndY - longSize + borderSize, borderSize, longSize);
        canvas.ctx.fillRect(cellEndX - longSize + borderSize, cellEndY, longSize, borderSize);


        if(debug){
            const fps = Math.round(1000 / deltaT);

            const indexX = Math.floor(mX / cellSize);
            const indexY = Math.floor(mY / cellSize);
    
            canvas.ctx.fillStyle = "#fff";
            canvas.ctx.font = "16px sans-serif";
            canvas.ctx.fillText(`fps: ${fps}`, 10, 30);
            canvas.ctx.fillText(`looptime: ${physicLoopTime}`, 10, 60);
            canvas.ctx.fillText(`mouse: ${mX}, ${mY}`, 10, 90);
            canvas.ctx.fillText(`index: ${indexX}, ${indexY}`, 10, 120);
        }
    }

}
function stopUpdate(){
    clearTimeout(physicLoop);
    physicLoop = null;
}
function update(){
    physicLoop = setTimeout(function() {
        if(!loopPause){
            if(!renderLoop)
                render(performance.now());

            physicLoopEnd = false;
            const tStart = performance.now();
            

            nextWorldStep();
        

            const tEnd = performance.now();
            physicLoopTime = tEnd - tStart;
            physicLoopEnd = true;
        }

        update();
    }, FRAMERATE);
}

function nextWorldStep(){
    const tempWorld = createEmptyWorld(worldWidth, worldHeight);

    world.forEach((_line, _y) => {
        _line.forEach((_value, _x) => {
            // console.log(_value, _x, _y);

            const lifeCells = countLifeCells(_x, _y, world);

            // if(lifeCells > 0){
            //     tempWorld[_y][_x] = 1;
            // }

            if(_value){
                if(!(lifeCells != 2 && lifeCells != 3)){
                    tempWorld[_y][_x] = 1;
                }
            }else{
                if(lifeCells == 3){
                    tempWorld[_y][_x] = 1;
                }
            }
        });
    });

    world = tempWorld;
}


function createEmptyWorld(_width, _height){
    const world = [];

    for(let _y = 0; _y < _height; _y++){
        const line = [];
        
        for(let _x = 0; _x < _width; _x++){
            line.push(0);
        }

        world.push(line);
    }

    return world;
}

function countLifeCells(_x, _y, _world){
    let count = 0;

    // 1 2 3
    // 4 0 5
    // 6 7 8
    const index = {
        1: [_x-1, _y-1],
        2: [_x, _y-1],
        3: [_x+1, _y-1],
        4: [_x-1, _y],
        5: [_x+1, _y],
        6: [_x-1, _y+1],
        7: [_x, _y+1],
        8: [_x+1, _y+1],
    };

    if(!(_x - 1 >= 0)){
        delete index[1];
        delete index[4];
        delete index[6];
    }
    if(!(_x + 1 < _world[_y].length)){
        delete index[3];
        delete index[5];
        delete index[8];
    }
    if(!(_y - 1 >= 0)){
        delete index[1];
        delete index[2];
        delete index[3];
    }
    if(!(_y + 1 < _world.length)){
        delete index[6];
        delete index[7];
        delete index[8];
    }

    for(const i in index){
        if(_world[index[i][1]][index[i][0]]){
            count++;
        }
    }

    return count;
}