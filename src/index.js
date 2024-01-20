const express = require('express');
const fs = require('fs')
const path = require('path')

const app = express();
const PORT = 8000;
const IP = '127.0.0.1';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', express.static(path.resolve('public')));
app.use('/src', express.static(path.resolve('src')));
app.post('/download', (req, res) => {
    var pos = req.body['pos'];
    fs.readFile(path.resolve('data', `${pos}`), (err, data) => {
        if(!err && data) {
            res.send({ [pos] : JSON.parse(String(data)) });
        } else {
            res.send({ 'ERROR' : err});
        }
    })
})
app.post('/upload', (req, res) => {
    var data = req.body;
    for (const pos in data) {
        fs.writeFile(path.resolve('data', `${pos}`), String(JSON.stringify(data[pos])), (err) => {
            if(!err) {
                res.send(err);
            } else {
                res.send({ 'ERROR' : err});
            }
        })
    }
})

app.listen(PORT, IP);