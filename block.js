const { GENESIS_DATA } = require("./config");
const cryptoHash = require('./crypto-hash');

class Block {
    constructor({timestamp, lastHash, hash, data}) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    static genesis() {
        return new Block(GENESIS_DATA)
    }

    static mineBlock({ lastBlock, data }) {
        const lastHash = lastBlock.hash;
        const timestamp = Date.now();
        return new this({ 
            lastHash,
            data,
            timestamp,
            hash: cryptoHash(lastHash, timestamp, data)
        });
    }
}



module.exports = Block;