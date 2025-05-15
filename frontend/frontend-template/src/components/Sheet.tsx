import React, {useEffect, useState} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/Home.css';
import backHH from '../assets/backHomee.jpg';
import {
    dateAndShift,
    fetchActivitiesInMount,
} from "../features/activity/activityAPIs";
import * as XLSX from 'xlsx';

import { FaFileExport } from "react-icons/fa6";

export interface RowData {
    activityId:string,
    comment:string,
    completedTime:string,
    confirmTime:string,
    confirmUser:string,
    confirmation:boolean,
    date:string,
    description:string,
    name:string,
    recordId:string,
    shift:string,
    status:string,
    time:string,
    user:string
}

interface excelRowData {
    Activity:string,
    Shift:string,
    CompletedTime:string,
    CompletedUser:string,
    ConfirmedTime:string,
    ConfirmedUser:string,
    Action:string,
    Confirmation:string,
    Comment:string,
}

export default function Sheet(){
    const [selectedDate, setSelectedDate] = useState<Date | any>(new Date());
    const [selectedOption, setSelectedOption] = useState<string>('Morning-Weekday-Normal'); // Default value
    const [data, setData] = useState<RowData[]>([]);

    useEffect(() => {
        const details: dateAndShift = {
            date: selectedDate,
            shift: selectedOption
        }
        fetchActivitiesInMount(details).then(r => setData(r));
    }, [selectedOption, selectedDate]);

    const handleShift = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleDatePickerChange = (date: Date | null) => {
        if (date) {
            const formattedDate = new Date(date);
            setSelectedDate(formattedDate);
        } else {
            setSelectedDate("");
        }
    };

    const mapRowDataToExcelRowData = (rowDataArray: RowData[]): excelRowData[] => {
        return rowDataArray.map(row => ({
            Activity: row.name,
            Shift: row.shift,
            CompletedTime: row.completedTime,
            CompletedUser: row.user,
            ConfirmedTime: row.confirmTime,
            ConfirmedUser: row.confirmUser,
            Action: row.status,
            Confirmation: row.confirmation ? 'Confirmed' : 'Not Confirmed',
            Comment: row.comment,
        }));
    }

    const exportToExcel = (data:RowData[]) => {
        const excelData = mapRowDataToExcelRowData(data);
        // Convert JSON data to worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // Write workbook and export
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
        const s = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        XLSX.writeFile(workbook, "summary" + '.xlsx');
    }

    return (
        <div className="container-Home" style={{backgroundImage:`url(${backHH})`, backgroundPosition: 'center', backgroundSize:'cover'}}>
            <div className="table-container">
                <div className="top-controls">
                    <div className="Date">
                        <div>
                            <DatePicker
                                className='dateee'
                                selected={selectedDate}
                                onChange={handleDatePickerChange}
                                dateFormat="yyyy-MM-dd"
                            />

                        </div>
                    </div>


                    <div className="NewDropdown">
                        <select className='select3' onChange={(e) => handleShift(e)}>
                            {/* <option value="Morning-Weekday-Normal">Morning-Weekday-Normal</option>
                            <option value="Morning-Weekday-Holiday">Morning-Weekday-Holiday</option>
                            <option value="Mid-Weekday-Normal">Mid-Weekday-Normal</option>
                            <option value="Night-Weekday-Normal">Night-Weekday-Normal</option>
                            <option value="Night-Weekday-Holiday">Night-Weekday-Holiday</option> */}

                            <option value="Morning-Weekday-Normal">WeekDay - Morning</option>
                            <option value="Mid-Weekday-Normal">WeekDay - Mid</option>
                            <option value="Night-Weekday-Normal">WeekDay - Night</option>
                            <option value="Morning-Weekday-Holiday">WeekEnd/Holiday - Morning</option>            
                            <option value="Night-Weekday-Holiday">WeekEnd/Holiday - Night</option>
                        </select>
                    </div>

                    

                    <div className="Excel">
                        <div className='ExcelPadding'>
                            <button className="excel" onClick={() => exportToExcel(data)}>
                                Export - <FaFileExport />
                            </button>
                        </div>
                    </div>
                </div>

                <table>
                    <thead>
                    <tr>
                        <th>Activity</th>
                        <th>Date</th>
                        <th>User</th>
                        <th>Confirm Date</th>
                        <th>Confirm User</th>
                        <th>Action</th>
                        <th>Confirmation</th>
                        <th>Comment</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>{row.name}</td>
                            <td>{row.completedTime}</td>
                            <td>{row.user}</td>
                            <td>{row.confirmTime}</td>
                            <td>{row.confirmUser}</td>
                            <td>{row.status}</td>
                            <td>{row.confirmation ? 'Confirmed' : 'Not Confirmed'}</td>
                            <td>{row.comment}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}