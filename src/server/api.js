// Simple Express server setup to serve for local testing/dev API server
const compression = require('compression');
const helmet = require('helmet');
const express = require('express');

const app = express();
app.use(helmet());
app.use(compression());

//sfdx configuration
const sfdx = require('sfdx-node');
app.use(express.static('public'));
//Fixed test data that we no longer need
/* const instance_url = 'https://deloitteie3-dev-ed.my.salesforce.com';
const token =
    '00D09000007wtJ4!AQEAQFZuqsxCJIVFXIXCQXjC0SGFcVHxfxu3rMi3usMm7N8D6C.BsEDd733n9ye4pRXvcKZE32c4wvYZT1bvEaTshIcXr8IN';
const name = 'Test'; */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const HOST = process.env.API_HOST || 'localhost';
const PORT = process.env.API_PORT || 3002;

const cors = require('cors');
app.use(
    cors({
        origin: `http://localhost:3001`
    })
);

/* app.get('/api/login', (req, res) => {
    sfdx.auth.accesstoken
        .store({
            instanceurl: instance_url,
            noprompt: `${instance_url}!${token}`,
            setalias: name
        })
        .then((result) => {
            console.log('Display: ', result);
        })
        .catch((error) => {
            console.error('Errors: ', error);
        });
});
 */
app.use('/api/file', (req, res) => {
    res.sendFile('./public/package.xml', { root: __dirname });
});

app.use('/api/metadata', (req, res) => {
    res.sendFile('./files/unpackaged.zip', { root: __dirname });
});

app.get('/api/v1/open', (req, res) => {
    sfdx.force.org
        .open({
            targetusername: 'developer',
            _rejectOnError: true
        })
        .then((result) => {
            console.log('Display: ', result);
        })
        .catch((error) => {
            console.error('Errors: ', error);
        });
    res.json({ success: true });
});

//main method to retrieve a .zip package based on a fixed package.xml, susceptible to make it dynamic
app.post('/api/v1/mdapi/retrieve', (req, res) => {
    console.log('Loading');
    console.log(req.body.instance_url);
    console.log(req.body.token);
    let current_instance_url = req.body.instance_url;
    let current_token = req.body.token;
    //first set the global variable to the instance we are logged in
    sfdx.config
        .set(
            {
                global: true,
                _rejectOnError: true
            },
            {
                args: ['instanceUrl=' + current_instance_url]
            }
        )
        .then((result) => {
            console.log('Token we keep: ', current_token);
            console.log('Result: ', result);
            //check the orgs by listing them
            sfdx.config.list().then((result2) => {
                console.log('List of orgs: ', result2);
            });

            //retrieve metadata based on the package.xml located in server/public/package.xml
            sfdx.force.mdapi
                .retrieve({
                    targetusername: current_token,
                    unpackaged: __dirname + '\\public\\package.xml',
                    json: true,
                    retrievetargetdir: __dirname + '\\files\\',
                    _quiet: false,
                    _rejectOnError: true
                })
                //if successful, send the url to download the .zip package
                .then((listResult) => {
                    res.json({
                        success: true,
                        output: listResult,
                        file: `http://${HOST}:${PORT}/api/metadata`
                    });
                    //res.json(listResult);
                })
                .catch((retrieveError) => {
                    console.error('Errors: ', retrieveError);
                    res.json({ error: retrieveError });
                });
        })
        .catch((error) => {
            console.error('Error setting global variable: ', error);
        });
});

app.get('/api/v1/source/retrieve', (req, res) => {
    sfdx.force.source
        .retrieve({
            targetusername: 'developer',
            manifest: __dirname + '\\public\\package.xml',
            //retrievetargetdir: __dirname + '\\files\\',
            _quiet: false,
            _rejectOnError: true
        })
        .then((listResult) => {
            res.json(listResult);
        })
        .catch((retrieveError) => {
            console.error('Errors: ', retrieveError);
            res.json({ error: retrieveError });
        });

});

app.listen(PORT, () =>
    console.log(
        `✅  API Server started: http://${HOST}:${PORT}/`
    )
);
