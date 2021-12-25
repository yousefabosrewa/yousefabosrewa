class Ball{
    
    
    constructor(positionP, velocityP, accelerationP, radiusP, contextP, colorP){
        
        this.radius = radiusP;
        this.context = contextP;
        this.color = colorP; 
        

        this.colliding = false;
        this.collidingColor = "yellow";
        
        
        this.friction = 0.97;
        this.mass = 1;
        
        this.position = {
            x: positionP.x,
            y: positionP.y
        }
        
        this.velocity = {
            x: velocityP.x,
            y: velocityP.y
        }
        
        this.acceleration = {
            x : 0,
            y : accelerationP/60
        }
    }
    
    draw(){
        
        if(this.colliding) this.context.fillStyle = this.collidingColor;
        else this.context.fillStyle = this.color; 
            
        this.context.beginPath();
        this.context.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI);
        this.context.fill();
    }
    
    move(){
               
        this.velocity.x += this.acceleration.x;
        this.velocity.y = this.velocity.y + this.acceleration.y;


        this.position.x += this.velocity.x;
        this.position.y -= this.velocity.y;
        
    }
}



//screen labels
let fpsInd = document.getElementById("fpsIndicator");
let mouseInd = document.getElementById("mouse");
let hypIndicator = document.getElementById("hypotenuse");
let oppIndicator = document.getElementById("opp");
let adjIndicator = document.getElementById("adj");
let thetaIndicator = document.getElementById("theta");


let manualLauncherBtn = document.getElementById("launchManual");
let manualVelocity = document.getElementById("mVelocity");
let manualAngle = document.getElementById("mAngle");

var strThetaChar = thetaIndicator.innerHTML.split(" ")[0];
var currentThetaRadians;

var CANVAS_CLICKED = false;
let canvas = document.getElementById("area");
let ctx = canvas.getContext("2d");

var frames = 0;
var fps = 0;
var lastCallTime;

let Balls = [];

/////////////////////////motion variables//////////
let velocity_initial;
let angle;
let time;


//VERTICAL 
let y_velocity_original = 0;
let y_velocity_final = 0;
let y_original = 0;
let y_final = 0;
let y_acceleration = 0;
let max_height = 0;


//HORIZONTAL 
let x_velocity_original = 0;
let x_velocity_final = 0;
let x_original = 0;
let x_final = 0;
let x_acceleration = 0;




canvas.addEventListener('mousemove', (event)=>{
    updateMouse(event);
    solveTriangle();
});

canvas.addEventListener('click', () => {
   CANVAS_CLICKED = true;    
   MotionMain(ctx); 
});

manualLauncherBtn.addEventListener('click', () => {
   performManuaLaunch(); 
});

var origin = {
    x: 0,
    y: canvas.height
}

var originBalls = {
    x: 0,
    y: canvas.height-1
}

var mousePosition = {
    x: 0,
    y: 0
}




window.requestAnimationFrame(loop);
function loop() {
      
  frames ++;
  getFPS();
    
  console.log(CANVAS_CLICKED);    
    
  if(frames % 3 == 0) 
    fpsInd.innerHTML = "FPS: "+fps;      

  clearScreen();    
  workNextFrame();    
    

  CANVAS_CLICKED = false;    
    
  window.requestAnimationFrame(loop);  
}

//motion functions
function MotionMain(ctx){      
        
    y_acceleration = parseFloat(y_acceleration);  
    solveProblem();
    showLaunchData();
    
    newBall();
}

function performManuaLaunch(){    
    let launchData = createManualBall();
    let {ball, velocities, maxHeight, s, t} = launchData;
           
    showManualData(velocities, t, maxHeight, s);  
    Balls.push(ball);
}

function showManualData(velocities, t, maxHeight, s){
    let a = document.getElementById("acceleration").value;
    
    document.getElementById('velocity').value = manualVelocity.value;
    document.getElementById('launchAngle').value = manualAngle.value;
    document.getElementById('Yvel').value = velocities.y.toFixed(2);
    document.getElementById('Xvel').value = velocities.x.toFixed(2);
    document.getElementById('time').value = parseFloat(t).toFixed(2);
    document.getElementById('mHeight').value = parseFloat(maxHeight).toFixed(2);
    document.getElementById('Xdisplacement').value = parseFloat(s).toFixed(2);
    document.getElementById('yAcceleration').value = a;
}

