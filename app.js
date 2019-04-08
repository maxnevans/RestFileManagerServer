const express = require("express");
const Busboy = require("busboy");
const fs = require("fs");

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
                let strError = JSON.stringify({
                    error : error.toString()
                });
                res.end(strError);
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
        res.end(error.toString());
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
                fs.readFile(data['file_name'], (err, content) => 
                {
                    if (err)
                    {
                        reject(err);
                    }
                    else
                    {
                        let response = JSON.stringify({
                            success : 'file has been read',
                            fileContent : content.toString()
                        });
                        resolve(response);
                    }
                });
                break;
            case "POST":
                console.log('POST');
                fs.appendFile(data['file_name'], data['file_content'],  (err) => 
                {
                    if (err)
                    {
                        reject(err);
                    }
                    else
                    {
                        let response = JSON.stringify({
                            success : 'file has been appended'
                        });
                        resolve(response);
                    }
                });
                break;
            case "PUT":
                console.log('PUT');
                fs.writeFile(data['file_name'], data['file_content'],  (err) => 
                {
                    if (err)
                    {
                        reject(err);
                    }
                    else
                    {
                        let response = JSON.stringify({
                            success : 'file has been written'
                        });
                        resolve(response);
                    }
                });
                break;
            case "DELETE":
                console.log('DELETE');
                fs.unlink(data['file_name'], (err) =>
                {
                    if (err)
                    {
                        reject(err);
                    }
                    else
                    {
                        let response = JSON.stringify({
                            success : 'file has been deleted'
                        });
                        resolve(response);
                    }
                });
                break;
            case "COPY":
                console.log('COPY');
                fs.copyFile(data['file_name'], data['copy_name'], (err) =>
                {
                    if (err)
                    {
                        reject(err);
                    }
                    else
                    {
                        let response = JSON.stringify({
                            success : 'file has been copied'
                        });
                        resolve(response);
                    }
                });
                break;
            case "MOVE":
                console.log('MOVE');
                fs.rename(data['file_name'], data['new_name'], (err) =>
                {
                    if (err)
                    {
                        reject(err);
                    }
                    else
                    {
                        let response = JSON.stringify({
                            success : 'file has been moved'
                        });
                        resolve(response);
                    }
                });
                break;
            default:
                reject("Undefined method");
        }
    });
}


app.listen(80);