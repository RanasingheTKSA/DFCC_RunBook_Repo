import backHH from '../assets/backHomee.jpg';
import {
    FaUsers,
    FaChartLine,
    FaQuestionCircle,
    FaFileAlt,
    FaTasks,
    FaCalendarAlt,
    FaUserClock,
    FaDollarSign,
    FaUserPlus,
    FaCalendarDay,
    FaClock,
    FaClipboardList,
    FaCheckCircle,
    FaHourglassHalf,
    FaBan,
    FaBullhorn,
    FaTimes,
    FaPlus,
} from 'react-icons/fa';
import "../css/AdminPanel.css";
import { useState, useEffect } from 'react';
import { createActvityNew, deleteActivity, fetchActivityCounts } from '../features/activity/adminPanelApis';
import { createActivity, updateActivity } from '../features/activity/adminPanelApis';
import { getAllActivities } from '../features/activity/adminPanelApis';

export default function AdminPanel({ title, children, topMargin, TopSideButtons }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('Admin Home');
    const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
    const [shiftFilter, setShiftFilter] = useState('Morning-Weekday-Normal');
    const [activityCounts, setActivityCounts] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [activityToDelete, setActivityToDelete] = useState(null);

    // Admin Panel - Activity Controller edit activity form
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentActivity, setCurrentActivity] = useState(null);

    // State initialization
    const [showAddModal, setShowAddModal] = useState(false);
    const [newActivity, setNewActivity] = useState({
        name: '',
        scheduleTime: '',
        shift: 'Morning-Weekday-Normal',
        activityOrder: '',
        description: '',
        isActive: 'true'
    });

    const handleAddClick = () => {
        setShowAddModal(true);
        setError(null);
        setNewActivity({
            name: '',
            scheduleTime: '',
            shift: 'Morning-Weekday-Normal',
            activityOrder: '',
            description: '',
            isActive: 'true'
        });
    };

    const handleAddSubmit = async () => {
        try {
            setLoading(true);
            setError(null);

            // Validate required fields
            if (!newActivity.name || !newActivity.scheduleTime || !newActivity.activityOrder) {
                throw new Error('Please fill all required fields');
            }

            const payload = {
                name: newActivity.name,
                scheduleTime: newActivity.scheduleTime,
                shift: newActivity.shift,
                activityOrder: Number(newActivity.activityOrder),
                isActive: newActivity.isActive,
                description: newActivity.description || null,
                success: undefined,
                time: ''
            };

            const response = await createActvityNew(payload);

            const data = await fetchActivityCounts({
                date: new Date(dateFilter),
                shift: shiftFilter
            });
            setActivityCounts(data);
            setShowAddModal(false);

        } catch (error) {
            console.error('Create error:', error);
            setError(error.message || 'Failed to create activity');
        } finally {
            setLoading(false);
        }
    };

    const filteredActivities = activityCounts?.activities?.filter(activity => {
        const matchesShift = activity.shift === shiftFilter;
        const isActive = activity.isActive !== 'false';

        console.log('Activity:', {
            id: activity.activityId,
            name: activity.name,
            shift: activity.shift,
            isActive: activity.isActive,
            matchesShift,
            isActiveFilter: isActive,
            included: matchesShift && isActive
        });

        return matchesShift && isActive;
    }) || [];

    console.log('Final filtered activities:', filteredActivities);





    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleShiftChange = (e) => {
        setShiftFilter(e.target.value);
    };

    // Fetch activity counts when date or shift changes
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchActivityCounts({
                    date: new Date(dateFilter),
                    shift: shiftFilter
                });
                if (data?.status >= 400) {
                    throw new Error(data.message || 'Failed to fetch data');
                }
                setActivityCounts(data);
            } catch (err) {
                console.error('Failed to fetch activity counts:', err);
                setError(err.message || 'Failed to load activity data');
            } finally {
                setLoading(false);
            }
        };

        if (activeTab === 'Admin Home' || activeTab === 'Activity Controller') {
            fetchData();
        }
    }, [dateFilter, shiftFilter, activeTab]);


    // Get activities with comments
    const getActivitiesWithComments = () => {
        if (!activityCounts?.activities) return [];
        return activityCounts.activities.filter(a => a.comment && a.comment.trim() !== "");
    };

    // pending activities card display
    const getPendingActivities = () => {
        if (!activityCounts?.activities) return [];
        return activityCounts.activities.filter(a => a.status == 'Pending' && a.isActive !== 'false');
    };

    // Add this function to render comments in the Special Notice card
    const renderSpecialNoticeContent = () => {
        const activitiesWithComments = getActivitiesWithComments();
        if (activitiesWithComments.length === 0) return null;

        return (
            <div className="special-notice-comments">
                <h5>Recent Comments:</h5>
                <ul>
                    {activitiesWithComments.slice(0, 3).map((activity, index) => (
                        <li key={index}>
                            <div className="comment-header">
                                <strong>{activity.name}</strong>
                                {activity.completedTime && (
                                    <span className="comment-time">
                                        ({activity.completedTime})
                                    </span>
                                )}
                            </div>
                            <div className="comment-text">{activity.comment}</div>
                        </li>
                    ))}
                </ul>
                {activitiesWithComments.length > 3 && (
                    <div className="more-comments">
                        +{activitiesWithComments.length - 3} more comments...
                    </div>
                )}
            </div>
        );
    };

    // Add this function to render pending activities
    const renderPendingActivities = () => {
        const pendingActivities = getPendingActivities();
        if (pendingActivities.length === 0) return null;

        return (
            <div className="pending-activities-list">
                {/* <h5>Pending Activities:</h5> */}
                <ul>
                    {pendingActivities.slice(0, 5).map((activity, index) => (
                        <li key={index}>
                            <div className="activity-header">
                                <strong>{activity.name}</strong>
                                {activity.scheduleTime && (
                                    <span className="activity-time">
                                        ({activity.scheduleTime})
                                    </span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
                {pendingActivities.length > 5 && (
                    <div className="more-activities">
                        +{pendingActivities.length - 5} more pending...
                    </div>
                )}
            </div>
        );
    };


    const handleEditClick = (activity) => {
        setCurrentActivity(activity);
        setActivityForm({
            activityId: activity.activityId,
            name: activity.name,
            scheduleTime: activity.scheduleTime,
            shift: activity.shift,
            activityOrder: activity.activityOrder,
            description: activity.description || '',
            isActive: activity.isActive === true || activity.isActive === 'true'
        });
        setShowEditModal(true);
    };

    const [activityForm, setActivityForm] = useState({
        activityId: '',
        name: '',
        scheduleTime: '',
        shift: 'Morning-Weekday-Normal',
        activityOrder: 1,
        description: '',
        isActive: true,
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setActivityForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
    };

    // Delete activity handle 
    // const handleDeleteClick = async (activity) => {
    //     try {

    //         setLoading(true);
    //         setError('');

    //         if (!activity?.activityId) {
    //             throw new Error("Activity ID is not available");
    //         }

    //         console.log("Deleting activity with ID:", activity.activityId);
    //         const response = await deleteActivity(activity.activityId);
    //         console.log("Delete response:", response);
    //         console.log("Is activity deleted:", response?.isActive);

    //         if (response?.isActive === 'false') {
    //             console.log("Activity deleted successfully");
    //             setActivityCounts(prevCounts => ({
    //                 ...prevCounts,
    //                 activities: prevCounts.activities.filter(a => a.activityId !== activity.activityId)
    //             }));
    //         }

    //         console.log("Filtered activities after deletion:", filteredActivities);

    //     } catch (error) {
    //         console.error("Deactivation failed:", {
    //             activityId: activity?.activityId,
    //             error: error,
    //             response: error.response?.data
    //         });

    //         setError(
    //             error.response?.data?.message ||
    //             error.message ||
    //             'Failed to deactivate activity'
    //         );
    //     } finally {
    //         setLoading(false);
    //     }

    // }

    const handleDeleteClick = (activity) => {
        setActivityToDelete(activity);
        setShowDeleteModal(true);
    };


    const confirmDelete = async () => {
        if (!activityToDelete?.activityId) {
            setError("Activity ID is not available");
            setShowDeleteModal(false);
            return;
        }

        try {
            setLoading(true);
            setError('');

            console.log("Deleting activity with ID:", activityToDelete.activityId);
            const response = await deleteActivity(activityToDelete.activityId);
            console.log("Delete response:", response);

            if (response?.isActive === 'false') {
                console.log("Activity deleted successfully");
                setActivityCounts(prevCounts => ({
                    ...prevCounts,
                    activities: prevCounts.activities.filter(a => a.activityId !== activityToDelete.activityId)
                }));
            }
        } catch (error) {
            console.error("Deactivation failed:", {
                activityId: activityToDelete?.activityId,
                error: error,
                response: error.response?.data
            });
            setError(
                error.response?.data?.message ||
                error.message ||
                'Failed to deactivate activity'
            );
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
            setActivityToDelete(null);
        }
    };



    // Dashboard stats data
    const dashboardStats = [
        {
            title: "Activity Total Count",
            value: activityCounts?.isActiveCount ?? "--",
            icon: <FaClipboardList className="stat-icon" />,
            change: "All activities"
        },
        {
            title: "Completed Activity Count",
            value: activityCounts?.completedCount ?? "--",
            icon: <FaCheckCircle className="stat-icon" />,
            change: `${activityCounts ? Math.round((activityCounts.completedCount / activityCounts.isActiveCount) * 100) : 0}% completion rate`
        },
        {
            title: "Pending Activity Count",
            value: activityCounts?.pendingCount ?? "--",
            icon: <FaHourglassHalf className="stat-icon" />,
            change: `${activityCounts ? Math.round((activityCounts.pendingCount / activityCounts.isActiveCount) * 100) : 0}% pending`
        },
        {
            title: "Not-Applicable Activity Count",
            value: activityCounts?.notApplicableCount ?? "--",
            icon: <FaBan className="stat-icon" />,
            change: `${activityCounts ? Math.round((activityCounts.notApplicableCount / activityCounts.isActiveCount) * 100) : 0}% not applicable`
        },
        {
            title: "Pending Activities",
            value: getPendingActivities().length > 0 ? getPendingActivities().length : "0",
            icon: <FaHourglassHalf className="stat-icon" />,
            change: getPendingActivities().length > 0
                ? `${getPendingActivities().length} pending activity${getPendingActivities().length > 1 ? 'ies' : ''}`
                : "No pending activities",
            spanColumns: true,

        },
        {
            title: "Special Notice",
            value: getActivitiesWithComments().length > 0 ? getActivitiesWithComments().length : "0",
            icon: <FaBullhorn className="stat-icon" />,
            change: getActivitiesWithComments().length > 0
                ? `${getActivitiesWithComments().length} notice${getActivitiesWithComments().length > 1 ? 's' : ''} with comments`
                : "No special notices",
            spanColumns: true
        },
    ];

    // Shift options for filter
    const shiftOptions = [
        { value: 'Morning-Weekday-Normal', label: 'WeekDay - Morning' },
        { value: 'Mid-Weekday-Normal', label: 'WeekDay - Mid' },
        { value: 'Night-Weekday-Normal', label: 'WeekDay - Night' },
        { value: 'Morning-Weekday-Holiday', label: 'WeekEnd/Holiday - Morning' },
        { value: 'Night-Weekday-Holiday', label: 'WeekEnd/Holiday - Night' }
    ];


    return (
        <div className="container-Home" style={{ backgroundImage: `url(${backHH})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
            <div className="table-container">
                <div className="admin-content-wrapper">
                    {/* Sidebar */}
                    <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                        <nav>
                            <ul>
                                <li
                                    className={activeTab === 'Admin Home' ? 'active' : ''}
                                    onClick={() => setActiveTab('Admin Home')}
                                >
                                    <FaChartLine /> {sidebarOpen && 'Admin Home'}
                                </li>
                                <li
                                    className={activeTab === 'Activity Controller' ? 'active' : ''}
                                    onClick={() => setActiveTab('Activity Controller')}
                                >
                                    <FaTasks /> {sidebarOpen && 'Activity Controller'}
                                </li>
                                <li
                                    className={activeTab === 'User Guide' ? 'active' : ''}
                                    onClick={() => setActiveTab('User Guide')}
                                >
                                    <FaQuestionCircle /> {sidebarOpen && 'User Guide'}
                                </li>
                                <li
                                    className={activeTab === 'reporting' ? 'active' : ''}
                                    onClick={() => setActiveTab('reporting')}
                                >
                                    <FaFileAlt /> {sidebarOpen && 'Reporting'}
                                </li>
                            </ul>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="admin-main-content">
                        {/* Top Controls */}
                        <div className="top-controls">
                            <div className="breadcrumbs">
                                Home / {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                            </div>
                            {TopSideButtons && (
                                <div className="top-action-buttons">
                                    {TopSideButtons}
                                </div>
                            )}
                        </div>

                        {/* Page Title */}
                        {title && <h2 className="page-title">{title}</h2>}

                        {/* Dynamic Content */}
                        <div className="content-area" style={{ marginTop: topMargin || '20px' }}>
                            {children || (
                                <div className="default-content">
                                    {/* Admin Home */}
                                    {activeTab === 'Admin Home' && (
                                        <>
                                            <h3>Welcome to the Admin Panel</h3>

                                            {/* Date and Shift Filters */}
                                            <div className="dashboard-filters">
                                                <div className="filter-group">
                                                    <FaCalendarDay className="filter-icon" />
                                                    <input
                                                        type="date"
                                                        value={dateFilter}
                                                        onChange={(e) => setDateFilter(e.target.value)}
                                                        className="date-filter"
                                                    />
                                                </div>
                                                <div className="filter-group">
                                                    <FaClock className="filter-icon" />
                                                    <select
                                                        value={shiftFilter}
                                                        onChange={handleShiftChange}
                                                        className="shift-filter"
                                                    >
                                                        {shiftOptions.map((option, index) => (
                                                            <option key={index} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {error && (
                                                <div className="error-message">
                                                    {error}
                                                    <button onClick={() => window.location.reload()}>Retry</button>
                                                </div>
                                            )}

                                            <div className="dashboard-stats">
                                                {loading ? (
                                                    <div className="loading-indicator">Loading activity data...</div>
                                                ) : (
                                                    dashboardStats.map((stat, index) => (
                                                        <div
                                                            className={`stat-card ${stat.title === "Special Notice" ? "special-notice" :
                                                                stat.title === "Pending Activities" ? "pending-activities" : ""
                                                                }`}
                                                            style={stat.spanColumns ? { gridColumn: 'span 2' } : {}}
                                                            key={index}
                                                        >
                                                            <div className="stat-header">
                                                                <h4>{stat.title}</h4>
                                                                {stat.icon}
                                                            </div>
                                                            <div className="stat-value">{stat.value}</div>
                                                            <div className="stat-change">{stat.change}</div>
                                                            {stat.title === "Pending Activities" && renderPendingActivities()}
                                                            {stat.title === "Special Notice" && renderSpecialNoticeContent()}

                                                        </div>
                                                    ))
                                                )}
                                            </div>

                                        </>
                                    )}

                                    {/* Activity Controller */}
                                    {activeTab === 'Activity Controller' && (
                                        <>
                                            <h3>Activity Controller</h3>

                                            {/* Date and Shift Filters */}
                                            <div className="dashboard-filters">

                                                <div className="filter-group">
                                                    <FaClock className="filter-icon" />
                                                    <select
                                                        value={shiftFilter}
                                                        onChange={handleShiftChange}
                                                        className="shift-filter"
                                                    >
                                                        {shiftOptions.map((option, index) => (
                                                            <option key={index} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                            </div>

                                            <div>
                                                {/* Add New Activity Button */}
                                                <button
                                                    className="add-activity-btn"
                                                    onClick={handleAddClick}
                                                >
                                                    <FaPlus className="icon" />
                                                    Add New Activity
                                                </button>
                                                <br /><br />

                                            </div>

                                            {/* Activity List and Management */}
                                            <div className="activity-management">
                                                {/* Activity List Table */}
                                                <div className="activity-table-container">
                                                    <table className="activity-table">
                                                        <thead>
                                                            <tr>
                                                                <th>Order</th>
                                                                <th>Activity Name</th>
                                                                <th>Scheduled Time</th>
                                                                <th>Is Active</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {loading ? (
                                                                <tr>
                                                                    <td colSpan={6} className="loading-indicator">
                                                                        Loading activities...
                                                                    </td>
                                                                </tr>
                                                            ) : filteredActivities?.length > 0 ? (
                                                                filteredActivities

                                                                    .map((activity) => (
                                                                        <tr key={activity.id}>
                                                                            <td>{activity.activityOrder}</td>
                                                                            <td>{activity.name}</td>
                                                                            <td>{activity.scheduleTime}</td>

                                                                            <td>
                                                                                <span className={`status-badge ${activity.isActive ? 'active' : 'inactive'}`}>
                                                                                    {activity.isActive ? 'Active' : 'Inactive'}
                                                                                </span>
                                                                            </td>

                                                                            {/* Action Buttons */}
                                                                            <td className="action-buttons">

                                                                                <button
                                                                                    className="edit-btn"
                                                                                    onClick={() => handleEditClick(activity)}
                                                                                >
                                                                                    Edit
                                                                                </button>

                                                                                {/* <button
                                                                                    className="delete-btn"
                                                                                    onClick={() => handleDeleteClick(activity)}
                                                                                >
                                                                                    {activity.isActive ? 'Delete' : 'Activate'}
                                                                                </button> */}

                                                                                <button
                                                                                    className="delete-btn"
                                                                                    onClick={() => handleDeleteClick(activity)}
                                                                                >
                                                                                    {activity.isActive ? 'Delete' : 'Activate'}
                                                                                </button>


                                                                            </td>

                                                                        </tr>
                                                                    ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={5} className="no-activities">
                                                                        No activities found for selected date and shift
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* User Guide */}
                                    {}

                                    {/* Reporting */}
                                    { }


                                    {/* rest of the other tabs */}
                                    {activeTab !== 'Admin Home' && activeTab !== 'Activity Controller' && (
                                        <p>"Thank you for your interest!"  <br /> "This section is still under development. Please check back soon or explore other available features."</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {/* ADD ACTIVITY FORM */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h4>Create New Activity</h4>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label>Activity Name</label>
                                <input
                                    type="text"
                                    value={newActivity.name}
                                    onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                                    placeholder="Enter activity name"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Scheduled Time (HH.MM)</label>
                                    <input
                                        type="text"
                                        value={newActivity.scheduleTime}
                                        onChange={(e) => setNewActivity({ ...newActivity, scheduleTime: e.target.value })}
                                        placeholder="15.00"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Order</label>
                                    <input
                                        type="number"
                                        value={newActivity.activityOrder}
                                        onChange={(e) => setNewActivity({ ...newActivity, activityOrder: e.target.value })}
                                        placeholder="26"
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Shift</label>
                                <select
                                    value={newActivity.shift}
                                    onChange={(e) => setNewActivity({ ...newActivity, shift: e.target.value })}
                                >
                                    <option value="Morning-Weekday-Normal">WeekDay - Morning</option>
                                    <option value="Mid-Weekday-Normal">WeekDay - Mid</option>
                                    <option value="Night-Weekday-Normal">WeekDay - Night</option>
                                    <option value="Morning-Weekday-Holiday">WeekEnd/Holiday - Morning</option>
                                    <option value="Night-Weekday-Holiday">WeekEnd/Holiday - Night</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Description (Optional)</label>
                                <textarea
                                    value={newActivity.description}
                                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                                    placeholder="Add any additional notes"
                                    rows={2}
                                />
                            </div>
                        </div>

                        <div className="notes-section">
                            <h5 className='additional-note'>Additional Notes</h5>
                            <p className="notes-text">
                                The only changes that can be made are to the Order, Name, Shift, and Scheduled Time. (Description is optional)
                                Changes to the "Order" field, which mess with the existing order of activities, will not affect the order of other activities automatically.
                                Make sure the order field is filled out very carefully.
                                <br /><br />
                                NOTE: Schedule Time should be in <strong>24-hour format (HH:MM)</strong>.
                            </p>
                        </div>

                        <div className="modal-footer">
                            <button className="modal-btn secondary" onClick={() => setShowAddModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="modal-btn primary"
                                onClick={handleAddSubmit}
                                disabled={loading || !newActivity.name || !newActivity.scheduleTime || !newActivity.activityOrder}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading-spinner" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Activity'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* EDIT ACTIVITY FORM */}
            {showEditModal && currentActivity && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h4>Editable Activity Informations</h4>
                            <button className="close-btn" onClick={handleCloseModal}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="activity-details">
                                <div className="detail-section">
                                    {/* <h4>Activity Information</h4> */}
                                    <div className="detail-grid">
                                        {/* Editable Order field */}
                                        <div className="detail-item">
                                            <label className="detail-label">Order:</label>
                                            <input
                                                type="number"
                                                name="activityOrder"
                                                value={activityForm.activityOrder}
                                                onChange={handleInputChange}
                                                className="detail-input"
                                                min="1"
                                            />
                                        </div>

                                        {/* Editable Name field */}
                                        <div className="detail-item">
                                            <label className="detail-label">Name:</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={activityForm.name}
                                                onChange={handleInputChange}
                                                className="detail-input"
                                            />
                                        </div>

                                        {/* Editable Shift field */}
                                        <div className="detail-item">
                                            <label className="detail-label">Shift:</label>
                                            <select
                                                name="shift"
                                                value={activityForm.shift}
                                                onChange={handleInputChange}
                                                className="detail-input"
                                            >
                                                {shiftOptions.map((option, index) => (
                                                    <option key={index} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Editable Scheduled Time field */}
                                        <div className="detail-item">
                                            <label className="detail-label">Scheduled Time:</label>
                                            <input
                                                type="text"
                                                name="scheduleTime"
                                                value={activityForm.scheduleTime}
                                                onChange={handleInputChange}
                                                className="detail-input"
                                                placeholder="HH:MM"
                                            />
                                        </div>

                                        {/* Read-only fields */}
                                        <div className="detail-item">
                                            <span className="detail-label">Created Time:</span>
                                            <span className="detail-value">{currentActivity.time}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Is Active:</span>
                                            <span className={`status-badge ${currentActivity.isActive ? 'active' : 'inactive'}`}>
                                                {currentActivity.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="divider"></div>

                                <div className="notes-section">
                                    <h5 className='additional-note'>Additional Notes</h5>
                                    <p className="notes-text">
                                        The only changes that can be made are to the Order, the Name, the Shift, and the Scheduled Time.
                                        Changes to the "Order" field, which mess with the existing order of activities, will not affect the order of other activities automatically.
                                        Make sure the order field is filled out very carefully.
                                        <br /><br />
                                        NOTE: Schedule Time should be in <strong>24-hour format (HH:MM)</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="modal-btn secondary" onClick={handleCloseModal}>
                                Cancel
                            </button>

                            <button
                                className="modal-btn primary"
                                onClick={async () => {
                                    try {
                                        setLoading(true);
                                        const response = await updateActivity(
                                            activityForm.activityId,
                                            {
                                                name: activityForm.name,
                                                shift: activityForm.shift,
                                                scheduleTime: activityForm.scheduleTime,
                                                success: undefined,
                                                id: activityForm.activityId,
                                                time: new Date().toISOString(),
                                                description: '',
                                                activityOrder: activityForm.activityOrder,
                                                isActive: ''
                                            }
                                        );

                                        console.log('Update response:', response);

                                        setShowEditModal(false);

                                        const data = await fetchActivityCounts({
                                            date: new Date(dateFilter),
                                            shift: shiftFilter
                                        });
                                        setActivityCounts(data);

                                    } catch (error) {
                                        console.error('Update error:', error);
                                        setError(error.message || 'Failed to update activity');
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                disabled={loading}
                            >
                                {loading ?
                                    (
                                        <>
                                            <span className="loading-spinner"></span>
                                            Saving...
                                        </>) : ('Save Changes')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETING CONFIRMATION */}
            {/* Delete Confirmation Modal */}
            {showDeleteModal && activityToDelete && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h4>Confirm Deletion</h4>
                            <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="modal-body">
                            <p>Please confirm that you want to delete the activity: <br /> <strong>{activityToDelete.name}</strong></p>
                            <p>This action cannot be undone.</p>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="modal-btn secondary"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-btn danger"
                                onClick={confirmDelete}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading-spinner" />
                                        Deleting...
                                    </>
                                ) : (
                                    'Confirm Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div >
    );
}