const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
}

class PubSub {
    constructor({blockchain}) {
        this.blockchain = blockchain;
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();
        this.initialize();
        this.subscribeToChannels();

        
    }
    
    initialize() {
        this.publisher.connect();
        this.subscriber.connect();
        this.subscriber.on('message', (channel, message) => this.handleMessage(channel, message));

    }

    handleMessage(channel, message) {
        
        console.log("LOGGING: ", message);
        const parsedMessage = JSON.parse(message);

        if(channel === CHANNELS.BLOCKCHAIN) {
            this.blockchain.replaceChain(parsedMessage);
        }
    }

    subscribeToChannels() {
        Object.values(CHANNELS).forEach(channel => {
            this.subscriber.subscribe(channel, (message) => {                
                this.handleMessage(channel, message)
            });
        });
    }

    publish({ channel, message }) {
        this.publisher.publish(channel, message);
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }
}

module.exports = PubSub;