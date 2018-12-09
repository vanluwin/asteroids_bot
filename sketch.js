//Variaveis que serão usadas por todo o jogo

//função do framework p5js que é executada uma vez ao inicio do sketch
let sel_jogo =1;
let grift = [];
let stop = false;
let geracao=0;
let melhorDaHistoria = 0;
let geracaoMelhorHist=0;
function setup() {
    for(let i=0; i<150;i++){
        grift.push(new Grift(geracao));
        grift[i].num = i;
        //console.log(Math.floor(grift[i].color)+" indice = " + i);
    }
    frameRate(60);
}

function draw(){
    let melhor_indice=0;
    let melhor_indice_vivo=0;
    let N_vivos = 0;
    for(let i=0; i<grift.length;i++){
        grift[i].update(stop);
        grift[i].comandoMlp();
        //grift[i].comandoRandom();
        if(grift[i].vivo){
            N_vivos++;    
        }
        else if(grift[i].meteoros.length>0)
                grift[i].meteoros = [];

        if((grift[i].pontos* grift[i].vivo) > (grift[melhor_indice_vivo].pontos*grift[melhor_indice_vivo].vivo)){
            melhor_indice_vivo = i;
        }
        if((grift[i].pontos >= grift[melhor_indice].pontos)){
            melhor_indice = i;
        }
    }
    grift[melhor_indice_vivo].draw_game();
    grift[melhor_indice_vivo].nave.mostrarSensor2();
    if(grift[melhor_indice].pontos > melhorDaHistoria){
        melhorDaHistoria = grift[melhor_indice].pontos;
        geracaoMelhorHist=geracao;
    }
    textSize(25);
    fill(255); 
    noStroke();
    text("Individuo " + melhor_indice_vivo, 20, 90);
    text("Vivos " + N_vivos, 20, 120);
    text("Geração " + geracao, 20, 150);
    text("Record: " + melhorDaHistoria +"@"+geracaoMelhorHist, 20, 180);
    if(melhor_indice!=melhor_indice_vivo)
        text("Melhor morto com " + grift[melhor_indice].pontos +" pontos", windowWidth/2-150, windowHeight-100);

    for(let i=0; i<grift.length;i++)
        if(grift[i].vivo)
            grift[i].nave.mostrar(grift[i].color);

    if(!vivos(grift)){   
        let popu = [];
        
        for(let i=0; i<grift.length;i++){
            let cromo = new Cromo(grift[i].nave.mlp.getWeights(), grift[i].pontos);

            popu.push(cromo);
        }
        let population = new Population(popu);
       //console.log(popu);
        let fetos = population.generation();
        
        // console.log(fetos);
        for(let i=0; i<grift.length; i++){
            grift[i] = new Grift();
            grift[i].nave.mlp.setWeights(fetos[i].weights);
        } 
        geracao++;
    }

    
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
function vivos(grift){
    for(let i=0; i < grift.length; i++){
        if(grift[i].vivo)
            return true;
    }
    return false;
}