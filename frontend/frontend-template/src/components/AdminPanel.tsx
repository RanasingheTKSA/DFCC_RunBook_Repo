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
} from 'react-icons/fa';
import "../css/AdminPanel.css";
import { useState, useEffect } from 'react';
import { fetchActivityCounts } from '../features/activity/adminPanelApis';

export default function AdminPanel({ title, children, topMargin, TopSideButtons }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('Admin Home');
    const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
    const [shiftFilter, setShiftFilter] = useState('Morning-Weekday-Normal');
    const [activityCounts, setActivityCounts] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

        if (activeTab === 'Admin Home') {
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
        return activityCounts.activities.filter(a => a.status == 'Pending');
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
                <h5>Pending Activities:</h5>
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
                            <div className="activity-description">
                                {activity.description || 'No description available'}
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

    // Dashboard stats data
    const dashboardStats = [
        {
            title: "Activity Total Count",
            value: activityCounts?.totalCount ?? "--",
            icon: <FaClipboardList className="stat-icon" />,
            change: "All activities"
        },
        {
            title: "Completed Activity Count",
            value: activityCounts?.completedCount ?? "--",
            icon: <FaCheckCircle className="stat-icon" />,
            change: `${activityCounts ? Math.round((activityCounts.completedCount / activityCounts.totalCount) * 100) : 0}% completion rate`
        },
        {
            title: "Pending Activity Count",
            value: activityCounts?.pendingCount ?? "--",
            icon: <FaHourglassHalf className="stat-icon" />,
            change: `${activityCounts ? Math.round((activityCounts.pendingCount / activityCounts.totalCount) * 100) : 0}% pending`
        },
        {
            title: "Not-Applicable Activity Count",
            value: activityCounts?.notApplicableCount ?? "--",
            icon: <FaBan className="stat-icon" />,
            change: `${activityCounts ? Math.round((activityCounts.notApplicableCount / activityCounts.totalCount) * 100) : 0}% not applicable`
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
                                                            className={`stat-card ${
                                                                stat.title === "Special Notice" ? "special-notice" : 
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
                                    {activeTab !== 'Admin Home' && (
                                        <p>Select a section from the sidebar to begin.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}