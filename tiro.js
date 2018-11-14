class Tiro {
    //define o construtor tiro que recebe os paramentos posição da nave e angulo da nave
    constructor(posicao, angulo) {
        this.posicao = createVector(posicao.x, posicao.y); //define a posição inicial do tiro como a posição da nave quando o disparo foi feito
        this.velocidade = p5.Vector.fromAngle(angulo - PI / 2); //cria o vetor velociade apartir do angulo da nave quando o disparo foi feito e apontando para cima
        this.velocidade.mult(10); //aumenta a magnitude do vetor velociade
        this.r = 2; //define o raio do circulo que representa o tiro
    }

    //define o metodo que mostra o meteoro na tela
    mostrar() {
        fill(255); //preenche o proximo desenho com branco
        ellipse(this.posicao.x, this.posicao.y, this.r * 2, this.r * 2); //cria a circunferencia que representa o tiro
    }

    //define o metodo que move o tiro
    mover() {
        this.posicao.add(this.velocidade); //adiciona ao vetor velocidade o vetor tiro
    }

    //define o metodo que verifica se o tiro atingiu um meteoro
    hits(meteoro) {
        //calcula a distancia entre o meteoro e o tiro
        var d = dist(
            this.posicao.x,
            this.posicao.y,
            meteoro.posicao.x,
            meteoro.posicao.y
        );
        if (d < meteoro.r) {
            //se a distancia for menor que o raio do meteoro retorna verdadeiro, se não retorna falso
            return true;
        } else {
            return false;
        }
    }

    //define o metodo que verifica se o tiro esta fora da tela, se sim retorna verdadeiro, se não retorna falso;
    offscren() {
        if (this.posicao.x > width || this.posicao.x < 0) {
            return true;
        }
        if (this.posicao.y > height || this.posicao.y < 0) {
            return true;
        }
    }
}
