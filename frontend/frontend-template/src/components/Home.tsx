import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/Home.css';
import backHH from '../assets/backHomee.jpg';
import {
  createDailyRecords,
  dateAndShift,
  fetchActivitiesInMount,
  updateRecordsForComment,
  updateRecordsForConfirmation,
  updateRecordsForStatus,
} from '../features/activity/activityAPIs';
import DialogBox from "./DialogBox";
import AlertBox from "./AlertBox";

export interface RowData {
  activityId: string;
  comment: string | null;
  completedTime: string;
  confirmTime: string;
  confirmUser: string;
  confirmation: boolean;
  date: string;
  description: string;
  name: string;
  recordId: string;
  shift: string;
  status: string;
  time: string;
  user: string;
  scheduleTime: string;
  isOverdue?: boolean;
  isActive: string;
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | any>(new Date());
  const [selectedOption, setSelectedOption] = useState<string>('Morning-Weekday-Normal'); // Default value
  const [data, setData] = useState<RowData[]>([]);
  const [dialogFunction, setDialogFunction] = useState<string>('');
  const [dialogValue, setDialogValue] = useState<string>('');
  const [dialogIndex, setDialogIndex] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [messageForDialogBox, setMessageForDialogBox] = useState<string>("");
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [messageForAlertBox, setMessageForAlertBox] = useState<string>("");
  const [activityNameForDialogAndAlertBox, setActivityNameForDialogAndAlertBox] = useState<string>("");

  useEffect(() => {
    const details: dateAndShift = {
      date: selectedDate,
      shift: selectedOption,
    };

    createDailyRecords(details).then((r) => {
      console.log(r);
      fetchActivitiesInMount(details).then((r) => setData(r));
    });

    const interval = setInterval(() => {
      const details: dateAndShift = {
        date: selectedDate,
        shift: selectedOption,
      };

      console.log("Auto-refresh triggered at:", new Date().toLocaleTimeString());

      fetchActivitiesInMount(details).then((r) => setData(r));
    }, 60000); // Refresh every 1 minute

    return () => clearInterval(interval);

  }, [selectedOption, selectedDate]);

  const dropdownOptions = ['Pending', 'Not Applicable', 'Completed'];

  const handleSelectChange = (index: number, value: string) => {
    const updatedData = [...data];
    console.log("updatedData", updatedData);
    
    const activity = updatedData[index];
    if (value === 'Completed' || value === 'Not Applicable') {
      setOpenDialog(true);
      setActivityNameForDialogAndAlertBox(activity.name);
      setMessageForDialogBox(`Are you sure you want to set the action as ${value} for `);
      setDialogFunction('HandleState');
      setDialogValue(value);
      setDialogIndex(index);
    }
  };

  const handleShift = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleConfirmationChange = (index: number) => {
    const updatedData = [...data];
    const activity = updatedData[index];

    if (activity.status !== 'Completed' && activity.status !== 'Not Applicable') {
      setOpenAlert(true);
      setMessageForAlertBox('Please complete your activity first.')
      return;
    }

    if (activity.user === localStorage.getItem('user')) {
      setOpenAlert(true);
      setMessageForAlertBox(`You have updated the Action as ${activity.status}. Therefore, you cannot Confirm Activity: `);
      setActivityNameForDialogAndAlertBox(activity.name);
      return;
    }

    setOpenDialog(true);
    setMessageForDialogBox('Are you sure you want to confirm?');
    setDialogFunction('HandleConfirmation');
    setDialogValue('');
    setDialogIndex(index);
  };

  const handleCommentsChange = (index: number, value: string) => {
    const updatedData = [...data];
    updatedData[index].comment = value;
    setData(updatedData);
  };

  const handleSaveComment = (index: number) => {
    const updatedData = [...data];
    const details: dateAndShift = {
      date: selectedDate,
      shift: selectedOption,
    };
    updateRecordsForComment(updatedData[index]).then((r) => {
      console.log(r);
      fetchActivitiesInMount(details).then((r) => setData(r));
    });
  };

  const handleSaveStatus = (index: number) => {
    const updatedData = [...data];
    const details: dateAndShift = {
      date: selectedDate,
      shift: selectedOption,
    };
    updateRecordsForStatus(updatedData[index]).then((r) => {
      console.log(r);
      fetchActivitiesInMount(details).then((r) => setData(r));
    });
  };

