//Variaveis que serão usadas por todo o jogo

//função do framework p5js que é executada uma vez ao inicio do sketch
let sel_jogo =1;
let grift = [];
let stop = false;
let geracao=0;
function setup() {
    for(let i=0; i<30;i++){
        grift.push(new Grift(geracao));
        grift[i].num = i;
        console.log(Math.floor(grift[i].color)+" indice = " + i);

    }
}

function draw(){
    let melhor_indice=0;
    for(let i=0; i<grift.length;i++){
        grift[i].update(stop);
        grift[i].comandoMlp();

        //grift[i].comandoRandom();
        if(grift[i].pontos > grift[melhor_indice].pontos && grift[i].vivo)
            melhor_indice = i;
        
    }
    grift[melhor_indice].draw_game();
    for(let i=0; i<grift.length;i++)    
        if(grift[i].nave.angulo!=0){
            background(200,0,0);
            while(1)
                console.log("eita porra");
        }
    
    // for(let i=0; i<grift.length;i++)
    //    grift[i].nave.mostrar(grift[i].color);
//    console.log("vivos?"+!vivos(grift));


    if(!vivos(grift)){   
        let popu = [];
        
        for(let i=0; i<grift.length;i++){
            let cromo = new Cromo();
            cromo.weights = grift[i].nave.mlp.getWeights();
            cromo.aptidao = grift[i].pontos;
            // console.log(cromo);
            popu.push(cromo);
        }
        let population = new Population(popu);
       
        let fetos = population.generation();
        
        console.log("grift");
        console.log(fetos);
        for(let i=0; i<grift.length; i++){
            grift[i] = new Grift(geracao);
            console.log(i);
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