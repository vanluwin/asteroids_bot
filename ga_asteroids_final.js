class Cromo {
    constructor(weigths, pontuacao) {
        if (weigths) {
            this.weigths = weigths;
        } else {
            this.weigths = [];
        }

        this.apitidao = pontuacao;
    }

    apitidao(){
        return this.apitidao;
    }

    mutate() {
        indice1 = Math.floor((Math.random() * 4));
        indice2 = Math.floor((Math.random() * 4));
        while(indice1 == indice2){ 
            indice2 = Math.floor((Math.random() * 4));
        }
        aux = this.weigths[indice1];
        this.weigths[indice1] = this.weigths[indice2];
        this.weigths[indice2] = aux;
    }

    cruzamento(cromo) {
        let pivot = Math.round(this.weigths.length / 2) - 1;

        let child1 = this.weigths.substr(0, pivot) + cromo.weigths.substr(pivot);
        let child2 = cromo.weigths.substr(0, pivot) + this.weigths.substr(pivot);

        return [new Cromo(child1, 0), new Cromo(child2, 0)];
    }
}

class Population {
    constructor(individuos) {//members vector of genes
        if (individuos) {
            this.individuos = individuos;
        } else {
            this.individuos = [];
        }
        this.generationNumber = 0;
        this.tx_cruzamento = 0.1;
    }

    seleciona_roleta(individuos){
        for (let index = 0; index < this.individuos.length; index++) {
            this.somatotal = individuos[i].apitidao();
        }
        r = Math.floor((Math.random() * this.somatotal)); // Escolhe um valor aleatorio entre 0 e soma
        soma2 = 0;
        for (let index = 0; index < this.individuos.length; index++) {
            soma2 += individuos[i][0];
            if (soma2 > r) {
                return index;
            }
        }
        return this.size - 1;
    }

    sort() {
        this.individuos.sort( (a, b) => (a.apitidao - b.apitidao) );
    }

    generation() {
        elite = [];
        filhos = [];
        
        this.sort();

        for (let index = 0; index < (this.individuos.length * (1 - tx_cruzamento)); index++) {//removendo elite
            elite += this.individuos[this.individuos.length];
            this.individuos.pop();
        }

        for (let index = 0; index < this.individuos.length; index++) {//selecionando por roleta e fazendo cruzamento
            selecionado1 = this.seleciona_roleta(this.individuos);
            selecionado2 = this.seleciona_roleta(this.individuos); 

            filhos += this.individuos[selecionado1].cruzamento(this.individuos[selecionado2]);
        }

        for (let index = 0; index < filhos.length; index++) {//mutacao nos filhos
            filhos[index] = filhos[index].mutate();  
        }

        filhos += elite;
        this.individuos += filhos;

        this.individuos.sort( (a, b) => ( 0.5 - Math.random()) );

        return this.individuos;

    }

}

let population = new Population("-123456789", 30);
pesos_mlp = population.generation();