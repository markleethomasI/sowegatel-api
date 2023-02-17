class ApiError extends Error{
    constructor(errorObj){
        super(errorObj.message)
        this.responseCode = errorObj.responseCode
    }
}

module.exports = ApiError