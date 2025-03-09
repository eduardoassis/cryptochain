const MINE_RATE = 1000; // 1 second
const INITIAL_DFFICULTY = 3;


const GENESIS_DATA = {
    timestamp: 1,
    lastHash: '------',
    hash: 'bar-hash',
    difficulty: INITIAL_DFFICULTY,
    nonce: 0,
    data: []
};

module.exports = { GENESIS_DATA, MINE_RATE };