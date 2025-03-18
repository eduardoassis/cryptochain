const _ = require('lodash');
const bodyParser = require('body-parser');
const express = require('express');
const Blockchain = require('./blockchain');

const app = express();
const blockchain = new Blockchain();

app.use(bodyParser.json());

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    const { data } = _.cloneDeep(req.body);
    const sanitizedData = Object.create(null);
    Object.assign(sanitizedData, data);

    blockchain.addBlock({ data });
    res.redirect('/api/blocks');
});

const PORT = 3000;
app.listen(PORT, ()=> console.log(`listining at localhost:${PORT}`));