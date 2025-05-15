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

// // Optional: You can also create a combined fetcher if needed
// export const fetchActivitiesAndCounts = async (details: DateAndShift) => {
//     const counts = await fetchActivityCounts(details);
//     // You could add additional fetches here if needed
//     return counts;
// };