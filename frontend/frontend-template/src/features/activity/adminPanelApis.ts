import axios from "axios";
import { HOST, PORT } from "../../components/const";

export interface DateAndShift {
    date: Date;
    shift: string;
}

export interface ActivityCountsResponse {
    activities: ActivityResponse[];
    totalCount: number;
    completedCount: number;
    pendingCount: number;
    notApplicableCount: number;
}

export interface ActivityResponse {
    id: string;
    activityId: string;
    name: string;
    scheduleTime: string;
    time: string;
    description: string;
    shift: string;
    recordId: string;
    activityOrder: number;
    user: string;
    confirmUser: string;
    confirmation: boolean;
    status: string;
    completedTime?: string;
    confirmTime?: string;
    date: Date;
    comment?: string;
}

export const fetchActivityCounts = async (details: DateAndShift): Promise<ActivityCountsResponse | any> => {
    try {
        // Format date to ISO string (or your preferred format)
        const formattedDate = details.date.toISOString().split('T')[0]; // YYYY-MM-DD format
        const shift = details.shift;

        const response = await axios.get<ActivityCountsResponse>(
            `http://${HOST}:${PORT}/activities/getallwithcountsbydateandshift/${formattedDate}/${shift}`
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Handle Axios errors with response
            console.error({
                timestamp: new Date().toISOString(),
                status: error.response.status,
                error: error.response.statusText,
                message: error.response.data?.message || "Error fetching activity counts"
            });
            return error.response;
        } else {
            // Handle other errors
            console.error({
                timestamp: new Date().toISOString(),
                status: 0,
                error: "Not Specified",
                message: "Network or unexpected error occurred"
            });
            return {
                status: 0,
                error: "Network Error",
                message: "Unable to connect to the server"
            };
        }
    }
};

// Admin Panel - Activity Controller page API's
// NEW METHODS FOR ACTIVITY MANAGEMENT

export interface ActivityData {
    id?: string;
    name: string;
    scheduleTime: string;
    time: string;
    shift: string;
    activityOrder: number;
    description?: string;
    isActive?: boolean;
    records?: any[];
}

export const getActivityById = async (id: string): Promise<ActivityData> => {
    try {
        const response = await axios.get(`http://${HOST}:${PORT}/activities/${id}`);
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const createActivity = async (activity: ActivityData): Promise<ActivityData> => {
    try {
        const response = await axios.post(`http://${HOST}:${PORT}/activities/create`, activity);
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const updateActivity = async (id: string, activity: ActivityData): Promise<ActivityData> => {
    try {
        const response = await axios.put(`http://${HOST}:${PORT}/activities/update/${id}`, activity);
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const deleteActivity = async (id: string): Promise<ActivityData> => {
    try {
        const response = await axios.put(`http://${HOST}:${PORT}/activities/delete/${id}`);
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const getAllActivities = async (): Promise<ActivityData[]> => {
    try {
        const response = await axios.get(`http://${HOST}:${PORT}/activities/all`);
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

// export const getAllActivities = async (shift) => {
//   const response = await axios.get(`http://${HOST}:${PORT}/activities/getallwithcountsbydateandshift/${shift}`);
//   return response.data;
// };

// Utility function for error handling
const handleError = (error: any) => {
    if (axios.isAxiosError(error) && error.response) {
        console.error({
            timestamp: new Date().toISOString(),
            status: error.response.status,
            error: error.response.statusText,
            message: error.response.data?.message || "Error Occurred"
        });
        return error.response;
    } else {
        console.error({
            timestamp: new Date().toISOString(),
            status: 0,
            error: "Not Specified",
            message: "Error Occurred"
        });
        throw error;
    }
};