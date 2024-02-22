const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(err => {
            console.log('~~ error', err)
            next(err);
        });
    }
}

module.exports = asyncHandler;