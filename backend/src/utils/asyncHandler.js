// Promise method

const asyncHandler = (requestHander) => (req, res , next) => {
    Promise.resolve(requestHander(req , res , next))
    .catch((err) => next(err))
};

export {asyncHandler};



// try and catch method 
// for try and catch method we use higher order function - A function which recieves a function as a parameter and treat it like a variable

// const asyncHandler = (func) => async (req , res , next) => {
//     try {
//         await func(req , res , next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message,
//         })
//     }
// }