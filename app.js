const express = require("express");
const Busboy = require("busboy");

let app = express();

app.disable("x-powered-by");

app.use(function(req, res, next)
{
    console.log("Connection...");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});

app.use(function(req, res, next)
{
    if (req.method != "OPTIONS" && req.method != "GET")
    {
        const busboy = new Busboy({headers: req.headers});

        if (!req.body) req.body = {};
    
        busboy.on('field', (fieldname, value) => 
        {
            req.body[fieldname] = value;
        });
    
        busboy.on('finish', () =>
        {
            handleRESTRequest(req.body, req.method)
            .then((answer) => 
            {
                res.end(answer);
            })
            .catch((error) =>
            {
                res.end(error);
            });
            
        });
    
        req.pipe(busboy);
    }
    next();
});

app.get('/**', (req, res) => 
{
    handleRESTRequest(req.query, 'GET')
    .then((answer) => 
    {
        res.end(answer);
    })
    .catch((error) =>
    {
        res.end(error);
    });
    
});
app.post('/**', () => {});
app.put('/**', () => {});
app.delete('/**', () => {});
app.copy('/**', () => {});
app.move('/**', () => {});

function handleRESTRequest(data, method)
{
    return new Promise((resolve, reject) =>
    {
        switch(method)
        {
            case "GET":
                console.log('GET');

                break;
            case "POST":
                console.log('POST');

                break;
            case "PUT":
                console.log('PUT');

                break;
            case "DELETE":
                console.log('DELETE');

                break;
            case "COPY":
                console.log('COPY');

                break;
            case "MOVE":
                console.log('MOVE');
                
                break;
            default:
                reject("Undefined method");
        }
        resolve(method);
    });
}


app.listen(80);