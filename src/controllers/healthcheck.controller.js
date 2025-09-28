import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
/** 
const healthcheck = async (req, res , next) => {
    try{
        return res.status(200).json(new ApiResponse(200, "Success"))
    }catch(error){
        next(error)
    }
};  
*/

const healthCheck = asyncHandler(async (req, res) => {
     res.status(200).json(
        new ApiResponse(200, {message : "server is running"})
    );
});

export  {healthCheck}
