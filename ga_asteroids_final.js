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
        this.weigths[indice1] = this.weigths[indice2];
        this.weigths[indice2] = aux;
    }

    cruzamento(cromo) {
        let pivot = Math.round(this.weigths.length / 2);

        let child1 = this.weigths.slice(0, pivot).concat(cromo.weigths.slice(pivot, this.weigths.length));
        let child2 = cromo.weigths.slice(0, pivot).concat(this.weigths.slice(pivot, this.weigths.length));

        return [new Cromo(child1, 0), new Cromo(child2, 0)];
    }
}

class Population {
    constructor(individuos) {
        if (individuos) {
            this.individuos = individuos;
        } else {
            this.individuos = [];
        }

        this.popSize = this.individuos.length;
        this.generationNumber = 0;
        this.tx_cruzamento = 0.1;
    }

    seleciona_roleta() {
        let somatotal = 0;
        this.individuos.forEach(individio => {
            somatotal += individio.apitidao;
        });

        // Escolhe um valor aleatorio entre 0 e soma
        let r = Math.floor((Math.random() * somatotal)); 
        let soma2 = 0;

        for (let index = 0; index < this.individuos.length; index++) {
            soma2 += this.individuos[index].apitidao;

            if(soma2 > r) {
                return this.individuos[index];
            } 
        }

        return this.individuos[this.individuos.length - 1];
    }

    sort() {
        this.individuos.sort( (a, b) => (b.apitidao - a.apitidao) );
    }

    removeFromPopulation(individuo) {
        let selIndex = this.individuos.indexOf(individuo);
        this.individuos.splice(individuo, 1);
    }

    generation() {
        let elite = [];
        let filhos = [];
        
        this.sort();

        for (let index = 0; index < Math.ceil(this.individuos.length * this.tx_cruzamento); index++) {//removendo elite
            elite.push(this.individuos[index]);
            this.individuos.splice(index, 1);
        }

        //selecionando por roleta e fazendo cruzamento
        while(this.individuos.length > 0) {          
            let selecionado1 = this.seleciona_roleta();

            this.removeFromPopulation(selecionado1);
            
            let selecionado2 = this.seleciona_roleta(); 

            this.removeFromPopulation(selecionado2);
            
            let novos_filhos = selecionado1.cruzamento(selecionado2);
    
            novos_filhos.forEach(filho => {
                filhos.push(filho);
            });        
        }
        
        // Mutacao nos filhos
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

/*
popu = new Population([
    new Cromo(Array.from({length: 72}, () => Math.random()), Math.floor(Math.random() * 111)), 
    new Cromo(Array.from({length: 72}, () => Math.random()), Math.floor(Math.random() * 111)), 
    new Cromo(Array.from({length: 72}, () => Math.random()), Math.floor(Math.random() * 111)), 
    new Cromo(Array.from({length: 72}, () => Math.random()), Math.floor(Math.random() * 111)), 
    new Cromo(Array.from({length: 72}, () => Math.random()), Math.floor(Math.random() * 111)), 
    new Cromo(Array.from({length: 72}, () => Math.random()), Math.floor(Math.random() * 111)), 
    new Cromo(Array.from({length: 72}, () => Math.random()), Math.floor(Math.random() * 111)), 
    new Cromo(Array.from({length: 72}, () => Math.random()), Math.floor(Math.random() * 111)), 
    new Cromo(Array.from({length: 72}, () => Math.random()), Math.floor(Math.random() * 111)),
    new Cromo(Array.from({length: 72}, () => Math.random()), Math.floor(Math.random() * 111)),
    new Cromo(Array.from({length: 72}, () => Math.random()), Math.floor(Math.random() * 111))
]);
*/
