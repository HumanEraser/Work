import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import {
    ret
} from './routes.js';

var app = await express(),
    server = http.Server(app),
    port = 13378;

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public', {
    strict: false
}));
app.use(ret());


server.listen(port, async function (err) {
    if (err) {
        throw err;
    } else {
        console.log('listening on port: ' + port);
    }
    console.log('Node Endpoints working :)');
});