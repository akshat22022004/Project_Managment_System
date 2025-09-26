import { ApiResponse } from "../utils/api-response.js";

const healthcheck = async (req, res) => {
    try{
        return res.status(200).json(new ApiResponse(200, "Success"))
    }catch(error){
        return res.status(500).json(new ApiError(500, "Something went wrong"))
    }
};  

export  {healthcheck}
