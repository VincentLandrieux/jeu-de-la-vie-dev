//---VARIABLE---//
// Actions
export let debug = false;
export let loopPause = true;
export let mouseX = 0;
export let mouseY = 0;
export let mousedown = false;
export let ctrl = false;


export function setLoopPause(_value){
    loopPause = _value;
}
let loopPauseCb = () => {};
export function setLoopPauseCb(_cb){
    loopPauseCb = _cb;
}

//---EVENT---//
window.addEventListener("keydown", (e) => {
    // console.log(e.key);

    // if(e.key == "ArrowUp")
    //     up = true;
    // if(e.key == "ArrowDown")
    //     down = true;
    // if(e.key == "ArrowLeft")
    //     left = true;
    // if(e.key == "ArrowRight")
    //     right = true;

    if(e.key == "Escape")
        debug = !debug;
    if(e.key == "Enter"){
        loopPauseCb();
    }
    if(e.key == "Control"){
        ctrl = true;
    }

});
window.addEventListener("keyup", (e) => {
    if(e.key == "Control"){
        ctrl = false;
    }

    // if(e.key == "ArrowUp")
    //     up = false;
    // if(e.key == "ArrowDown")
    //     down = false;
    // if(e.key == "ArrowLeft")
    //     left = false;
    // if(e.key == "ArrowRight")
    //     right = false;

});

window.addEventListener('mousedown', e => {
    mousedown = true;
});
window.addEventListener('mouseup', e => {
    mousedown = false;
});

window.addEventListener('mousemove', e => {
    mouseX = e.pageX;
    mouseY = e.pageY;
});