function createManualBall(){
    let mTime, mDisplacementX, mMaxHeight, mBall;
    
    let m_angle = parseFloat(manualAngle.value);
    let m_vel = parseFloat(manualVelocity.value);
    
    let velY = Math.sin( (m_angle * Math.PI) / 180) * m_vel;
    let velX = Math.cos( (m_angle * Math.PI) / 180) * m_vel;
    
        
    let accelerationY = parseFloat(document.getElementById("acceleration").value);
    
    // 1- get the time -> Vf=Vo+at --> t=Vo-Vf/a
    mTime = Math.abs( velY / accelerationY )*2;
    mTime = mTime.toFixed(3);
    
    // 2- get the range -> Xf=Vo*t
    mDisplacementX = (velX * mTime).toFixed(0);
    
    // 3- get the maximum height -> Vo*Vo/2*a
    mMaxHeight = Math.abs( (velY*velY) / ( 2 * accelerationY ) ).toFixed(2);
    
    mBall = new Ball(originBalls, {
        x: velX,
        y: velY
    }, accelerationY,10, ctx, "yellow");
    
    return {
        t: mTime,
        s: mDisplacementX,
        maxHeight: mMaxHeight,
        velocities: {x: velX, y: velY},
        ball: mBall
    }
}


function solveProblem(){
    
    time = 0;
    x_final = 0;
    max_height = 0;
        
    // 1- get the time -> Vf=Vo+at --> t=Vo-Vf/a
    time = Math.abs( (y_velocity_original - y_velocity_final) / y_acceleration )*2;
    time = time.toFixed(3);
    
    // 2- get the range -> Xf=Vo*t
    x_final = (x_velocity_original * time).toFixed(0);
    
    // 3- get the maximum height -> Vo*Vo/2*a
    max_height = Math.abs( (y_velocity_original*y_velocity_original) / (2*y_acceleration) ).toFixed(2);  
    
    //alert("time: "+time+"s range: "+x_final+"m Max.Height: "+max_height+"m");
}

function showLaunchData(){
    document.getElementById('velocity').value = velocity_initial;
    document.getElementById('launchAngle').value = angle;
    document.getElementById('Yvel').value = y_velocity_original;
    document.getElementById('Xvel').value = x_velocity_original;
    document.getElementById('time').value = time;
    document.getElementById('mHeight').value = max_height;
    document.getElementById('Xdisplacement').value = x_final;
    document.getElementById('yAcceleration').value = y_acceleration;
}

function newBall(){
    
    if(!CANVAS_CLICKED) return;
    
    let c;
    
    
    
    if(angle <= 30) c = "red";
    else if(angle <= 45 && angle > 30) c = "green";
    else if(angle <= 60 && angle > 45) c = "blue";
    else if(angle <= 90 && angle > 60) c = "black";
    
    
    //c = randomColor();
      
    var ball = new Ball( originBalls, {
        x: x_velocity_original,
        y: y_velocity_original
    }, y_acceleration, 8, ctx, c);
    
    
    Balls.unshift(ball);
}

function randomColor(){
    let colors = ['red','cyan','blue','Dark Blue','Light Blue','Purple','Lime','Magenta','silver','gray','green','orange','brown','maroon'];
    return colors[randomInteger(0,colors.length)];
}
function randomInteger(min, max){
    return Math.floor(Math.random() * (max-min+1) + min);
}
/////////////////////////////////////////

function workNextFrame(){
    drawVectorTip(); 
    drawVectorLine(); 
    
    drawAngleIcon();
    drawAngleArc();
    
    
    updateBalls();
    cleanBalls();
    
    if(Balls.length > 1) checkCollisions();
}

function updateBalls(){
    for(let i = Balls.length-1 ; i >= 0; i--){       
        Balls[i].draw();
        Balls[i].move();
    }
}

function cleanBalls(){
    
    let BallsCopy = Balls;
        
    for(let i = Balls.length-1; i >= 0; i--){       
        let ball = Balls[i];
        if(ball.position.y > canvas.height){
            BallsCopy = Balls.filter( (ball) => {
                return ball.position.y <= canvas.height     
            });
        }        
    }
    
    Balls = BallsCopy;
    
    document.getElementById("ballCount").innerHTML = "NºBalls: "+Balls.length;
}

function drawVectorTip(){
    
    var img = document.getElementById("tip");
    
    ctx.save();
    
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(-currentThetaRadians);
    
    ctx.drawImage(img, mousePosition.x, mousePosition.y, 40, 40);
    
    ctx.restore();
}



function drawAngleArc(){
    
    ctx.beginPath();
    ctx.arc(origin.x, origin.y, 30, 0, -currentThetaRadians, true);
    ctx.stroke(); 
    
    //document.getElementById("currentRads").innerHTML = currentThetaRadians.toFixed(3);
}

function solveTriangle(){
    var opp = Math.floor(canvas.height - mousePosition.y);
    var adj = Math.floor(mousePosition.x);
    var hyp = Math.floor(Math.sqrt( opp*opp + adj*adj ));
    
    var thetaRadians = Math.atan(opp/adj);
    var thetaDegrees = (thetaRadians*180)/Math.PI;
    
    currentThetaRadians = thetaRadians;
    
    oppIndicator.innerHTML = `Opposite: ${opp}`;
    adjIndicator.innerHTML = `Adjacent: ${adj}`;
    hypIndicator.innerHTML = `Hypotenuse: ${hyp}`;
    
    thetaIndicator.innerHTML = strThetaChar+" "+thetaDegrees.toFixed(2)+"º";
    
    
    passMotionData(opp, adj, hyp, thetaDegrees);  
}

