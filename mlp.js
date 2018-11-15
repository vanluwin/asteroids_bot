class Mlp {
    // Fully-connected Multi-Layer Perceptron (MLP)
    constructor(inputSize, hiddenSize, outputSize, learning_rate = 0.01, bias = 1) {
        this.inputSize  = inputSize;
        this.hiddenSize = hiddenSize;
        this.outputSize = outputSize;
        this.lr         = learning_rate;
        this.bias       = bias;

        // Weights
        this.w1 = nj.random([this.inputSize + 1, this.hiddenSize]);
        this.w2 = nj.random([this.hiddenSize, this.outputSize]);

    }

    // Faz uma predição
    predict(inp) {
        let net1 = nj.sigmoid( nj.dot(inp, this.w1) );
        let net2 = nj.sigmoid( nj.dot(net1, this.w2) );

        return net2;
    }

    getWeights() {
        let w1 = new Array(this.w1.flatten().selection.data);
     
        let  w2 = new Array(this.w2.flatten().selection.data);

        let weights = w1.concat(w2);

        return weights;
    }
}