class Gene {
    constructor(weigths) {
        if (weigths) {
            this.weigths = weigths;
        } else {
            this.weigths = [];
        }
        
        this.cost = 9999;
    }

    random(length) {
        while (length--) {
            this.weigths += String.fromCharCode(Math.floor(Math.random() * 255));
        }
    }

    mutate(chance) {
        if (Math.random() > chance) return;

        let index = Math.floor(Math.random() * this.weigths.length);
        let upOrDown = Math.random() <= 0.5 ? -1 : 1;
        let newChar = String.fromCharCode(this.weigths.charCodeAt(index) + upOrDown);
        let newString = '';
        for (let i = 0; i < this.weigths.length; i++) {
            if (i == index) newString += newChar;
            else newString += this.weigths[i];
        }

        this.weigths = newString;
    }

    mate(gene) {
        let pivot = Math.round(this.weigths.length / 2) - 1;

        let child1 = this.weigths.substr(0, pivot) + gene.weigths.substr(pivot);
        let child2 = gene.weigths.substr(0, pivot) + this.weigths.substr(pivot);

        return [new Gene(child1), new Gene(child2)];
    }

    calcCost(compareTo) {
        let total = 0;
        for (let i = 0; i < this.weigths.length; i++) {
            total += (this.weigths.charCodeAt(i) - compareTo.charCodeAt(i)) * (this.weigths.charCodeAt(i) - compareTo.charCodeAt(i));
        }
        this.cost = total;
    }

}

class Population {
    constructor(goal, size) {
        this.members = [];
        this.goal = goal;
        this.generationNumber = 0;
        while (size--) {
            let gene = new Gene();
            gene.random(this.goal.length);
            this.members.push(gene);
        }
    }

    sort() {
        this.members.sort( (a, b) => (a.cost - b.cost) );
    }

    generation() {
        for (let i = 0; i < this.members.length; i++) {
            this.members[i].calcCost(this.goal);
        }

        this.sort();

        let children = this.members[0].mate(this.members[1]);
        this.members.splice(this.members.length - 2, 2, children[0], children[1]);

        for (let i = 0; i < this.members.length; i++) {
            this.members[i].mutate(0.5);
            this.members[i].calcCost(this.goal);
            if (this.members[i].weigths == this.goal) {
                this.sort();
                return true;
            }
        }
        this.generationNumber++;
        
        let scope = this;
        //console.log(scope)
        setTimeout(
            () => scope.generation(), 
            20
        );
        
    }

}

let population = new Population("-123456789", 30);
population.generation();