  const handleSaveConfirmation = (index: number) => {
    const updatedData = [...data];
    const details: dateAndShift = {
      date: selectedDate,
      shift: selectedOption,
    };
    updateRecordsForConfirmation(updatedData[index]).then((r) => {
      console.log(r);
      fetchActivitiesInMount(details).then((r) => setData(r));
    });
  };

  const handleDatePickerChange = (date: Date | null) => {
    if (date) {
      const formattedDate = new Date(date);
      setSelectedDate(formattedDate);
    } else {
      setSelectedDate('');
    }
  };

  const handleDialogConfirm = () => {
    if (dialogFunction === 'HandleState') {
      const updatedData = [...data];
      updatedData[dialogIndex].user = localStorage.getItem('user');
      updatedData[dialogIndex].status = dialogValue;
      setData(updatedData);
      handleSaveStatus(dialogIndex);
    }
    else {
      const updatedData = [...data];
      const activity = updatedData[dialogIndex];
      activity.confirmation = !activity.confirmation;
      if (activity.confirmation) {
        activity.confirmUser = localStorage.getItem('user');
      }
      setOpenDialog(false);
      setData(updatedData);
      handleSaveConfirmation(dialogIndex);
    }
    setOpenDialog(false);
    setMessageForDialogBox('');
    setDialogFunction('');
    setDialogValue('');
    setDialogIndex(0);
    setActivityNameForDialogAndAlertBox("");
  }

  const handleDialogCancel = () => {
    setOpenDialog(false);
    setMessageForDialogBox('');
    setDialogFunction('');
    setDialogValue('');
    setDialogIndex(0);
  }

  const backToHome = () => {
    setOpenAlert(false);
    setActivityNameForDialogAndAlertBox("");
  }

