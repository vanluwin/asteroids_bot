class Mlp {
    // Fully-connected Multi-Layer Perceptron (MLP)
    constructor(inputSize, hiddenSize, outputSize, learning_rate = 0.01, bias = 1) {
        this.inputSize = inputSize;
        this.hiddenSize = hiddenSize;
        this.outputSize = outputSize;
        this.lr = learning_rate;
        this.bias = bias;

        // Weights
        this.w1 = nj.random([this.inputSize + 1, this.hiddenSize]);
        this.w2 = nj.random([this.hiddenSize, this.outputSize]);
    }

    // Faz uma predição
    predict(inp) {
        let net1 = nj.sigmoid(nj.dot(inp, this.w1));
        let net2 = nj.sigmoid(nj.dot(net1, this.w2));

        return net2;
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