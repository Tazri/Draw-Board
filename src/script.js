// create app object
app = {};

// track element
app.canvas = document.getElementById('canvas');

app.lineWidth = {
    showWidth : document.querySelector('.number'),
}

app.button  = {
    up : document.querySelector('.up'),
    down : document.querySelector('.down')
}

app.color = {
    line : {
        lineColorInput : document.getElementById('line-color')
    },
    background : {
        backgroundColorInput : document.getElementById('background-color')
    }
}

app.tool = {
    penTool : {
        pen : document.getElementById('pen')
    },
    earserTool : {
        eraser : document.getElementById('eraser')
    }
}

app.otherObject = {
    body : document.body,
}

// nessecary variable inside app object
// and set intial value
app.lineWidth.size = 10;
app.color.background.color = 'aliceblue';
app.color.line.color = 'black';
app.tool.penTool.active = true;
app.tool.earserTool.active = false;
app.draw = {
    contex : app.canvas.getContext('2d'),
    x : undefined,
    y : undefined,
    isPressed : false
};

// set button function
app.lineWidth.changeSize = type=>{
    let{
        showWidth:span,
    } = app.lineWidth;

    // down the line width size
    if(type == 'down'){
        app.lineWidth.size = app.lineWidth.size === 1 ? app.lineWidth.size : --app.lineWidth.size;       
    }else{
        // up the line width size
        app.lineWidth.size++;
    }

    span.innerText = app.lineWidth.size;
}

// set tool change function
app.tool.changeTool = (type)=>{
    const {
        penTool : {pen},
        earserTool : {eraser}
    } = app.tool;

    if(type =='pen'){
        pen.classList.add('active');
        eraser.classList.remove('active');
        app.tool.penTool.active = true;
        app.tool.earserTool.active = false;
    }else{
        eraser.classList.add('active');
        pen.classList.remove('active');
        app.tool.earserTool.active = true;
        app.tool.penTool.active = false;
    }
}

// change color funciton
app.color.changeColor = (type)=>{
    let {
        canvas,
        color : {
            line : {lineColorInput:line},
            background : {backgroundColorInput:background}
        }
    } = app;
        
    // change the line color
    if(type == 'line'){
        app.color.line.color = line.value;
        console.log(app.color.line.color);
    }else{
        // change the background color
        app.color.background.color = background.value;
        canvas.style.backgroundColor = background.value;
    }

}

// circle draw function
app.draw.drawCircle = (x,y)=>{
    const {
        contex
    } = app.draw

    // color and size
    let isPenActive = app.tool.penTool.active;
    let color =  app.color.line.color;
    let size = app.lineWidth.size;

    // draw circle
    
    // contex.fill();

    if(isPenActive){
        contex.beginPath();
        contex.arc( x,  y, 0.5*size, 0, 2 * Math.PI);
        contex.fillStyle = color;
        contex.fill();
    }else{
        contex.save();
        contex.globalCompositeOperation = 'destination-out';
        contex.beginPath();
        contex.arc(x, y, 0.5*size, 0, 2 * Math.PI, false);
        contex.fill();
        contex.restore();
    }
}

// draw line funciton
app.draw.drawLine = (xOne,yOne,xTwo,yTwo)=>{
    const {contex} = app.draw;

    // color
    let isPenActive = app.tool.penTool.active;
    let color = app.color.line.color ;
    let size = app.lineWidth.size;

    // draw line
    if(isPenActive){
        contex.beginPath();
        contex.moveTo(xOne,yOne);
        contex.lineTo(xTwo,yTwo);
        contex.strokeStyle = color;
        contex.lineWidth =  size;
        contex.stroke();
    }else{
        contex.save();
        contex.globalCompositeOperation = 'destination-out';
        contex.beginPath();
        contex.moveTo(xOne,yOne);
        contex.lineTo(xTwo,yTwo);
        contex.lineWidth = size;
        contex.stroke();
        contex.restore();
    }
}

