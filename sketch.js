//Variaveis que serão usadas por todo o jogo

//função do framework p5js que é executada uma vez ao inicio do sketch
let sel_jogo =1;
let grift = [];
function setup() {
    for(let i=0; i<5;i++){
        grift.push(new Grift());
        grift[i].num = i;
        //setInterval(grift[i].criarMeteoro, grift[i].tempo);
    }
}

function draw(){
    let melhor_indice=0;
    let mais_pontos;
    for(let i=0; i<grift.length;i++){
        grift[i].update();
        grift[i].comando();
        if(grift[i].pontos > grift[melhor_indice].pontos && grift[i].vidas>0)
            melhor_indice = i;
    }

    grift[melhor_indice].draw_game();
}
function keyPressed(){
    if(parseInt(key,10) < grift.length)
        sel_jogo = parseInt(key,10);
    

    for(let i=0; i<grift.length;i++)
        grift[i].pressed();
}
function keyReleased(){
    for(let i=0; i<grift.length;i++)
        grift[i].released();

}