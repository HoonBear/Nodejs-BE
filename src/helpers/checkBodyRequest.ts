import express from 'express';
import { validationResult } from 'express-validator';
import { ResponseData } from '../models/response';


const checkBodyData = <T>(req: express.Request, resp: express.Response): ResponseData<T> | null => {
    const responseData = new ResponseData<T>();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        resp.status(400).json({
            data: {
                error_codes: ["bad_request"]
            },
            success: false
        })
        return null
    } else {
        return responseData;
    }

}

export default checkBodyData;
