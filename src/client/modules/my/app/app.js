import { LightningElement } from 'lwc';

const apiUrl = 'http://localhost:3002';
export default class App extends LightningElement {
    loggedIn = false;
    access_token;
    instance_url;

    login(event) {
        this.loggedIn = true;
        this.access_token = event.detail.access_token;
        this.instance_url = event.detail.instance_url;
    }


    //Makes a call to our api passing the token and the instance_url as a parameters, so we will download the metadata from our org
    retrieveMetadata () {
        fetch(apiUrl + '/api/v1/mdapi/retrieve', { 
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            
              //make sure to serialize your JSON body
              body: JSON.stringify({
                instance_url: this.instance_url,
                token: this.access_token
              })
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            window.open(data.file, '_blank');
        });
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
