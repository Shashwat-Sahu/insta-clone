if(process.env.NODEENV==='production'){
    module.exports = require('./prod')
}
else{
    module.exports = require('./dev')
}