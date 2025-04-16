export const handleSaveError = (error, doc, next)=> {
    error.status = 400;
    next();

};

export const setUpdateSattings = function(next){
    this.options.new = true;
    this.options.runValidators = true;
    next();

};
