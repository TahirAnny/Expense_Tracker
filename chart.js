//SELECT CHART ELEMENT
const chart = document.querySelector(".chart");

//CREATE CANVAS ELEMENT
const canvas = document.createElement("canvas");
canvas.width = 50;
canvas.height = 50;

//APPEND CANVAS TO CHART ELEMENT
chart.appendChild(canvas);

//TO DRAW ON CANVAS, WE NEED TO GET CONTEXT OF CANVAS
const context = canvas.getContext("2d");

//CHANGE THE LINE WIDTH
context.lineWidth = 8;

//CREATE RADIUS
const R = 20;

function drawCircle(color, ratio, anticlockwise){
    context.strokeStyle = color;
    context.beginPath();
    context.arc(canvas.width/2, canvas.height/2, R, 0, ratio * 2 * Math.PI, anticlockwise);
    context.stroke();
}

function updateChart ( income, expense ){
    debugger;
    context.clearRect(0, 0, canvas.width, canvas.height);

    let ratio = income / (income + expense);

    drawCircle( "#FFFFFF", - ratio, true );
    drawCircle( "#F06240", 1 - ratio, false );
}