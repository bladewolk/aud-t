const express = require('express');
var path = require('path');
const app = express();
const axios = require('axios');
const port = 3000;

app.use(express.static('dist'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.get('/audit', function (req, res) {
    let site = req.query.site;

    if (!site)
        return res.end(JSON.stringify([]));

    axios(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed/?url=${site}`)
        .then(result => {
            if (result.data) {
                let responseJson = result.data.lighthouseResult.audits;
                let tmp = [];

                Object.keys(responseJson).map(key => {
                    if (responseJson[key].details && responseJson[key].details.overallSavingsMs > 0) {
                        tmp.push({
                            title: responseJson[key].title,
                            time: responseJson[key].details.overallSavingsMs
                        });
                    }
                });

                tmp.sort((a, b) => {
                    if (a.time > b.time)
                        return -1;
                    if (a.time < b.time)
                        return 1;

                    return 0;
                });

                res.end(JSON.stringify(tmp));
            }
        })
        .catch(error => {
            res.end(JSON.stringify([]))
        });
});

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${port}`);
});


