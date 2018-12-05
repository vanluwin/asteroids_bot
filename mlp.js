class Mlp {
    // Fully-connected Multi-Layer Perceptron (MLP)
    constructor(inputSize, hiddenSize, outputSize, bias = 1) {
        this.inputSize = inputSize;
        this.hiddenSize = hiddenSize;
        this.outputSize = outputSize;
        this.bias = bias;

        // Weights
        this.w1 = nj.random([this.inputSize + 1, this.hiddenSize]).multiply(2).subtract(1);
        this.w2 = nj.random([this.hiddenSize, this.outputSize]).multiply(2).subtract(1);

    }

    // Faz uma predição
    predict(inp) {
        inp = inp.map(el => el/200);
        let net1 = this.degrau([...nj.dot([...inp, this.bias], this.w1).selection.data]);
        let net2 = this.degrau([...nj.dot(net1, this.w2).selection.data]);
        // let net1 = [...nj.dot([...inp, this.bias], this.w1).selection.data];
        // let net2 = [...nj.dot(net1, this.w2).selection.data];

        // console.log(net2);
        return net2;
    }

    degrau(array){
        array = array.map(n => {
            return n>0 ? 1 : 0;            
        });
        return array;
    }
    // Retorna os pesos para a GA
    getWeights() {
        let w1 = this.w1.flatten().selection.data;

        let w2 = this.w2.flatten().selection.data;

        return [...w1, ...w2];
    }

    // Recebe os pesos da GA
    setWeights(newWeights) {

        let index = (this.inputSize + 1) * this.hiddenSize;
        let index2 = index + (this.hiddenSize * this.outputSize);

        this.w1 = nj.array(newWeights.slice(0, index)).reshape([this.inputSize + 1, this.hiddenSize]);

        this.w2 = nj.array(newWeights.slice(index, index2)).reshape([this.hiddenSize, this.outputSize]);
    }
}