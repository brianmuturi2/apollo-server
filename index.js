const setUp = require('./server')

setUp().then(server => {
    server.listen().then(({url}) => {
        console.log(`Server ready at ${url}`);
    })
});

