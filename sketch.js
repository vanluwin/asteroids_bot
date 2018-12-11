//Variaveis que serão usadas por todo o jogo

//função do framework p5js que é executada uma vez ao inicio do sketch
let sel_jogo =1;
let grift = [];
let stop = false;
let geracao=0;
let melhorDaHistoria = 0;
let geracaoMelhorHist=0;
let maxIteracoes = 1000;
let spawnProtection = 60;
let iteracoes = 0
let historiaGen = [];
let meteoros = [];
function setup() {
    meteoros.push(new Meteoro(createVector(height,height), 100, createVector(0,0)));

    for(let i=0; i<150; i++){
        grift.push(new Grift(meteoros));
        grift[i].num = i;
        //console.log(Math.floor(grift[i].color)+" indice = " + i);
    }
    frameRate(60);
}

function draw(){

    let melhor_indice=0;
    let melhor_indice_vivo=0;
    let N_vivos = 0;
    iteracoes++;

    for(let i=0; i<grift.length;i++){
        grift[i].update(stop, iteracoes < spawnProtection);
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
    if(grift[melhor_indice].pontos >= melhorDaHistoria){
        melhorDaHistoria = grift[melhor_indice].pontos;
        geracaoMelhorHist=geracao;
    }
    textSize(25);    fill(255);     noStroke();
    text("Individuo " + melhor_indice_vivo, 20, 90);
    text("Vivos " + N_vivos, 20, 120);
    text("Geração " + geracao, 20, 150);
    text("Record: " + melhorDaHistoria +"@"+geracaoMelhorHist, 20, 180);
    fill(160);     stroke(255);
    rect(20, 180+10-1, 150, 20);
    fill(0,150,0);     noStroke();
    rect(21, 180+10, iteracoes/maxIteracoes * 150-1, 20-1);
    if(iteracoes < spawnProtection){
        fill(255,0,0);        text("Spawn Protection ON", 20, 240);
    }
    grafico(historiaGen);


    if(iteracoes > maxIteracoes)
        for(let i=0; i<grift.length;i++)
            grift[i].vivo = false;

    if(melhor_indice!=melhor_indice_vivo){
        fill(255);   text("Melhor morto com " + grift[melhor_indice].pontos +" pontos", windowWidth/2-150, windowHeight-100);

    }
    for(let i=0; i<grift.length;i++)
        if(grift[i].vivo)
            grift[i].nave.mostrar(grift[i].color);

    if(!vivos(grift)){
        iteracoes = 0;
        historiaGen.push(grift[melhor_indice].pontos);
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
            grift[i] = new Grift(meteoros);
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

function grafico(y){
    noStroke();
    fill(100,0,0);
    let largura = 2;
    rect(20, height-10, 2, -height/6);
    for(let i=0; i<y.length; i++){
        fill(0,100,100);
        rect(20+ largura + (largura*(y.length-i-1))%(width/6), height-10, largura, -y[i]/Math.max(...y)*height/6);
    }
    fill(250);
    rect(20 + largura, height-8, (width/6), 2);
}