  return (
    <div className="container-Home" style={{ backgroundImage: `url(${backHH})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
      <div className="table-container">
        <div className="topcontrols">
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
        </div>

        <table cellPadding="5" cellSpacing="0">
          <thead>
            <tr>
              <th>Activity</th>
              <th>Cut-off Time</th>
              <th>Completed Date</th>
              <th>Completed User</th>
              <th>Confirmed Date</th>
              <th>Confirmed User</th>
              <th>Action</th>
              <th>Confirmation</th>
              <th>Comment</th>
              <th>Save Comment</th>
            </tr>
          </thead>


          <tbody>
            {data
              .filter((row) => row.isActive === 'true') 
              .map((row, index) => {

              // this is the working one 
              // const scheduleTimeDB = row.scheduleTime || "00.00";
              // const [hours, minutes] = scheduleTimeDB.split(".").map(Number);

              // const scheduleConvertedTime = new Date();
              // scheduleConvertedTime.setHours(hours, minutes, 0, 0);

              // const currentTime = new Date();
              // const isOverdue = scheduleConvertedTime < currentTime && 
              //                     row.status === 'Pending' &&
              //                     !row.confirmation;

              // const updatedRow = { ...row, isOverdue };




              //condition added confirmation working one
              // const scheduleTimeDB = row.scheduleTime || "00.00";
              // const [hours, minutes] = scheduleTimeDB.split(".").map(Number);

              // const scheduleConvertedTime = new Date();
              // scheduleConvertedTime.setHours(hours, minutes, 0, 0);

              // const currentTime = new Date();

              // let confirmationConvertedTime = null;
              // if (row.confirmTime) {
              //   try {
              //     const normalizedDateTime = row.confirmTime.includes('/')
              //       ? row.confirmTime.replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$2-$1')
              //       : row.confirmTime;

              //     confirmationConvertedTime = new Date(normalizedDateTime);

              //     if (isNaN(confirmationConvertedTime.getTime())) {
              //       const [datePart, timePart] = normalizedDateTime.split(' ');
              //       const [year, month, day] = datePart.split('-').map(Number);
              //       const [hour, minute] = timePart.split(':').map(Number);
              //       confirmationConvertedTime = new Date(year, month - 1, day, hour, minute);
              //     }

              //   } catch (error) {
              //     console.error('Error parsing confirmTime:', error);
              //   }
              // }

              // const isPendingAndOverdue = scheduleConvertedTime < currentTime &&
              //   row.status === 'Pending' &&
              //   !row.confirmation;

              // const isLateConfirmation = confirmationConvertedTime && 
              //       scheduleConvertedTime < confirmationConvertedTime

              // const isOverdue = isPendingAndOverdue || isLateConfirmation;
              // const updatedRow = { ...row, isOverdue };



              ///all condtions
              const scheduleTimeDB = row.scheduleTime || "00.00";
              const [hours, minutes] = scheduleTimeDB.split(".").map(Number);
              const scheduleConvertedTime = new Date();
              scheduleConvertedTime.setHours(hours, minutes, 0, 0);
              const currentTime = new Date();
              const isActive = row.isActive === 'true';

              const parseDateTime = (dateTimeStr) => {
                if (!dateTimeStr) return null;

                try {

                  const normalizedDateTime = dateTimeStr.includes('/')
                    ? dateTimeStr.replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$2-$1')
                    : dateTimeStr;

                  const parsedDate = new Date(normalizedDateTime);

                  if (isNaN(parsedDate.getTime())) {
                    const [datePart, timePart] = normalizedDateTime.split(' ');
                    const [year, month, day] = datePart.split('-').map(Number);
                    const [hour, minute] = timePart.split(':').map(Number);
                    return new Date(year, month - 1, day, hour, minute);
                  }
                  return parsedDate;
                } catch (error) {
                  console.error('Error parsing confirmTime:', error);
                  return null;
                }
              };

              const confirmationConvertedTime = parseDateTime(row.confirmTime);
              const completionConvertedTime = parseDateTime(row.completedTime);
              const isPendingAndOverdue = scheduleConvertedTime < currentTime && row.status === 'Pending' && !row.confirmation;
              const isLateConfirmation = confirmationConvertedTime && scheduleConvertedTime < confirmationConvertedTime;
              const isLateCompletion = completionConvertedTime && scheduleConvertedTime < completionConvertedTime;
              const isOverdue = isPendingAndOverdue || isLateConfirmation || isLateCompletion;

              let tooltipMessage = "";
              if (isOverdue) {
                if (isPendingAndOverdue) tooltipMessage = 'Pending and Overdue';
                else if (isLateConfirmation) tooltipMessage = 'Confirmed Lately';
                else if (isLateCompletion) tooltipMessage = 'Completed Lately';
              }

              return (

                <tr
                  key={index}
                  className={isOverdue ? "red-row" : ""}
                  //title={isOverdue ? (isLateConfirmation ? "Confirmed after schedule time" : "Pending and Overdue") : ""}
                  title={tooltipMessage}
                >
                  <td className="truncate-cell">{row.name}</td>
                  <td>{row.scheduleTime}</td>
                  <td>{row.completedTime}</td>
                  <td>{row.user}</td>
                  <td>{row.confirmTime}</td>
                  <td>{row.confirmUser}</td>

                  {/* original one */}
                  <td>
                    {row.status === 'Completed' ? <span className="green-text">{row.status}</span> : row.status === 'Not Applicable' ?
                      <span className="yellow-text">{row.status}</span> :
                      <select className='select' value={row.status} onChange={(e) => handleSelectChange(index, e.target.value)}>
                        {dropdownOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>}
                  </td>

                  {/* original one */}
                  <td>
                    {row.confirmation ? <span className="confirmed-text">CONFIRMED</span> :
                      <button
                        className={`buttonT ${row.confirmation ? 'confirmed' : ''}`}
                        onClick={() => handleConfirmationChange(index)}
                      >
                        {row.confirmation ? 'Confirmed' : 'Confirm'}
                      </button>
                    }
                  </td>

                  <td>
                    <input
                      className='inputHH'
                      type="text"
                      value={row.comment === null ? '' : row.comment}
                      onChange={(e) => handleCommentsChange(index, e.target.value)}
                    />
                  </td>
                  <td>
                    <button className="save-button" onClick={() => handleSaveComment(index)}>
                      SAVE
                    </button>
                  </td>
                </tr>
              );

            })}

          </tbody>
        </table>


        <DialogBox
          isOpen={openDialog}
          message={messageForDialogBox}
          activityName={activityNameForDialogAndAlertBox}
          onConfirm={handleDialogConfirm}
          onCancel={handleDialogCancel}
        />
        <AlertBox
          isOpen={openAlert}
          activityName={activityNameForDialogAndAlertBox}
          message={messageForAlertBox}
          back={backToHome}
        />
      </div>
    </div>
  );
}
