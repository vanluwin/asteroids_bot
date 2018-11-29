class Nave{
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
        this.mais_proximo = 0;

        this.mlp = new Mlp(this.sensors, 8, 4);
    }

    // Desenha os sensores que detectam os meteoros
    drawShipSensors() {
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
        for (let point of this.sensorPoints) {
            if (
                collideLineCircle(
                    this.posicao.x,
                    this.posicao.y,
                    cos(this.angulo) * point.x -
                        sin(this.angulo) * point.y +
                        this.posicao.x,
                    sin(this.angulo) * point.x +
                        cos(this.angulo) * point.y +
                        this.posicao.y,
                    meteoro.posicao.x,
                    meteoro.posicao.y,
                    meteoro.r
                )
            ) {
                let d = dist(
                    this.posicao.x,
                    this.posicao.y,
                    meteoro.posicao.x,
                    meteoro.posicao.y
                );
            }
        }
    }

    mostrarSensor(){
        for (let point of this.sensorPoints) {
            stroke(255, 0, 0);
            line(
                this.posicao.x,
                this.posicao.y,
                cos(this.angulo) * point.x -
                    sin(this.angulo) * point.y +
                    this.posicao.x,
                sin(this.angulo) * point.x +
                    cos(this.angulo) * point.y +
                    this.posicao.y
            );
        }
    }


    //define o metodo para mostrar a nave
    mostrar() {
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

    dist(meteoro){
        return dist(this.posicao.x, this.posicao.y, meteoro.posicao.x, meteoro.posicao.y);
    }

    angulo_obj(objeto){
        return (2* PI       // Pegar o complementar
        - ((this.angulo % (2*PI)) + (2*PI)) % (2*PI)  //calcula o angulo absoluto positivo da nave
        + (atan2(this.posicao.y - objeto.posicao.y ,this.posicao.x - objeto.posicao.x ) +3*PI/2)
        )% (2*PI);   //angulo do meteoro relativo à nave

    }
    auto_pilot(meteoros, tiros){
        let mais_distante = 0;
        let ang_tiro = 100;

        for(let i=0; i<meteoros.length; i++){ //encontra nave mais proxima
            if(this.dist(meteoros[i]) < this.dist(meteoros[this.mais_proximo]))
                this.mais_proximo = i; 
            if(this.dist(meteoros[i]) > this.dist(meteoros[mais_distante]))
                mais_distante = i; 
            
        }
        if(meteoros.length != 0){
            let ang_mais_proximo;
            ang_mais_proximo = this.angulo_obj(meteoros[this.mais_proximo]);
            //text((ang_mais_proximo), 20, 180);

            if(this.dist(meteoros[this.mais_proximo])<200){
                if(ang_mais_proximo > 8.2*PI/8)
                    this.k = 0.03;
                else if(ang_mais_proximo < 7.8*PI/8 ) 
                    this.k = -0.03;
                else
                    this.k = 0;
            }
            else
                this.k = 0.01;
            if(this.dist(meteoros[this.mais_proximo])<meteoros[this.mais_proximo].r+ 80){ 
                if(ang_mais_proximo < 12*PI/8 
                && ang_mais_proximo > 4*PI/8 )
                    this.boosting(true);
            }
            else{
                this.boosting(false);
            }

            for(let i=0; i<meteoros.length; i++){
                if(10* cos(PI/2 - this.angulo_obj(meteoros[i])) >= sqrt(meteoros[this.mais_proximo].velocidade.x**2 +meteoros[this.mais_proximo].velocidade.y**2)*0.95
                && 10* cos(PI/2 - this.angulo_obj(meteoros[i])) <= sqrt(meteoros[this.mais_proximo].velocidade.x**2 +meteoros[this.mais_proximo].velocidade.y**2)*1.05
                && this.angulo_obj(meteoros[i]) < PI/2
                ){
                    if(tiros.length<1){
                        let tiro = new Tiro(this.posicao, this.angulo);
                        tiros.push(tiro);
                    }
                }
                else if(this.angulo_obj(meteoros[i]) < PI/ang_tiro 
                || this.angulo_obj(meteoros[i]) > PI*(2-1/ang_tiro) ){
                    if(tiros.length<1){
                        let tiro = new Tiro(this.posicao, this.angulo);
                        tiros.push(tiro);
                    }
                }
            }
        }
    }
    //define o metodo para mover a nave
    update() {
        if (this.isBoosting) {
            //se a nave 'está acelerando' o metodo boost é chamado
            this.boost();
        }

        this.angulo += this.k; //adiciona ao angulo o multiplicador 'k' 
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

}
