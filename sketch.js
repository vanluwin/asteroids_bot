//Variaveis que serão usadas por todo o jogo

//função do framework p5js que é executada uma vez ao inicio do sketch
let sel_jogo =1;
let grift = [];
function setup() {
    for(let i=0; i< 5;i++)
        grift.push(new Grift(i));
}

function draw(){

    grift[sel_jogo].draw_game();
    for(let i=0; i<grift.length;i++)
        grift[i].update();
}
function keyPressed(){
    if(parseInt(key,10) < grift.length)
        sel_jogo = parseInt(key,10);
    
    console.log(sel_jogo);

    for(let i=0; i<grift.length;i++)
        grift[i].pressed();
}
function keyReleased(){
    for(let i=0; i<grift.length;i++)
        grift[i].released();

}