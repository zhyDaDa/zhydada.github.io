const mapC = settings.mapWidth;
const mapR = settings.mapHeight;
const size = settings.size;
var map = [];


function tetris (type){
    this.type = types(type);//样式
    this.state = 0;//state是状态
    this.activeTetris = this.type[this.state];
    this.style = type;
    this.x = 4;
    this.y = 0;
}
function drawSqr (x,y,style){
    var sqr = document.createElement("div");
    sqr.className = "sqr style"+style;
    sqr.style.left = x*size + "px";
    sqr.style.top = y*size + "px";
    document.getElementById("mainGameBoard").appendChild(sqr)
}
function drawSqrOnMap(x,y,style){
    map[y][x] = style;
}
function initMap(){
    for(var r=0;r<mapR;r++){
        map[r] = [];
        for(var c=0;c<mapC;c++){
            map[r][c] = 0;
        }
    }
}
function drawMap (){
    var mainGameBoard = document.getElementById("mainGameBoard");
    mainGameBoard.style.height = mapR*size+"px";
    mainGameBoard.style.width = mapC*size+"px";
    mainGameBoard.innerHTML = "";
    for(var r=0;r<mapR;r++){
        for(var c=0;c<mapC;c++){
            drawSqr(c,r,map[r][c]);
        }
    }
}
tetris.prototype.draw = function(){
    for(var r=0 ; r<this.activeTetris.length;r++){
        for(var c=0 ; c<this.activeTetris.length;c++){
            if(this.activeTetris[r][c]==0){continue;}
            else drawSqrOnMap(this.x+c,this.y+r,this.style);
        }
    }
}
tetris.prototype.undraw = function(){
    for(var r=0 ; r<this.activeTetris.length;r++){
        for(var c=0 ; c<this.activeTetris.length;c++){
            if(this.activeTetris[r][c]==0){continue;}
            else drawSqrOnMap(this.x+c,this.y+r,0);
        }
    }
}
tetris.prototype.moveInRow = function(step){
    this.undraw();
    if(this.check(this.x+=step,this.y)){this.x-=step;}
    this.draw();
}
tetris.prototype.moveInColumn = function(step){
    this.undraw();
    if(this.check(this.x,this.y+=step)){this.y-=step;this.draw();this.next();}
    this.draw();

}
tetris.prototype.check = function(x,y){//返回true代表撞了
    for(var r=0 ; r<this.activeTetris.length;r++){
        for(var c=0 ; c<this.activeTetris.length;c++){
            if(this.activeTetris[r][c]==0){ continue;}
            else if ((x+c)<0||x+c>=mapC||y+r>=mapR){return true}
            else if (map[y+r][x+c]!=0){return true}
        }
    }
    return false;
}
tetris.prototype.rotate = function(){
    let kick = 0;
    this.undraw();
    this.state = (this.state + 1)%(this.type.length);
    this.activeTetris = this.type[this.state];
    if(this.check(this.x,this.y)){
        if(this.x>mapC/2){kick=-1}else{kick=+1}
    }
    if(this.check(this.x+=kick,this.y)){
        this.x-=kick;
        this.state = (this.state +this.type.length- 1)%(this.type.length);
        this.activeTetris = this.type[this.state];        
    }
    this.draw();    
}
tetris.prototype.next = function () {
    dealFull();
    for(r = 0;r < this.activeTetris.length ; r++){
        for(c = 0;c < this.activeTetris.length ; c++){
            if(this.activeTetris[r][c] = 0){continue;}
            if (this.y <= 0) {
                game.end = true;
                game.goToEnd();
                return
            }
        }
    }
    createNewTetris();
}
function createNewTetris(type) {
    //div:创建新的T时
    t = new tetris(newType);
    newType = choseNewType();//todo:把这个函数弄出来
    t.draw();
    drawNextDisplayMap(newType);
}

function choseNewType() {
    return game.pool[Math.floor(Math.random() * game.pool.length)];
}

function dealFull() {
    let s = 0;
    for (var r = 0; r < mapR; r++){
        if (isFull(r)) {
            for (var r1 = r; r1 > 0; r1--){
                for (var c = 0; c < mapC; c++){
                    map[r1][c] = map[r1 - 1][c];
                }
            }
            for (var c = 0; c < mapC; c++){
                map[0][c] = 0;
            }      
            s += 1;
        }
    }    
    function cal(s)
    {
        if (s > 0)
            return s + cal(s - 1);
        else
            return 0;
    }
    game.score += cal(s)*10;
    game.checkScore();  
}
function isFull(r) {
    for (var c = 0; c < mapC; c++){
        if (map[r][c] == 0) return false;
    }
    return true;    
}
function drawNextDisplay(x,y,style) {
    var sqr = document.createElement("div");
    sqr.className = "sqr style"+style;
    sqr.style.left = x*size+20 + "px";
    sqr.style.top = y*size +50 +"px";
    document.getElementById("nextDisplayMap").appendChild(sqr)    
}
function drawNextDisplayMap (newType){
    document.getElementById("nextDisplayMap").innerHTML = "";
    let _size = types(newType)[0].length;
    let _map = types(newType)[0];
    for(var r=0;r<_size;r++){
        for (var c = 0; c < _size; c++){
            let _ababa = _map[r][c]?newType:0
            drawNextDisplay(c,r,_ababa);
        }
    }
}
