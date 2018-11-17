class Grift{
    constructor(numero_sim){
        
        this.num = this.numero_sim;
        this.nave;
        this.meteoros = [];
        this.tiros = [];
        this.tempo = 1500;
        this.pontos = 0;
        this.vidas = 2;
        this.estado = 0;
        //cria o lugar onde o jogo acontecerá
        createCanvas(windowWidth * 0.99, windowHeight * 0.95);

        //cria um objeto nave
        this.nave = new Nave();

        this.color = random()*255;
        //preenche o vetor meteros com obejetos meteoro
        for (let i = 0; i < 1; i++) {
            this.meteoros.push(new Meteoro());
        }

        //cria um interlo de tempo no qual serão adicionados novos meteros
        setInterval(this.criarMeteoro, this.tempo);

        //inserirComando(AG.frente, AG.esquerda, AG.direita, AG.tiro);
        //setInterval(comando, 120);
        //setInterval(removerComando, 1000);
    }
    comando() {
        inserirComando(
            Math.random() % 2 >= 0.5,
            Math.random() % 2 >= 0.3,
            Math.random() % 2 >= 0.3,
            Math.random() % 2 >= 0.1
        );
        if (this.estado == 0) {
            this.estado = 1;
        } else if (estado == 2) {
            this.estado = 3;
        } else if (this.estado == 3) {
            recarregar();
        }
    }
    inserirComando(frente, esquerda, direita, tiro) {
        if (frente) {
            //se foi seta para cima addiona aceleração a nave
            nave.boosting(true);
        } else if (direita) {
            //se foi seta para direita adiona um multiplicador positivo ao angulo para que a nave rode para a direita
            this.nave.k = 0.03;
        } else if (esquerda) {
            //se foi seta para esquerda adiona um multiplicador negativo ao angulo para que a nave rode para a esquerda
            this.nave.k = -0.03;
        } else if (tiro) {
            let tiro = new Tiro(this.nave.posicao, this.nave.angulo);
            this.tiros.push(this.tiro);
        }
    }
    removerComando() {
        this.nave.k = 0;
        this.nave.boosting(false);
    }

    //funcção para criar novos meteoros
    criarMeteoro() {
        //adiciona no vetor meteoros um novo meteoro
        if (this.estado == 1) {
            //meteoros.push(new Meteoro(false, false, nave));
            //diminui o tempo de criação de novos meteoros ate atingir 0.5s
            if (this.tempo > 450) {
                this.tempo -= 450;
            }
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

    update(){
        if(this.estado != 3){
            for (let i = 0; i < this.meteoros.length; i++) {
                this.meteoros[i].update(); //metodo para mover o meteoro
                this.nave.atingida(this.meteoros[i]);   // verificar se um meteoro atingiu a nave
                this.nave.sensorDistance(this.meteoros[i]);     // Verifica a distancia do meteroro para os sensores
            }
            this.nave.update();     // Move a nave
            this.nave.edges();      // Verfica se a nave esta nas bordas da tela
        }

        if (this.estado == 1) {
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
            this.nave.sensorDistances = [];
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
            text(this.pontos, 20, 30);
            text(this.vidas, 20, 60);

            this.nave.mostrar();    // Desenha a nave
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