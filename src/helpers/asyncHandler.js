const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(error => {
            console.log('~~ error', error.message)
            next;
        });
    }
}

module.exports = asyncHandler;