
import { TIMEOUT_SEC } from "./config";
// function of this file is to contain a couple of functions that we reuse over and over in our project.


// Timeout function jasma chei (seconds) halna milxa ra tyo seconds samma kei kura run bahyena bhane yesle promise reject gariidnxa.
const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};


export const AJAX = async function (url, uploadData = undefined) {  // url le matra call garda , there will be no upload dadta
    try {
        const fetchPro = uploadData ? fetch(url, {   // url ani second bhaneko options.
            method: 'POST',
            headers: { //we also need to pass the object of headers. Headers bhaneko chei they are some snippet of texts which are like information about the requests itself
                'Content-Type': 'application/json', // yo bhannu bbhahneko chei, we specify in the request that the data we are gonna send is going to be in the  json format. So only than our api cann correctly accept the data and create a new recipe in the database.
                body: JSON.stringify(uploadData)  // the actual data we want to send
            },
            body: JSON.stringify(uploadData)
        }) : fetch(url)



        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]) // race garauxa. fetch function or timeout function jun suru ma chalxa tei matra run hunxa. So 10 sec samma ni fetch chalena bhane timeourt function run hunxa.
        const data = await res.json()

        if (!res.ok) throw new Error(`${data.message} (${res.status})`)
        console.log(res, data)
        return data
    } catch (err) {
        console.error(err)
        throw err;  // So yaha chei kina throw error gareko bhanda ya throw error garena bhane prommise still fullfill hunxa ra  yesko error yehi fyalxa. Ani model.js ko catch error ma chei cannot read properties of undefined 'data' aundefined bhanera auxa cause of this error. 
        // so teslai solve garna hami yaha bata error lai throw garxam so that yesko promise reject hunxa ani model.js mai esko real error catch garxa. So (yesbata)
    }

}
/*
export const getJson = async function (url) {
    try {
        fetchPro = fetch(url)
        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]) // race garauxa. fetch function or timeout function jun suru ma chalxa tei matra run hunxa. So 10 sec samma ni fetch chalena bhane timeourt function run hunxa.
        const data = await res.json()

        if (!res.ok) throw new Error(`${data.message} (${res.status})`)
        console.log(res, data)
        return data
    } catch (err) {
        console.error(err)
        throw err;  // So yaha chei kina throw error gareko bhanda ya throw error garena bhane prommise still fullfill hunxa ra  yesko error yehi fyalxa. Ani model.js ko catch error ma chei cannot read properties of undefined 'data' aundefined bhanera auxa cause of this error. 
        // so teslai solve garna hami yaha bata error lai throw garxam so that yesko promise reject hunxa ani model.js mai esko real error catch garxa. So (yesbata)
    }

}


export const sendJSON = async function (url, uploadData) {
    try {
        const fetchPro = fetch(url, {   // url ani second bhaneko options.
            method: 'POST',
            headers: { //we also need to pass the object of headers. Headers bhaneko chei they are some snippet of texts which are like information about the requests itself
                'Content-Type': 'application/json', // yo bhannu bbhahneko chei, we specify in the request that the data we are gonna send is going to be in the  json format. So only than our api cann correctly accept the data and create a new recipe in the database.
                body: JSON.stringify(uploadData)  // the actual data we want to send
            },
            body: JSON.stringify(uploadData)
        })
        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)])
        const data = await res.json() // this will return the data that we just sent

        if (!res.ok) throw new Error(`${data.message} (${res.status})`)
        console.log(res, data)
        return data
    } catch (err) {
        console.error(err)
        throw err;
    }
}

*/ 