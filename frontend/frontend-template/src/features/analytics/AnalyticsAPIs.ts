import axios from "axios";

export const fetchPieChartData = async (date: Date, shift:string) => {
    try {

        const response = await axios.get(`http://10.18.40.11:8080/activities/getanalyticsbydateandshitf/${date}/${shift}`);
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

export const fetchPieChartSummaryData = async (date: Date) => {
    try {

        const response = await axios.get(`http://10.18.40.11:8080/activities/getanalyticsSummarybydate/${date}`);
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