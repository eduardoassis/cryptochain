const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST'
}

class PubSub {
    constructor() {
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();
        this.initialize();
    }
    
    async initialize() {
        await this.publisher.connect();
        await this.subscriber.connect();
        await this.subscriber.subscribe(CHANNELS.TEST, (message) => {
            this.handleMessage(CHANNELS.TEST, message);
        });
    }

    handleMessage(channel, message) {
        console.log(`Message received, Channel: ${channel}. Message: ${message}`)
    }
}

(async () => {
    const testPubSub = new PubSub();

    setTimeout(() => testPubSub.publisher.publish(CHANNELS.TEST, 'foo'), 1000);

})();