// mouseDown function
app.draw.mouseDown = event=>{
    // set the isPressed , set position and draw circle
    app.draw.isPressed = true;
    app.draw.x = event.offsetX;
    app.draw.y = event.offsetY;
    app.draw.drawCircle(app.draw.x,app.draw.y);
}

// mouseMove function
app.draw.mouseMove = event=>{
   if(app.draw.isPressed){
        let {
            drawCircle,
            drawLine
        } = app.draw

        // find the position and draw the circle and line
        let xTwo = event.offsetX;
        let yTwo = event.offsetY;
        drawCircle(xTwo,yTwo);
        drawLine(app.draw.x,app.draw.y,xTwo,yTwo);

        // reset the position
        app.draw.x = xTwo;
        app.draw.y = yTwo;
   }
}

// mouseUp function and set isPressed to false
app.draw.mouseUp = event=>{
    app.draw.isPressed = false;
    app.draw.x = undefined;
    app.draw.y = undefined;
}

// mouseLeave function
app.draw.mouseLeave = event=>{
    app.draw.x = undefined;
    app.draw.y = undefined;
}

// touchStart function
app.draw.touchStart = event =>{
    let {
        drawCircle,
    } = app.draw
    // console.log(event);
    // press is true and find the x and y
    app.draw.isPressed = true;
    let domRect = event.target.getBoundingClientRect();

    let xTwo = event.touches[0].clientX - domRect.x;
    let yTwo = event.touches[0].clientY - domRect.y;

    // update position
    app.draw.x = xTwo;
    app.draw.y = yTwo;

    // draw the circle
    drawCircle(app.draw.x,app.draw.y);
}

// touchMove functon
app.draw.touchMove = event =>{
    let {
        drawCircle,
        drawLine
    } = app.draw;

    // dom rect
    let domRect = event.target.getBoundingClientRect();

    // find the x and y position
    let xTwo = event.touches[0].clientX - domRect.x;
    let yTwo = event.touches[0].clientY - domRect.y;

    // draw circle and line
    drawCircle(xTwo,yTwo);
    drawLine(app.draw.x,app.draw.y,xTwo,yTwo);
    
    // update the position
    app.draw.x = xTwo;
    app.draw.y = yTwo;
}

// touchEnd function 
app.draw.touchEnd = event =>{
    app.draw.isPressed = false;
}

// resize the canvas function
app.draw.resizeCanvas = ()=>{
    app.canvas.width = app.canvas.clientWidth;
    app.canvas.height = app.canvas.clientHeight;
}

// all event listener funciton
let {
    lineWidth : {changeSize},
    tool : {changeTool},
    color: {changeColor},
    draw: {
        mouseDown,
        mouseMove,
        mouseUp,
        mouseLeave,
        touchStart,
        touchMove,
        touchEnd,
        resizeCanvas
    }
} = app;

// all mouse event
// add event listener on button
app.button.down.addEventListener('click',()=>changeSize('down'));
app.button.up.addEventListener('click',changeSize);

// add event listener on tool
app.tool.penTool.pen.addEventListener('click',()=>changeTool('pen'));
app.tool.earserTool.eraser.addEventListener('click',changeTool);

// add event listener on color input
app.color.line.lineColorInput.addEventListener('change',()=>changeColor('line'));
app.color.background.backgroundColorInput.addEventListener('change',changeColor);

// add mouse event lisner on canvas
// mouse down event
app.canvas.addEventListener('mousedown',mouseDown)

// mouse down event
app.canvas.addEventListener('mousemove',mouseMove);

// mouse up event
app.canvas.addEventListener('mouseup',mouseUp);

// mouse leave event
app.canvas.addEventListener('mouseleave',mouseLeave);

// mouse hold out
app.otherObject.body.addEventListener('mouseup',mouseUp);

// add touch event on canvas
app.canvas.addEventListener('touchstart',touchStart);
app.canvas.addEventListener('touchmove',touchMove);
app.canvas.addEventListener('touchend',touchEnd);

// responsvie the canvas
window.addEventListener('resize',resizeCanvas);

// call initial function
resizeCanvas();
