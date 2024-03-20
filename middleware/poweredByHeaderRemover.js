exports.removePoweredBy = (req, res, next) => {
    try{
        res.set('X-Powered-By', '');
        next();
    }
    catch(error){
        console.error(error)
    }
}