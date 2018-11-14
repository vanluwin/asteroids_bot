class Nave {
    //define o contrutor Nave
    constructor() {
        this.posicao = createVector(width / 2, height / 2); //define a posição inicial como o centro da tela
        this.velocidade = createVector(0, 0); //define a velocidade como o vetor nulo
        this.acele = createVector(0, 0); //define a aceleração como o vetor nulo
        this.angulo = 0; //define o angulo inicial como zero
        this.k = 0; //define o multiplicador do angulo inicialmente como zero
        this.r = 20; //raio para ser verificado colisões
        this.isBoosting = false; //define o estado 'está acelerando' como falso
        this.vivo = true; //define o estado 'morto' como falso
        this.boosting = function(b) {
            this.isBoosting = b;
        };

        this.sensors = 4;
        this.sensorLen = 200;
        this.sensorPoints = [];
        this.sensorDistances = [];
    }

    // Desenha os sensores que detectam os meteoros
    drawShipSensors() {
        stroke(255, 0, 0);

        if (this.sensors == 4) {
            this.sensorPoints = [
                createVector(this.sensorLen, 0),
                createVector(0, this.sensorLen),
                createVector(-this.sensorLen, 0),
                createVector(0, -this.sensorLen)
            ];
        } else {
            this.sensorPoints = [
                createVector(this.sensorLen, 0),
                createVector(this.sensorLen, this.sensorLen),
                createVector(0, this.sensorLen),
                createVector(-this.sensorLen, this.sensorLen),
                createVector(-this.sensorLen, 0),
                createVector(-this.sensorLen, -this.sensorLen),
                createVector(0, -this.sensorLen),
                createVector(this.sensorLen, -this.sensorLen)
            ];
        }        
    }

    sensorDistance(meteoro) {
       
        for(let point of this.sensorPoints) {
            stroke(0, 0, 255);
            line(
                this.posicao.x,
                this.posicao.y,
                cos(this.angulo) * point.x - sin(this.angulo) * point.y + this.posicao.x,
                sin(this.angulo) * point.x + cos(this.angulo) * point.y + this.posicao.y
            );

            if (
                collideLineCircle(
                    this.posicao.x,
                    this.posicao.y,
                    cos(this.angulo) * point.x - sin(this.angulo) * point.y + this.posicao.x,
                    sin(this.angulo) * point.x + cos(this.angulo) * point.y + this.posicao.y,
                    meteoro.posicao.x,
                    meteoro.posicao.y,
                    meteoro.r
                )
            ) {
                console.log("Intercept");
                let d = dist(
                    this.posicao.x,
                    this.posicao.y,
                    meteoro.posicao.x,
                    meteoro.posicao.y
                );

                console.log('d: ' + d);
            }
            
            
        }
    }

    //define o metodo para mostrar a nave
    mostrar() {
        this.angulo += this.k; //adiciona ao angulo o multiplicador 'k'
        stroke(255); //define o contorno com a cor branco
        fill(0); //preence a forma com preto
        push(); //começa uma nova rotina de desenho
        translate(this.posicao.x, this.posicao.y); //muda o centro de cordenadas da tela para a atual posição da nave
        rotate(this.angulo); //roda a nave em seu atual angulo
        rectMode(CENTER);

        //forma da nave se estiver acelerando
        if (this.isBoosting) {
            beginShape();
            vertex(-10, 20);
            vertex(0, 15);
            vertex(10, 20);
            vertex(0, -10);
            endShape(CLOSE);
            beginShape(); //se nave estiver acelerando desenhar as chamas
            vertex(-5, 17.5);
            vertex(-5, 24);
            vertex(0, 28);
            vertex(5, 24);
            vertex(5, 17.5);
            endShape();
        } else {
            //forma da nave se não estiver acelerando
            beginShape();
            vertex(-10, 20);
            vertex(0, 15);
            vertex(10, 20);
            vertex(0, -10);
            endShape(CLOSE);
        }

        this.drawShipSensors();

        pop(); //encerra a nova rotina de desenho a retorna a padrão
    }

    //define o metodo para mover a nave
    update() {
        if (this.isBoosting) {
            //se a nave 'está acelerando' o metodo boost é chamado
            this.boost();
        }

        //se não é adicionado ao vetor posição o vetor velocidade
        this.posicao.add(this.velocidade);

        //diminiu o vetor velocidade em 1% a cada vez que o metodo é chamado
        this.velocidade.mult(0.99);
    }

    //define o metodo para a aceleração da nave
    boost() {
        this.acele = p5.Vector.fromAngle(this.angulo - PI / 2); //cria um vetor a partir do angulo da nave que aponta para cima
        this.acele.mult(0.1); //adiciona um multiplicador, ao vetor aceleração para que eventualmente ele zere
        this.velocidade.add(this.acele); // é adicionado ao vetor velocidade o vetor aceleração
    }

    //define o metodo para verificar se a nave se encontra nas bordas da tela
    //e altera a posição da nave para a possição correspondente no oposto da tela
    edges() {
        if (this.posicao.x > width) {
            this.posicao.x = 0;
        } else if (this.posicao.x < 0) {
            this.posicao.x = width;
        }
        if (this.posicao.y > height) {
            this.posicao.y = 0;
        } else if (this.posicao.y < 0) {
            this.posicao.y = height;
        }
    }

    //define o metodo que verifica se a nave foi atingida
    atingida(meteoro) {
        //cria a variavel 'd' que recebe a distancia entre a posicção atual da nave e o meteoro que foi passado como parâmetro
        var d = dist(
            this.posicao.x,
            this.posicao.y,
            meteoro.posicao.x,
            meteoro.posicao.y
        );

        if (d < this.r + meteoro.r) {
            //se o raio de colisão da nave for menor que sua soma com o raio do metroro
            if (vidas == 0) {
                //se não houver mais vidas escreve na tela fim de jogo
                estado = 2;
                this.vivo = false;
            } else {
                //se ainda houver vidas
                vidas--; //uma vida é perdida
                nave = new Nave(); //e a nave volta para o centro da tela
            }
        }
    }
}
