const http = require("http");
const express = require("express");

let app = express();

app.get('/', (req, res) => {
    console.log("get");
    res.end("get");
});

app.post('/', (req, res) => {
    console.log("post");
    res.end("post");
});

app.delete('/', (req, res) => {
    console.log("delete");
    res.end("delete");
});

app.put('/', (req, res) => {
    console.log("put");
    res.end("put");
});

app.copy('/', (req, res) => {
    console.log("copy");
    res.end("copy");
});

app.move('/', (req, res) => {
    console.log("move");
    res.end("move");
});

app.listen(80);