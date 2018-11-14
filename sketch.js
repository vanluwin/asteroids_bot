//Variaveis que serão usadas por todo o jogo
let nave;
let meteoros = [];
let tiros = [];
let tempo = 1500;
let pontos = 0;
let vidas = 2;
let estado = 0;

//função do framework p5js que é executada uma vez ao inicio do sketch
function setup() {
    //cria o lugar onde o jogo acontecerá
    createCanvas(windowWidth * 0.99, windowHeight * 0.95);

    //cria um obejeto nave
    nave = new Nave();

    //preenche o vetor meteros com obejetos meteoro
    for (let i = 0; i < 1; i++) {
        meteoros.push(new Meteoro());
    }

    //cria um interlo de tempo no qual serão adicionados novos meteros
    setInterval(criarMeteoro, tempo);

    //inserirComando(AG.frente, AG.esquerda, AG.direita, AG.tiro);
    setInterval(comando, 120);
    setInterval(removerComando, 1000);
}

function comando() {
    inserirComando(
        Math.random() % 2 >= 0.5,
        Math.random() % 2 >= 0.3,
        Math.random() % 2 >= 0.3,
        Math.random() % 2 >= 0.1
    );
    if (estado == 0) {
        estado = 1;
    } else if (estado == 2) {
        estado = 3;
    } else if (estado == 3) {
        recarregar();
    }
}

function inserirComando(frente, esquerda, direita, tiro) {
    if (frente) {
        //se foi seta para cima addiona aceleração a nave
        nave.boosting(true);
    } else if (direita) {
        //se foi seta para direita adiona um multiplicador positivo ao angulo para que a nave rode para a direita
        nave.k = 0.03;
    } else if (esquerda) {
        //se foi seta para esquerda adiona um multiplicador negativo ao angulo para que a nave rode para a esquerda
        nave.k = -0.03;
    } else if (tiro) {
        let tiro = new Tiro(nave.posicao, nave.angulo);
        tiros.push(tiro);
    }
}

function removerComando() {
    nave.k = 0;
    nave.boosting(false);
}

//funcção para criar novos meteoros
function criarMeteoro() {
    //adiciona no vetor meteoros um novo meteoro
    if (estado == 1) {
        //meteoros.push(new Meteoro(false, false, nave));
        //diminui o tempo de criação de novos meteoros ate atingir 0.5s
        if (tempo > 450) {
            tempo -= 450;
        }
    }
}

//função para adicionar pontos ao placar
function somarPontos() {
    pontos += 20;
}

//função para recarregar a pagina quando o jogador morrer
function recarregar() {
    location.reload();
}

//função do fremework p5 que fica em loop durante a execução do sketch
function draw() {
    //define o fundo do canvas como preto
    background(0);

    if (estado == 0) {
        menu();
        for (let i = 0; i < meteoros.length; i++) {
            meteoros[i].update(); //metodo para mover o meteoro
            meteoros[i].mostrar(); //metodo para mostrar o meteoro
        }
    } else if (estado == 1) {
        //escreve na tela os pontos do jogador e sua vidas restantes
        textSize(25);
        fill(255);
        text(pontos, 20, 30);
        text(vidas, 20, 60);

        // Desenha a nave
        nave.mostrar();
        // Move a nave
        nave.update();
        // Verfica se a nave esta nas bordas da tela
        nave.edges();

        //desenha todos os meteoros
        for (let i = 0; i < meteoros.length; i++) {
            meteoros[i].update(); //move o meteoro
            meteoros[i].mostrar(); //mostra o meteoro
            //meteoros[i].edges();//verifica se o meteoro se encontra nas bordas do canvas

            // verificar se um meteoro atingiu a nave
            nave.atingida(meteoros[i]);

            // Verifica a distancia do meteroro para os sensores
            nave.sensorDistance(meteoros[i]);
        }

        //desenha todos os tiros
        for (let i = tiros.length - 1; i >= 0; i--) {
            tiros[i].mostrar(); //metodo pra mostrar os tiros
            tiros[i].mover(); //metodo para mover os tiros

            if (tiros[i].offscren()) {
                //verifica se algum tiro saiu da tela
                tiros.splice(i, 1); //remove o tiro que saiu da tela do vetor de tiros
            } else {
                //se o tiro n estiver fora da tela ele continuara a ser desenhado ate atingir um meteoro
                for (let j = meteoros.length - 1; j >= 0; j--) {
                    //percorrer o vetor de meteoros
                    if (tiros[i].hits(meteoros[j])) {
                        // e verificar se algum tiro atingiu um meteoro
                        if (meteoros[j].r > 30) {
                            //verifica se o raio do meteoro é menor que 30
                            let novosMeteros = meteoros[j].quebrar(); //se for ele será dividido em dois pelo metodo que retorna um vetor com os novos meteoros
                            meteoros = meteoros.concat(novosMeteros); //adiciona os novos meteoros no vetor de meteoros
                        }
                        somarPontos(); //adiciona os pontos
                        meteoros.splice(j, 1); //remove do vetor meteoros o que foi destruido
                        tiros.splice(i, 1); //remove do vetor tiros o tiro que atingiu o meteoro
                        break; //sai do for de verificação
                    }
                }
            }
        }

        nave.sensorDistances = [];
    } else if (estado == 2) {
        gameOver();
        for (let i = 0; i < meteoros.length; i++) {
            meteoros[i].update(); //metodo para mover o meteoro
            meteoros[i].mostrar(); //metodo para mostrar o meteoro
        }
    } else if (estado == 3) {
        pontuacao();
    }
}

//função do framework p5 que verifica se alguma tecla foi 'despressionada'
function keyReleased() {
    /*se houver sido uma das diressionais esquerdo ou direito
   o multiplicador do angulo recebe 0 e se foi o diressional
   para cima a nave para de receber aceleração
   */
    if (keyCode === RIGHT_ARROW) {
        nave.k = 0;
    } else if (keyCode === LEFT_ARROW) {
        nave.k = 0;
    } else if (keyCode === UP_ARROW) {
        nave.boosting(false);
    }
}

//função do framework p5 que verifica se alguma tecla foi pressionada
function keyPressed() {
    //verifica qual tecla foi pressionada
    if (keyCode === UP_ARROW) {
        //se foi seta para cima addiona aceleração a nave
        nave.boosting(true);
    } else if (keyCode === RIGHT_ARROW) {
        //se foi seta para direita adiona um multiplicador positivo ao angulo para que a nave rode para a direita
        nave.k = 0.03;
    } else if (keyCode === LEFT_ARROW) {
        //se foi seta para esquerda adiona um multiplicador negativo ao angulo para que a nave rode para a esquerda
        nave.k = -0.03;
    } else if (key === " ") {
        //se a telca foi a barra de espaço e a nave esta morta a pagina será recarregada
        //se não um novo tiro sera criado e adicionado no vetor tiros
        if (estado == 0) {
            estado = 1;
        } else if (estado == 2) {
            estado = 3;
        } else if (estado == 3) {
            recarregar();
        } else {
            let tiro = new Tiro(nave.posicao, nave.angulo);
            tiros.push(tiro);
        }
    }
}

function menu() {
    fill(255);
    textSize(100);
    text("Asteroids", 450, 240);
    textSize(30);
    text("Pressione espaço para jogar", 480, 300);
}

function gameOver() {
    textSize(80);
    noStroke();
    fill(255);
    text("Game Over", 450, 240);
}

function pontuacao() {
    let hiScores = [
        ["Gandalf", 2000],
        ["Son Goku", 9999],
        ["Nazgûl", 1500],
        ["Suco de Frutas", 10000],
        ["Player", pontos]
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
