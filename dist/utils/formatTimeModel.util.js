"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatModelDate = formatModelDate;
const date_fns_tz_1 = require("date-fns-tz");
function formatModelDate(model) {
    const timeZone = "Asia/Ho_Chi_Minh";
    const formatString = "HH:mm:ss-dd/MM/yyyy";
    const formatDate = (dateString) => {
        if (!dateString)
            return "";
        const date = new Date(dateString);
        const zonedDate = (0, date_fns_tz_1.toZonedTime)(date, timeZone);
        return (0, date_fns_tz_1.format)(zonedDate, formatString, { timeZone });
    };
    const formattedModel = { ...model };
    if (formattedModel?.createdAt) {
        formattedModel.createdAt = formatDate(formattedModel.createdAt);
    }
    if (formattedModel?.updatedAt) {
        formattedModel.updatedAt = formatDate(formattedModel.updatedAt);
    }
    return formattedModel;
}
