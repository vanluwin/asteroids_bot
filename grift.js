class Grift{
    constructor(geracao){
        this.num;
        this.meteoros = [];
        this.tiros = [];
        this.tempo = 10000;
        this.t_ultimo_met = 0;
        this.pontos = 0;
        this.estado = 0;
        this.vidas = 0;
        this.vivo = true;
        this.max_meteoros = 1;
        this.geracao = geracao;

        //cria o lugar onde o jogo acontecerá
        createCanvas(windowWidth * 0.99, windowHeight * 0.95);

        //cria um objeto nave
        this.nave = new Nave();

        this.color = Math.random()*100;
        //preenche o vetor meteros com objetos meteoro
        for (let i = 0; i < 50; i++) {
            this.meteoros.push(new Meteoro());
        }

        //cria um intervalo de tempo no qual serão adicionados novos meteros

        //inserirComando(AG.frente, AG.esquerda, AG.direita, AG.tiro);
        //setInterval(comando, 120);
        //setInterval(removerComando, 1000);
    }
    comandoRandom() {
        this.inserirComando([
            Math.random() >= 0.5,
            Math.random() >= 0.3,
            Math.random() >= 0.3,
            Math.random() >= 0.1]
        );
        if (this.estado == 0) {
            this.estado = 1;
        } else if (this.estado == 2) {
            this.estado = 3;
        }
    }

    inserirComando(comandos) {
        if (comandos[0]) {
            //se foi seta para cima addiona aceleração a nave
            this.nave.boosting(true);
        }
        if (comandos[1]) {
            //se foi seta para direita adiona um multiplicador positivo ao angulo para que a nave rode para a direita
            this.nave.k = 0.03;
        }
        if (comandos[2]) {
            //se foi seta para esquerda adiona um multiplicador negativo ao angulo para que a nave rode para a esquerda
            this.nave.k = -0.03;
        }
        if (comandos[1]&&comandos[2]) {
            //se foi seta para esquerda adiona um multiplicador negativo ao angulo para que a nave rode para a esquerda
            this.nave.k = 0.0;
        }
        if (comandos[3]) {
            if(this.tiros.length<1){
                let novo_tiro = new Tiro(this.nave.posicao, this.nave.angulo);
                this.tiros.push(novo_tiro);
            }
        }
    }
    removerComando() {
        this.nave.k = 0;
        this.nave.boosting(false);
    }

    //funcção para criar novos meteoros
    criarMeteoro() {
        let t = new Date().getTime();
        //adiciona no vetor meteoros um novo meteoro
        if ((t - this.t_ultimo_met) > this.tempo) {
            this.t_ultimo_met = t;
            this.meteoros.push(new Meteoro());
            //diminui o tempo de criação de novos meteoros ate atingir 0.5s
            // if (this.tempo > 450) {
            //     this.tempo -= 450;
            // }
        }
    }
    //função para adicionar pontos ao placar
    somarPontos() {
        this.pontos += 20;
    }
    //função para recarregar a pagina quando o jogador morrer
    recarregar() {
        location.reload();
    }

    update(stop){
        if (this.estado == 0) {
            this.estado = 1;
        }
        else if (this.estado == 2) {
            this.estado = 3;
        } 
        if(this.estado != 3){
            this.nave.sensorDistances = [this.nave.sensorLen,this.nave.sensorLen,this.nave.sensorLen,this.nave.sensorLen];
            for (let i = 0; i < this.meteoros.length; i++) {
                if(!stop)
                    this.meteoros[i].update(); //metodo para mover o meteoro
                this.nave.sensorDistance(this.meteoros[i]);     // Verifica a distancia do meteroro para os sensores
            }
            this.nave.update();     // Move a nave
            this.nave.edges();      // Verfica se a nave esta nas bordas da tela
            //this.nave.auto_pilot(this.meteoros,this.tiros);

        }
        if (this.estado == 1) {
            //this.draw_debug();  
            if(this.meteoros.length < this.max_meteoros)
                this.criarMeteoro();

            for (let i = 0; i < this.meteoros.length; i++) {
                this.atingida(this.nave,this.meteoros[i]);   // verificar se um meteoro atingiu a nave
            }
            for (let i = this.tiros.length - 1; i >= 0; i--) {
                this.tiros[i].mover(); //metodo para mover os tiros

                if (this.tiros[i].offscren()) {
                    //verifica se algum tiro saiu da tela
                    this.tiros.splice(i, 1); //remove o tiro que saiu da tela do vetor de tiros
                } else {
                    //se o tiro n estiver fora da tela ele continuara a ser desenhado ate atingir um meteoro
                    for (let j = this.meteoros.length - 1; j >= 0; j--) {
                        //percorrer o vetor de meteoros
                        if (this.tiros[i].hits(this.meteoros[j])) {
                            // e verificar se algum tiro atingiu um meteoro
                            if (this.meteoros[j].r > 30) {
                                //verifica se o raio do meteoro é menor que 30
                                let novosMeteros = this.meteoros[j].quebrar(); //se for ele será dividido em dois pelo metodo que retorna um vetor com os novos meteoros
                                this.meteoros = this.meteoros.concat(novosMeteros); //adiciona os novos meteoros no vetor de meteoros
                            }
                            this.somarPontos(); //adiciona os pontos
                            this.meteoros.splice(j, 1); //remove do vetor meteoros o que foi destruido
                            this.tiros.splice(i, 1); //remove do vetor tiros o tiro que atingiu o meteoro
                            break; //sai do for de verificação
                        }
                    }
                }
            }
            
            //this.nave.sensorDistances = [];
        }
    }

    comandoMlp(){
        let comando =[
            this.nave.mlp.predict([...this.nave.sensorDistances, 1]).selection.data[0]>0.5,
            this.nave.mlp.predict([...this.nave.sensorDistances, 1]).selection.data[1]>0.5,
            this.nave.mlp.predict([...this.nave.sensorDistances, 1]).selection.data[2]>0.5,
            this.nave.mlp.predict([...this.nave.sensorDistances, 1]).selection.data[3]>0.5
        ];
        this.inserirComando(comando);
    }    

    //define o metodo que verifica se a nave foi atingida
    atingida(nave,meteoro) {
        //cria a variavel 'd' que recebe a distancia entre a posicção atual da nave e o meteoro que foi passado como parâmetro
        var d = dist(
            nave.posicao.x,
            nave.posicao.y,
            meteoro.posicao.x,
            meteoro.posicao.y
        );
        if (d < (nave.r + meteoro.r)) {
            console.log("e morreu " + this.num);
            //se o raio de colisão da nave for menor que sua soma com o raio do metroro
            if (this.vidas == 0) {
                //se não houver mais vidas escreve na tela fim de jogo
                this.estado = 2;

                this.vivo = false;
            } 
        }
    }

    //função do fremework p5 que fica em loop durante a execução do sketch
    draw_game() {
        //define o fundo do canvas como preto
        background(this.color);
        if(this.estado != 3){
            for (let i = 0; i < this.meteoros.length; i++) 
                this.meteoros[i].mostrar(); //metodo para mostrar o meteoro
        }
        if (this.estado == 0) {
            this.menu();        
        }

        else if (this.estado == 1) {
            //escreve na tela os pontos do jogador e sua vidas restantes
            textSize(25);
            fill(255);
            text("Pontos " + this.pontos, 20, 30);
            text("Vidas " + this.vidas, 20, 60);
            text("Meteoros " + this.meteoros.length, 20, 90);
            text("Individuo " + this.num, 20, 120);
            text("Geração " + this.geracao, 20, 150);
            

            this.nave.mostrar(this.color);    // Desenha a nave
            this.nave.mostrarSensor();
            //desenha todos os tiros
            for (let i = this.tiros.length - 1; i >= 0; i--) {
                this.tiros[i].mostrar(); //metodo pra mostrar os tiros
            }
    
        } else if (this.estado == 2) {
            this.gameOver();
        } else if (this.estado == 3) {
            this.pontuacao();
        }
    }

    draw_debug(){
        for(let i=0; i < this.meteoros.length; i++){
            stroke(100,0,0);
            line(this.meteoros[i].posicao.x,
                this.meteoros[i].posicao.y,
                this.meteoros[i].posicao.x + this.meteoros[i].velocidade.x*20,
                this.meteoros[i].posicao.y + this.meteoros[i].velocidade.y*20);
            noFill();
            ellipse(this.meteoros[i].posicao.x,
                this.meteoros[i].posicao.y, 
                this.meteoros[i].r+ 200, this.meteoros[i].r+ 200); 

            stroke(0,100,0);

            line(this.nave.posicao.x, this.nave.posicao.y,
                this.nave.posicao.x + this.nave.velocidade.x*30,
                this.nave.posicao.y + this.nave.velocidade.y*30);
        }
        stroke(255);
        text("tiros " + this.tiros.length, 20, 150);
        text("Ang " + 180/PI* this.nave.angulo_obj(this.meteoros[this.nave.mais_proximo]) + 
        "\ngraus "+ 180/PI *this.nave.angulo, 20, 180);
        if(this.tiros.length)
        text("\n\nvel "+ sqrt(this.tiros[0].velocidade.y**2)//    + this.tiros[0].velocidade.y**2) 
        , 20, 180);

        stroke(255,0,0);
        if(this.meteoros.length != 0){
            ellipse(this.meteoros[this.nave.mais_proximo].posicao.x,
                this.meteoros[this.nave.mais_proximo].posicao.y, 
                this.meteoros[this.nave.mais_proximo].r+ 200, this.meteoros[this.nave.mais_proximo].r+ 200);
        }

    }
    //função do framework p5 que verifica se alguma tecla foi 'despressionada'
    released() {
        /*se houver sido uma das diressionais esquerdo ou direito
    o multiplicador do angulo recebe 0 e se foi o diressional
    para cima a nave para de receber aceleração
    */
        if (keyCode === RIGHT_ARROW) {
            this.nave.k = 0;
        } else if (keyCode === LEFT_ARROW) {
            this.nave.k = 0;
        } else if (keyCode === UP_ARROW) {
            this.nave.boosting(false);
        }
    }

    //função do framework p5 que verifica se alguma tecla foi pressionada
    pressed() {
        //verifica qual tecla foi pressionada
        if (keyCode === UP_ARROW) {
            //se foi seta para cima addiona aceleração a nave
            this.nave.boosting(true);
        } else if (keyCode === RIGHT_ARROW) {
            //se foi seta para direita adiona um multiplicador positivo ao angulo para que a nave rode para a direita
            this.nave.k = 0.03;
        } else if (keyCode === LEFT_ARROW) {
            //se foi seta para esquerda adiona um multiplicador negativo ao angulo para que a nave rode para a esquerda
            this.nave.k = -0.03;
        } else if (key === " ") {
            //se a telca foi a barra de espaço e a nave esta morta a pagina será recarregada
            //se não um novo tiro sera criado e adicionado no vetor tiros
            if (this.estado == 0) {
                this.estado = 1;
            } else if (this.estado == 2) {
                this.estado = 3;
            } else if (this.estado == 3) {
                this.recarregar();
            } else {
                let tiro = new Tiro(this.nave.posicao, this.nave.angulo);
                this.tiros.push(tiro);
            }
        }
    }

    menu() {
        fill(255);
        textSize(100);
        text("Asteroids", 450, 240);
        textSize(30);
        text("Pressione espaço para jogar", 480, 300);
    }
    
    gameOver() {
        textSize(80);
        noStroke();
        fill(255);
        text("Game Over", 450, 240);
    }
    
    pontuacao() {
        let hiScores = [
            ["Gandalf", 2000],
            ["Son Goku", 9999],
            ["Nazgûl", 1500],
            ["Suco de Frutas", 10000],
            ["Player", this.pontos]
        ];
        hiScores.sort(function(a, b) {
            return b[1] - a[1];
        });
        textSize(30);
        text("Hiscores", 630, 130);
        for (let i = 0, len = hiScores.length; i < len; i++) {
            let hs = hiScores[i];
            text(hs[0], 450, 170 + 50 * i);
            text(hs[1], 800, 170 + 50 * i);
        }
        text("Pressione espaço para tentar novamente", 450, 450);
    }

}