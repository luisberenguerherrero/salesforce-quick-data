import { LightningElement } from 'lwc';

export default class App extends LightningElement {
    queryParameters = {};
    response_type = 'token';
    client_id =
        '3MVG9fTLmJ60pJ5KqkVKZFfWTM.5ktvGgnrTX5EBLW3Zo.gCG.PA1yqZYHPwPO4.PUmEQTLN6HEek64sfko.7';
    client_secret =
        'D206CA263E3532FB08C4A2D233E419EA89E0A940C2A6300C0348FEB1DA384D3E';
    redirect_uri = encodeURI('http://localhost:3001');
    urlLogin = `https://login.salesforce.com/services/oauth2/authorize?response_type=${this.response_type}&client_id=${this.client_id}&redirect_uri=${this.redirect_uri}`;

    connectedCallback() {
        if (localStorage.token === undefined) {
            this.queryParameters = this.getQueryParameters();
            if (!this.emptyParameters) {
                window.location.replace('http://localhost:3001');
                localStorage.instance_url = this.queryParameters.instance_url;
                localStorage.token = this.queryParameters.access_token;
            }
        }
    }

    handleCallout() {
        fetch(localStorage.instance_url + '/services/data/v45.0/sobjects/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.token}`
            }
        })
            .then(response => {
                console.log(response.json());
            })
            .catch(e => console.error(e));
    }

    getQueryParameters() {
        var params = {};
        var search = location.hash.substring(1);

        if (search) {
            params = JSON.parse(
                '{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
                (key, value) => {
                    return key === '' ? value : decodeURIComponent(value);
                }
            );
        }

        return params;
    }

    get emptyParameters() {
        for (let key in this.queryParameters) {
            if (this.queryParameters.hasOwnProperty(key)) return false;
        }
        return true;
    }

    get logged() {
        return localStorage.token !== undefined;
    }

    get token() {
        return localStorage.token;
    }
}
