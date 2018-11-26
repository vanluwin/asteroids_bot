class Cromo {
    constructor(weigths, pontuacao) {
        if (weigths) {
            this.weigths = weigths;
        } else {
            this.weigths = [];
        }

        this.apitidao = pontuacao;
    }

    mutate() {
        let indice1 = Math.floor((Math.random() * this.weigths.length));
        let indice2 = Math.floor((Math.random() * this.weigths.length));

        while(indice1 === indice2) { 
            indice2 = Math.floor((Math.random() * this.weigths.length));
        }

        let aux = this.weigths[indice1]; 
        //this.weigths[indice1] = this.weigths[indice2];
        //this.weigths[indice2] = aux;
    }

    cruzamento(cromo) {
        let pivot = Math.round(this.weigths.length / 2);

        let child1 = this.weigths.slice(0, pivot) + cromo.weigths.slice(pivot, this.weigths.length);
        let child2 = cromo.weigths.slice(0, pivot)  + this.weigths.slice(pivot, this.weigths.length);

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

    seleciona_roleta(){
        let somatotal = 0;
        this.individuos.forEach(individio => {
            somatotal += individio.apitidao;
        });
        
        let r = Math.floor((Math.random() * somatotal)); // Escolhe um valor aleatorio entre 0 e soma
        let soma2 = 0;

        this.individuos.forEach(individio => {
            soma2 += individio.apitidao;

            if(soma2 > r) {
                return individio;
            }

        });

        return this.individuos[this.individuos.length - 1];
    }

    sort() {
        this.individuos.sort( (a, b) => (b.apitidao - a.apitidao) );
    }

    generation() {
        let elite = [];
        let filhos = [];
        
        this.sort();

        this.individuos = this.individuos.slice((0, this.individuos.length / 2) + 1);

        for (let index = 0; index < Math.ceil(this.individuos.length * this.tx_cruzamento); index++) {//removendo elite
            elite.push(this.individuos[index]);
            this.individuos.slice(index, 1);
        }
        console.log("Elite", elite)

        //selecionando por roleta e fazendo cruzamento
        for (let index = 0; index < this.individuos.length ; index++) {
            let selecionado1 = this.seleciona_roleta(this.individuos);
            let selecionado2 = this.seleciona_roleta(this.individuos); 

            let novos_filhos = selecionado1.cruzamento(selecionado2);
            
            novos_filhos.forEach(filho => {
                filhos.push(filho);
            });
        }

        // Mutacao nos filhos
        console.log("Filhos", filhos)
        filhos.forEach(filho => {
            filho.mutate();
        });

        elite.forEach(joao => {
            filhos.push(joao);
        });

        this.individuos = filhos;

        this.individuos.sort( () => ( 0.5 - Math.random()) );

        return this.individuos;

    }

}

popu = new Population([
    new Cromo([1, 2, 3, 4], 100), 
    new Cromo([6, 7, 8, 9], 98), 
    new Cromo([10, 11, 12, 13], 38),
    new Cromo([1, 21, 3, 4], 70), 
    new Cromo([6, 17, 8, 9], 98), 
    new Cromo([10, 31, 12, 13], 78),
    new Cromo([15, 27, 23, 4], 50), 
    new Cromo([6, 7, 8, 9], 38), 
    new Cromo([10, 19, 21, 13], 138),
    new Cromo([13, 27, 3, 4], 115)
])