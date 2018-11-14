class MLP {
    // Fully-connected Multi-Layer Perceptron (MLP)
    constructor(inputSize, hiddenSize, outputSize, learning_rate = 0.01, bias = 1, epochs = 100, debug = false) {
        this.inputSize  = inputSize;
        this.hiddenSize = hiddenSize;
        this.outputSize = outputSize;
        this.lr         = learning_rate;
        this.bias       = bias;
        this.epochs     = epochs;
        this.debug      = debug;

        // Weights
        this.w1 = nj.random([this.inputSize + 1, this.hiddenSize]);
        this.w2 = nj.random([this.hiddenSize, this.outputSize]);

    }

    // Implementa a Sigmoid como função de ativação
    sigmoid(x) {
        return 1/( 1 + Math.exp(x) );
    }

    // Implementa a derivada da Sigmoid
    sigmoidPrime(x) {
        return x * (1 - x);
    }

    // Faz uma predição
    predict(inp) {
        net1 = this.sigmoid( nj.dot(inp, this.w1) );
        net2 = this.sigmoid( nj.dot(net1, this.w2) );

        return net2;
    }

    train(inputs, outputs) {

    }

    getWeights() {
        console.log("\n___Weights___");
    }
}