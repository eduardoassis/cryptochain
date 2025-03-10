const Blockchain = require('./blockchain');
const Block = require('./block');
const cryptoHash = require('./crypto-hash')

describe('Blockchain', () => {
    let blockchain, newChain, originalChain;

    beforeEach(() => {
        blockchain = new Blockchain();
        originalChain = blockchain.chain;
        newChain = new Blockchain();
    });

    it('contains a `chain` Array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true);

    });

    it('starts with the genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block to the chain', () => {
        const newData = 'foo bar';
        blockchain.addBlock({ data: newData });
        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
    });

    describe('isValidChain()', () => {
        describe('when then chain does not start with the genesis block', () => {
            it('returns false', () => {
                blockchain.chain[0] = { data: 'fake-genesis'};
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });
    
        describe('when the chain starts with the genesis block and has multiple blocks', () => {

            beforeEach(() => {
                blockchain.addBlock({ data: 'Bears' });
                blockchain.addBlock({ data: 'Beets' });
                blockchain.addBlock({ data: 'Battlestart Galatica' });
            });
            describe('and a lastHash reference has changed', () => {
                it('returns false', () => {
                    blockchain.chain[3].lastHash = 'broken-lastHash';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });
    
            describe('and the chain contains a block with an invalid field', () => {
                it('return false', () => {
                    blockchain.chain[3].data = 'some-bad-and-evil-data';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });
    
            describe('and the chain contains a block with a jumped difficulty', () => {
                it('return false', ()=> {
                    const lastBlock = blockchain.chain[blockchain.chain.length-1];

                    const lastHash = lastBlock.hash;
                    const timestamp = Date.now();
                    const nonce = 0;
                    const data = [];
                    const difficulty = lastBlock.difficulty - 3;
                    const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data);

                    const badBlock = new Block({
                        timestamp,
                        lastHash, 
                        hash,
                        nonce, 
                        difficulty,
                        data
                    });

                    blockchain.chain.push(badBlock);

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });
            describe('and the chain does not contain any invalid blocks', () => {
                it('return true', () =>{
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });

    describe('replaceChain()', () => {
        let errorMock, logMock;
        beforeEach(() => {
            errorMock = jest.fn();
            logMock = jest.fn();
            global.console.error = errorMock;
            global.console.log = logMock;
        });
        describe('when the new chain is not longer', () => {
            it('does not replace the chain', () => {
                newChain.chain[0] = { new: 'chain' };
                blockchain.replaceChain(newChain.chain);
                expect(blockchain.chain).toEqual(originalChain);
            });

        });

        describe('when the new chain is longer', () => {
            beforeEach(() => {
                newChain.addBlock({ data: 'Bears' });
                newChain.addBlock({ data: 'Beets' });
                newChain.addBlock({ data: 'Battlestart Galatica' });
            });
            describe('and the chain is invalid', () => {
                beforeEach(() => {
                    newChain.chain[2].hash = 'some-fake-hash';
                    blockchain.replaceChain(newChain.chain);
                });
                it('does not replace the chain', () => {
                    expect(blockchain.chain).toEqual(originalChain);
                });


                it('logs an error', () => {
                    expect(errorMock).toHaveBeenCalled();
                });
                
            });

            describe('and the chain is valid', () => {
                beforeEach(() => {
                    blockchain.replaceChain(newChain.chain);
                });
                it('replaces the chain', () => {
                    expect(blockchain.chain).toEqual(newChain.chain);
                });

                it('logs an info', () => {
                    expect(logMock).toHaveBeenCalled();
                });
            });
        });
    });
});