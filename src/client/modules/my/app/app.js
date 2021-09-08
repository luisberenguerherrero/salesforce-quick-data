import { LightningElement } from 'lwc';

export default class App extends LightningElement {
    loggedIn = false;
    access_token;
    instance_url;

    login(event) {
        this.loggedIn = true;
        this.access_token = event.detail.access_token;
        this.instance_url = event.detail.instance_url;
    }

    handleCallout() {
        fetch(localStorage.instance_url + '/services/data/v45.0/sobjects/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.token}`
            }
        })
            .then((response) => {
                console.log(response.json());
            })
            .catch((e) => console.error(e));
    }

    get emptyParameters() {
        for (let key in this.queryParameters) {
            if (this.queryParameters[key]) return false;
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
