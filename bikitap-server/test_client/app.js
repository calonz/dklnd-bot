const net = require('net');  

const client = net.createConnection({ port: 2589 }, () => { 
    
    const cbook = {
        req: 'CREATE_RETURN_BOOK',
        lew: 0,
        cindex : 0, 
        talep: 2,
        auth: "mami1212",
    };

    /*const login = {
        req: 'LOGIN',
        auth: "mami1212",
    };*/

    /*const getbooks = {
        req: 'GET_BOOKS',
        auth: "mami1212"
    }*/

    client.write(JSON.stringify(cbook));
}); 

client.on('data', (data) => { 
    console.log(data.toString()); 
    
}); 