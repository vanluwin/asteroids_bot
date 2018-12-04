//Variaveis que serão usadas por todo o jogo

//função do framework p5js que é executada uma vez ao inicio do sketch
let sel_jogo =1;
let grift = [];
let stop=false;
function setup() {
    for(let i=0; i<5;i++){
        grift.push(new Grift());
        grift[i].num = i;
        console.log(Math.floor(grift[i].color)+" indice = " + i);
        //setInterval(grift[i].criarMeteoro, grift[i].tempo);
    }
}

function draw(){
    let melhor_indice=0;
    let mais_pontos;
    for(let i=0; i<grift.length;i++){
        grift[i].update(stop);
        grift[i].comandoMlp();
        if(grift[i].pontos > grift[melhor_indice].pontos && grift[i].vidas>=0)
            melhor_indice = i;
        grift[i].nave.mostrar(grift[i].color);
    }
    grift[melhor_indice].draw_game();
}
function keyPressed(){
    if(event.key == "p"){
        stop=!stop;
    }
    if(event.key == "s"){
        console.log(grift[0].nave.sensorDistances);
    }
    if(parseInt(key,10) < grift.length)
        sel_jogo = parseInt(key,10);
    
    for(let i=0; i<grift.length;i++)
        grift[i].pressed();
}
function keyReleased(){
    for(let i=0; i<grift.length;i++)
        grift[i].released();

}