import axios from "axios";
import {RowData} from "../../components/Home";
import {HOST,PORT} from "../../components/const";

export interface dateAndShift {
    date: Date;
    shift: string;
}

export const fetchActivitiesInMount = async (details: dateAndShift) => {
    try {
        const date = details.date;
        const shift = details.shift;
        const response = await axios.get(`http://${HOST}:${PORT}/activities/getallbydateandshitf/${date}/${shift}`);
        return response.data

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response;
        } else {
            console.error({
                timestamp: new Date().toISOString(),
                status: 0,
                error: "Not Specified",
                message: "Error Occurred"
            });
            return error.response;
        }
    }
};

export const createDailyRecords = async (details: dateAndShift) => {
    try {
        const date = details.date;
        const response = await axios.get(`http://${HOST}:${PORT}/records/create/daily/${date}`);
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response;
        } else {
            console.error({
                timestamp: new Date().toISOString(),
                status: 0,
                error: "Not Specified",
                message: "Error Occurred"
            });
            return error.response;
        }
    }
};

export const updateRecordsForStatus = async (details: RowData) => {
    try {
        const response = await axios.post(`http://${HOST}:${PORT}/records/update/status`, details);
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response;
        } else {
            console.error({
                timestamp: new Date().toISOString(),
                status: 0,
                error: "Not Specified",
                message: "Error Occurred"
            });
            return error.response;
        }
    }
};

export const updateRecordsForConfirmation = async (details: RowData) => {
    try {
        const response = await axios.post(`http://${HOST}:${PORT}/records/update/confirmation`, details);
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response;
        } else {
            console.error({
                timestamp: new Date().toISOString(),
                status: 0,
                error: "Not Specified",
                message: "Error Occurred"
            });
            return error.response;
        }
    }
};

export const updateRecordsForComment = async (details: RowData) => {
    try {
        const response = await axios.post(`http://${HOST}:${PORT}/records/update/comment`, details);
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response;
        } else {
            console.error({
                timestamp: new Date().toISOString(),
                status: 0,
                error: "Not Specified",
                message: "Error Occurred"
            });
            return error.response;
        }
    }
};