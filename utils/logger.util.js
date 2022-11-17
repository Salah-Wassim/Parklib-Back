const logger = require('pino');

module.exports = logger({
    base:{pid:false},
    transport:{
        target:'pino-pretty',
        options:{
            colorize:true
        }
    },
    timestamp:()=>`,"time":"${new Date().toLocaleDateString()}"`
});
