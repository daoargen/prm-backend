"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.overwriteResponseJSON = void 0;
const overwriteResponseJSON = async (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = (data) => {
        res.json = originalJson;
        if (data?.statusCode && Number.isFinite(data.statusCode)) {
            return res.status(data.statusCode).json(data);
        }
        else {
            return res.status(200).json(data);
        }
    };
    next();
};
exports.overwriteResponseJSON = overwriteResponseJSON;
