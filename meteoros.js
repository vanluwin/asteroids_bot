class Meteoro {
    //define o construtor meteoro
    constructor(posicao, r, nave) {
        if (posicao) {
            //se foi passado uma posição como parâmetro a posição passada é copida
            this.posicao = posicao.copy();
        } else {
            this.posicao = createVector(random(width), random(height)); //se não uma posição aleatoria é gerada
        }

        if (r) {
            //se foi passado um raio como parâmetro o raio passado é dividido por 2
            this.r = r * 0.5;
        } else {
            this.r = random(15, 50); //se não um raio aleátorio é gerado
        }

        if (nave) {
            this.posicao = createVector(
                random(width) + nave.posicao.x * random(),
                random(height) + nave.posicao.y * random()
            );
        }

        this.velocidade = p5.Vector.random2D(); //define a aceleração como um vetor aleatorio
        this.total = floor(random(5, 15)); //toral de pontos para o desenho do meteoro como um numero aleatorio

        //vetor que amazenará numeros aleatorios para ligar os pontos e dar forma ao contorno do meteoro
        this.offset = [];
        for (var i = 0; i < this.total; i++) {
            this.offset[i] = random(-this.r * 0.5, this.r * 0.5);
        }
    }

    //define o metodo que move o meteoro
    update() {
        this.posicao.add(this.velocidade); //adiciona a posição do meteoro sua velocidade
        //condições para manter o meteoro dentro da tela invertendo o sentido de sua velocidade quando uma borda é atingida
        if (this.posicao.x > width || this.posicao.x < 0) {
            this.velocidade.x *= -1;
        }
        if (this.posicao.y > height || this.posicao.y < 0) {
            this.velocidade.y *= -1;
        }
    }

    //define o metodo para mostrar o meteoro
    mostrar() {
        push(); //inicia uma nova rotina de desenho
        stroke(255); //define o contorno com a cor branco
        noFill(); //define que o que for desenhado nao será preenchido
        translate(this.posicao.x, this.posicao.y); //muda o centro de cordenadas da tela para a atual posição do meteoro
        //ellipse(this.posicao.x, this.posicao.y, this.r*2, this.r*2);
        beginShape(); //começa a desenhar uma forma
        for (var i = 0; i < this.total; i++) {
            var angle = map(i, 0, this.total, 0, TWO_PI); //é gerado um numero entre proporcional de 0 a 2pi a depender do ponto
            var r = this.r + this.offset[i]; //um novo raio é definido a partir do atual somado com o offset
            //é definido o novo vertice da forma usando coordenadas polares
            var x = r * cos(angle);
            var y = r * sin(angle);
            vertex(x, y);
        }
        endShape(CLOSE); //encherra o desenho da forma
        pop(); //encerra a nova rotina de desenho a retorna a padrão
    }

    //metodo para verificar se o meteoro esta nas bordas da tela
    /*
    this.edges = function(){
    if (this.posicao.x > width + this.r) {
        this.posicao.x = -this.r;
        } else if (this.posicao.x < -this.r) {
        this.posicao.x = width + this.r;
        }
        if (this.posicao.y > height + this.r) {
        this.posicao.y = -this.r;
        } else if (this.posicao.y < -this.r) {
        this.posicao.y = height + this.r;
        }
    }
    */

    //metodo para quebrar o meteoro se quando atingido seu raio for maior que 30
    quebrar() {
        var novosM = [];
        novosM[0] = new Meteoro(this.posicao, this.r);
        novosM[1] = new Meteoro(this.posicao, this.r);
        return novosM;
    }
}
