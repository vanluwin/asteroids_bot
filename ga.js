class Cromo {
    constructor(weights = 0, pontuacao = 0) {
        this.weights = weights;
       
        this.aptidao = pontuacao;
    }

    mutate() {
        console.log("MUTOU");
        for(let i=0; i < this.weights.length; i++){
            if(Math.random()<1){
                this.weights[i] = Math.random();
            }
        }
    }

    cruzamento(cromo) {
        let pivot = Math.round(this.weights.length / 2);
        let child1 = this.weights.slice(0, pivot).concat(cromo.weights.slice(pivot, this.weights.length));
        let child2 = cromo.weights.slice(0, pivot).concat(this.weights.slice(pivot, this.weights.length));

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
        this.tx_cruzamento = 0.0;
    }

    seleciona_roleta() {
        let somatotal = 0;
        this.individuos.forEach(individuo => {
            somatotal += individuo.aptidao;
        });

        // Escolhe um valor aleatorio entre 0 e soma
        let r = Math.floor((Math.random() * somatotal)); 
        let soma2 = 0;

        for (let index = 0; index < this.individuos.length; index++) {
            soma2 += this.individuos[index].aptidao;

            if(soma2 > r) {
                return this.individuos[index];
            } 
        }

        return this.individuos[this.individuos.length - 1];
    }

    sort() {
        this.individuos.sort( (a, b) => (b.aptidao - a.aptidao) );
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
        while(this.individuos.length > 1) {          
            let selecionado1 = this.seleciona_roleta();

            this.removeFromPopulation(selecionado1);
            
            let selecionado2 = this.seleciona_roleta(); 

            this.removeFromPopulation(selecionado2);

            let novos_filhos = selecionado1.cruzamento(selecionado2);
            novos_filhos.forEach(filho => {
                filhos.push(filho);
            });        
        }
        if(this.individuos.length >0)
            filhos.push(this.individuos[this.individuos.length-1]);
        
        console.log(filhos.length);
        // Mutacao nos filhos
        //5% de chance de mutar
        filhos.forEach(filho => {
            if(Math.random()<1)
                filho.mutate();
        });

        // for(let i = 0; i<filhos.length; i++)
        //     if(Math.random()<1)
        //          filhos[i].mutate();

        elite.forEach(joao => {
            filhos.push(joao);
        });

        this.individuos = filhos;
        this.individuos.sort( () => ( 0.5 - Math.random()) );
        return this.individuos;

    }

}