function passMotionData(opp, adj, hyp, thetaDegrees){
    
    velocity_initial = hyp;
    angle = thetaDegrees.toFixed(2);
    time = null; 
    
    y_velocity_original = opp;
    y_velocity_final = 0;
    y_original = canvas.height;
    y_final = canvas.height;
    y_acceleration = document.getElementById("acceleration").value;
    max_height = null;
    
    x_velocity_original = adj;
    x_velocity_final = 0;
    x_original = 0;
    x_final = null;
    x_acceleration = 0;     
}

function drawVectorLine(){
    
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(mousePosition.x, mousePosition.y);
    ctx.stroke();
    
}

function drawAngleIcon(){
  var img = document.getElementById("angle");
  ctx.drawImage(img, origin.x+5, origin.y-14, 10, 10);
}

function clearScreen(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateMouse(event){
  var rect = event.target.getBoundingClientRect();
     
  mousePosition.x = event.clientX - rect.left; //x position within the element.
  mousePosition.y = event.clientY - rect.top;  //y position within the element.
    
  mouseInd.innerHTML = `X: ${mousePosition.x.toFixed(0)}  Y: ${mousePosition.y.toFixed(0)}`;
}


function checkCollisions(){
    
    let first, second;
    let p = 0;
    let stopInnerLoop = false;;
    
    if(Balls.length < 2) return;
    
    for(let i = 0; i < Balls.length; i++){   
        
        first = Balls[i];
        stopInnerLoop = false;
        p = 0;
        
        while(p < Balls.length && !stopInnerLoop){        
            second = Balls[p];
            
            if(i != p){
               if(distance(first, second) < first.radius + second.radius){
                 first.colliding = true;  
                 second.colliding = true;   
                 resolveCollision(first, second);
                 stopInnerLoop = true;  
               }
               else{
                 first.colliding = false;
                 second.colliding = false;   
               }  
                   
            } 
            
            p++;
        }
    }
    
    updateCollisionsCounter();
}

function distance(first, second){
    let diffX = Math.abs(first.position.x - second.position.x);
    let diffY = Math.abs(first.position.y - second.position.y);
    let distance = Math.sqrt(diffX*diffX + diffY*diffY);
      
    return distance;
}


function updateCollisionsCounter(){
    
    let collisionsElement = document.getElementById("collision");
    let counter = 0;
    
    collisionsElement.innerHTML = "No Collisions";
    
    for(let i = 0; i < Balls.length; i++){        
        if(Balls[i].colliding) counter++;
    }
    
    if(counter > 0){
        collisionsElement.innerHTML = "Balls Colliding x"+(counter);
    }
}

///funcions xungues de colisions
function rotate(velocity, angle){
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),   
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };
    
    return rotatedVelocities;
}


function resolveCollision(bubble, otherBubble){
    const xVelocityDiff = Math.abs(bubble.velocity.x - otherBubble.velocity.x);
    const yVelocityDiff = Math.abs(bubble.velocity.y - otherBubble.velocity.y);
    
    const xDist = otherBubble.velocity.x - bubble.velocity.x;
    const yDist = otherBubble.velocity.y - bubble.velocity.y;
    
    //prevent accidental overlap of bubbles
    if(xVelocityDiff * xDist + yVelocityDiff * yDist >= 0){
        
        
        //grab angle between the two colliding bubbles
        const angle = -Math.atan2(otherBubble.velocity.y - bubble.velocity.y, otherBubble.velocity.x - bubble.velocity.x);
        
        //store mass in var for better readability in collision equation
        const m1 = bubble.mass;
        const m2 = otherBubble.mass;
        
        //velocity before equation
        const u1 = rotate(bubble.velocity, angle);
        const u2 = rotate(otherBubble.velocity, angle);
        
        //velocity after 1 dimension collision equation
        const v1 = {x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = {x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };
        
        //final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);
        
        //swap bubbles velocities for realistic bounce effect
        bubble.velocity.x = vFinal1.x;
        bubble.velocity.y = vFinal1.y;
        
        otherBubble.velocity.x = vFinal2.x;
        otherBubble.velocity.y = vFinal2.y;
    }
}
////

function getFPS(){
    
    let delta;
    
    if(!lastCallTime){
        lastCallTime = Date.now();
        fps = 0;
        return;
    }
    
    delta = (Date.now() - lastCallTime) / 1000;
    lastCallTime = Date.now();
    fps = Math.floor(1/delta);
}