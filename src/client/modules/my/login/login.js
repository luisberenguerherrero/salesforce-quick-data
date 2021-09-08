import { LightningElement } from 'lwc';

const RESPONSE_TYPE = 'token';
const CLIENT_ID =
    '3MVG9fTLmJ60pJ5KqkVKZFfWTM.5ktvGgnrTX5EBLW3Zo.gCG.PA1yqZYHPwPO4.PUmEQTLN6HEek64sfko.7';
/* const CLIENT_SECRET =
    'D206CA263E3532FB08C4A2D233E419EA89E0A940C2A6300C0348FEB1DA384D3E'; */
const REDIRECT_URI = encodeURI('http://localhost:3001');
const URL_LOGIN = `https://login.salesforce.com/services/oauth2/authorize?response_type=${RESPONSE_TYPE}&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
export default class Login extends LightningElement {
    access_token;
    instance_url;

    urlLogin = URL_LOGIN;

    connectedCallback() {
        let queryParameters = this.getQueryParameters();
        if (queryParameters) {
            this.instance_url = queryParameters?.instance_url;
            this.access_token = queryParameters?.access_token;

            const loginEvent = new CustomEvent('login', {
                detail: {
                    access_token: this.access_token,
                    instance_url: this.instance_url
                }
            });
            this.dispatchEvent(loginEvent);
        }
    }

    getQueryParameters() {
        var params;
        var search = window.location.hash.substring(1);

        if (search) {
            params = JSON.parse(
                '{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
                (key, value) => {
                    return key === '' ? value : decodeURIComponent(value);
                }
            );
        }
        console.log(params);
        return params;
    }
}
