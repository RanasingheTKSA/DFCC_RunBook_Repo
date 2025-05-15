package com.ncinga.backend.services;

import com.ncinga.backend.documents.Activities;
import com.ncinga.backend.documents.Records;
import com.ncinga.backend.dtos.ActivityResponse;
import com.ncinga.backend.dtos.ActivityResponseWithCounts;
import com.ncinga.backend.repos.ActivityRepo;
import com.ncinga.backend.repos.RecordRepo;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.ldap.repository.Query;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.Stream;


@Service
@Data
@RequiredArgsConstructor
public class ActivityService {

    @Autowired
    private final ActivityRepo activityRepo;
    private final RecordRepo recordRepo;
    private final WhatsAppService whatsAppService;

    LocalDateTime now = LocalDateTime.now();
    LocalTime time = now.toLocalTime();
    DayOfWeek today = now.getDayOfWeek();

    public Activities createService(Activities activity){
        Date creatingDate = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(creatingDate);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date startOfDay = calendar.getTime();
        calendar.add(Calendar.DAY_OF_MONTH, 1);
        Date endOfDay = calendar.getTime();

        Optional<List<Records>> fetchedDailyRecords = recordRepo.findByDateBetween(startOfDay, endOfDay);
        if(fetchedDailyRecords.isPresent() && !fetchedDailyRecords.get().isEmpty()){
            activity.setTime(String.valueOf(creatingDate));
            Records record = new Records();
            record.setDate(new Date());
            record.setConfirmation(false);
            record.setStatus("Pending");
            List<Records> records = activity.getRecords();
            Records savedRecord = recordRepo.save(record);
            records.add(savedRecord);
            activity.setRecords(records);
            return activityRepo.save(activity);
        }else{
            activity.setTime(String.valueOf(creatingDate));
            return activityRepo.save(activity);
        }
    }

    public List<ActivityResponse> getAllByDateAndShift(Date date, String shift) {
        Comparator<ActivityResponse> comparator=new Comparator<ActivityResponse>() {
            @Override
            public int compare(ActivityResponse o1, ActivityResponse o2) {
                return o1.getActivityOrder().compareTo(o2.getActivityOrder()) ;
            }
        };
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy  HH:mm");
        //SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        List<Activities> activityListByShift = activityRepo.findByShift(shift).orElseThrow(() -> new RuntimeException("Value not present"));
        List<Activities> activityListByShiftAndDate = activityListByShift.stream()
                .peek(activity -> {
                    List<Records> filteredRecords = activity.getRecords().stream()
                            .filter(record -> {
                                Calendar calendar = Calendar.getInstance();
                                calendar.setTime(record.getDate());
                                int day = calendar.get(Calendar.DAY_OF_MONTH);
                                int month = calendar.get(Calendar.MONTH) + 1;
                                int year = calendar.get(Calendar.YEAR);

                                calendar.setTime(date);
                                int dayC = calendar.get(Calendar.DAY_OF_MONTH);
                                int monthC = calendar.get(Calendar.MONTH) + 1;
                                int yearC = calendar.get(Calendar.YEAR);
                                return day == dayC && month == monthC && year == yearC;
                            })
                            .collect(Collectors.toList());
                    activity.setRecords(filteredRecords); // Assuming Activities has a setter for Records
                }).toList();

        // System.out.println("OUTPUT OF THE GET ALL BY DATE AND SHIFT : " + activityListByShiftAndDate);

        return activityListByShiftAndDate.stream().flatMap(activity ->
                activity.getRecords().stream().map(record -> {
                    ActivityResponse response = new ActivityResponse();
                    response.setActivityId(activity.getId());
                    response.setName(activity.getName());
                    response.setScheduleTime(activity.getScheduleTime());
                    response.setTime(activity.getTime());
                    response.setDescription(activity.getDescription());
                    response.setShift(activity.getShift());
                    response.setRecordId(record.getId());
                    response.setActivityOrder(activity.getActivityOrder());
                    response.setUser(record.getUser());
                    response.setConfirmUser(record.getConfirmUser());
                    response.setConfirmation(record.isConfirmation());
                    response.setStatus(record.getStatus());
                    if(record.getCompletedTime() != null){
                        response.setCompletedTime(dateFormat.format(record.getCompletedTime()));
                    }
                    if(record.getConfirmTime() != null){
                        response.setConfirmTime(dateFormat.format(record.getConfirmTime()));
                    }
                    response.setDate(record.getDate());
                    response.setComment(record.getComment());
                    return response;
                })).sorted(comparator).toList();
    }

    public List<AtomicInteger> getBarChartDataByDateAndShift(Date date, String shift) {
        AtomicInteger pending = new AtomicInteger();
        AtomicInteger notApplicable = new AtomicInteger();
        AtomicInteger completed = new AtomicInteger();
        AtomicInteger notConfirmed = new AtomicInteger();
        AtomicInteger confirmed = new AtomicInteger();

        List<Activities> activityListByMorningShift = activityRepo.findByShift(shift).orElseThrow(() -> new RuntimeException("Value not present"));
        activityListByMorningShift
                .forEach(activity -> {
                    activity.getRecords()
                            .forEach(record -> {
                                Calendar calendar = Calendar.getInstance();
                                calendar.setTime(record.getDate());
                                int day = calendar.get(Calendar.DAY_OF_MONTH);
                                int month = calendar.get(Calendar.MONTH) + 1;
                                int year = calendar.get(Calendar.YEAR);

                                calendar.setTime(date);
                                int dayC = calendar.get(Calendar.DAY_OF_MONTH);
                                int monthC = calendar.get(Calendar.MONTH) + 1;
                                int yearC = calendar.get(Calendar.YEAR);

                                if(day == dayC && month == monthC && year == yearC){
                                    if(record.getStatus().equals("Pending")){
                                        pending.getAndIncrement();
                                        notConfirmed.getAndIncrement();
                                    }else{
                                        if(record.getStatus().equals("Completed")){
                                            completed.getAndIncrement();
                                            if(record.isConfirmation()){
                                                confirmed.getAndIncrement();
                                            }else{
                                                notConfirmed.getAndIncrement();
                                            }
                                        }else{
                                            notApplicable.getAndIncrement();
                                            if(record.isConfirmation()){
                                                confirmed.getAndIncrement();
                                            }else{
                                                notConfirmed.getAndIncrement();
                                            }
                                        }
                                    }
                                }
                            });
                });
        return List.of(pending, notApplicable, completed, notConfirmed, confirmed);
    }

    public List<Double> getBarChartPercentageDataByDate(Date date) {
        AtomicInteger pending = new AtomicInteger();
        AtomicInteger notApplicable = new AtomicInteger();
        AtomicInteger completed = new AtomicInteger();
        AtomicInteger notConfirmed = new AtomicInteger();
        AtomicInteger confirmed = new AtomicInteger();
        AtomicInteger total = new AtomicInteger();

        List<Activities> activityListByMorningShift = activityRepo.findAll();
        activityListByMorningShift
                .forEach(activity -> {
                    activity.getRecords()
                            .forEach(record -> {
                                Calendar calendar = Calendar.getInstance();
                                calendar.setTime(record.getDate());
                                int day = calendar.get(Calendar.DAY_OF_MONTH);
                                int month = calendar.get(Calendar.MONTH) + 1;
                                int year = calendar.get(Calendar.YEAR);

                                calendar.setTime(date);
                                int dayC = calendar.get(Calendar.DAY_OF_MONTH);
                                int monthC = calendar.get(Calendar.MONTH) + 1;
                                int yearC = calendar.get(Calendar.YEAR);

                                if(day == dayC && month == monthC && year == yearC){
                                    total.getAndIncrement();
                                    if(record.getStatus().equals("Pending")){
                                        pending.getAndIncrement();
                                        notConfirmed.getAndIncrement();
                                    }else{
                                        if(record.getStatus().equals("Completed")){
                                            completed.getAndIncrement();
                                            if(record.isConfirmation()){
                                                confirmed.getAndIncrement();
                                            }else{
                                                notConfirmed.getAndIncrement();
                                            }
                                        }else{
                                            notApplicable.getAndIncrement();
                                            if(record.isConfirmation()){
                                                confirmed.getAndIncrement();
                                            }else{
                                                notConfirmed.getAndIncrement();
                                            }
                                        }
                                    }
                                }
                            });
                });
        double percentagePending = (double) pending.get() / total.get() * 100;
        double percentageNotApplicable = (double) notApplicable.get() / total.get() * 100;
        double percentageCompleted = (double) completed.get() / total.get() * 100;
        double percentageNotConfirmed = (double) notConfirmed.get() / total.get() * 100;
        double percentageConfirmed = (double) confirmed.get() / total.get() * 100;
        System.out.println(percentagePending);
        System.out.println(percentageNotApplicable);
        System.out.println(percentageCompleted);
        System.out.println(percentageNotConfirmed);
        System.out.println(percentageConfirmed);
        return List.of(percentagePending, percentageNotApplicable, percentageCompleted, percentageNotConfirmed, percentageConfirmed);
    }


    // new configurations
    //what's app message sending new method
    @Scheduled(cron = "0 */1 * * * ?")
    public void scheduleMessage () {
        System.out.println("CHECK THE NEW SCHEDULE MESSAGE - " + new Date());

        try {
            String shift = determineCurrentShift();
            Date currentDate = new Date();

            Map<String, List<ActivityResponse>> result = getWhatsappDetails(currentDate, shift);

            System.out.println("Processed activities at " + currentDate +
                    " | Shift: " + shift +
                    " | Overdue count: " + result.get("overdue").size());

        }catch (Exception e) {
            System.err.println("Error in scheduleMessage: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private String determineCurrentShift() {
        //please check
        LocalDateTime now = LocalDateTime.now();
        LocalTime time = now.toLocalTime();
        DayOfWeek today = now.getDayOfWeek();

        LocalTime morningStart = LocalTime.of(7,0);
        LocalTime morningEnd = LocalTime.of(13,59);
        LocalTime midStart = LocalTime.of(14,0);
        LocalTime midEnd = LocalTime.of(18,59);
        LocalTime nightStart = LocalTime.of(19,0);
        LocalTime nightEnd = LocalTime.of(6,59);

        if (time.isBefore(nightEnd)){
            DayOfWeek yesterday = today.minus(1);
            boolean wasWeekEnd = (yesterday == DayOfWeek.SATURDAY || yesterday == DayOfWeek.SUNDAY);

            if (!wasWeekEnd) {
                return "Night-Weekday-Normal";
            } else {
                return "Night-Weekday-Holiday";
            }

        }else {

            boolean isWeekEnd = (today == DayOfWeek.SATURDAY || today == DayOfWeek.SUNDAY);

            if (!isWeekEnd) {
                // weekday logic
                if (!time.isBefore(morningStart) && time.isBefore(morningEnd)) {
                    return "Morning-Weekday-Normal";
                } else if (!time.isBefore(midStart) && time.isBefore(midEnd)) {
                    return "Mid-Weekday-Normal";
                } else if (time.isAfter(nightStart) || time.equals(nightStart)) {
                    return "Night-Weekday-Normal";
                }

            }else {
                // weekend and holiday
                if (!time.isBefore(morningStart) && time.isBefore(nightStart)){
                    return "Morning-Weekday-Holiday";
                } else if (time.isAfter(nightStart) || time.equals(nightStart)) {
                    return "Night-Weekday-Holiday";
                }
            }
        }

        return "Morning-Weekday-Normal";
    }

    public Map<String, List<ActivityResponse>> getWhatsappDetails (Date date, String shift){
        if (date == null || shift == null || shift.isEmpty()) {
            throw new IllegalArgumentException("Date and shift must not be null");
        }

        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm");

        List<Activities> activitiesByShift = activityRepo.findByShift(shift)
                .orElseThrow(() -> new RuntimeException("No activities found for shift: " + shift));


        Map<String, List<ActivityResponse>> responseMap = new LinkedHashMap<>();
        responseMap.put("completedConfirmed", new ArrayList<>());
        responseMap.put("completedNotConfirmed", new ArrayList<>());
        responseMap.put("pending", new ArrayList<>());
        responseMap.put("overdue", new ArrayList<>());

        Set<String> overdueUnconfirmedNames =  new LinkedHashSet<>();
        List<String> overdueActivityNames = new ArrayList<>();

        LocalTime midNightStart = LocalTime.of(00,00);
        LocalTime midNightStop = LocalTime.of(06,59);

        for (Activities activity : activitiesByShift) {

            List<Records> filteredRecords = activity.getRecords().stream()
                    .filter(record -> record != null && isSameDate(record.getDate(), date))
                    .collect(Collectors.toList());

            try {

                String rawTime = activity.getScheduleTime().replace('.', ':');
                LocalTime convertedScheduleTime = LocalTime.parse(rawTime);

                if (convertedScheduleTime.isAfter(midNightStart) && convertedScheduleTime.isBefore(midNightStop)){

                    List<Records> reFilteredRecords = activity.getRecords().stream()
                            .filter(record -> record != null && isSameDate(record.getDate(), date))
                            .peek(record -> activity.getScheduleTime())
                            .collect(Collectors.toList());

                    ZoneId zone = ZoneId.systemDefault();
                    LocalDate localDate = date.toInstant().atZone(zone).toLocalDate();
                    ZonedDateTime scheduledDateTime = ZonedDateTime.of(localDate, convertedScheduleTime, zone);
                    ZonedDateTime currentTime = ZonedDateTime.now(zone);

                    if (scheduledDateTime.isBefore(currentTime)) {
                        List<Records> overdueItemsInPeriod = reFilteredRecords.stream()
                                .filter(record -> record.getDate() != null)
                                .collect(Collectors.toList());

                        if (!overdueItemsInPeriod.isEmpty()) {
                            //overdueItemsInPeriod.forEach(item -> System.out.println("OVERDUE ITEM: " + item));

                            for (Records record : reFilteredRecords){
                                ActivityResponse responseNight = mapToActivityResponse(activity, record, dateFormat);

                                if (!record.isConfirmation()) {
                                    responseMap.get("overdue").add(responseNight);
                                    overdueActivityNames.add(activity.getName());
                                    break;
                                }
                            }
                            //overdueActivityNames.add(activity.getName());
                        }
                    }
                }

            } catch (Exception e) {
                e.printStackTrace();
            }

            //comment check with the condition
            List<String> comments = filteredRecords.stream()
                    .map(Records::getComment)
                    .filter(Objects::nonNull)
                    .map(String::trim)
                    .collect(Collectors.toList());

            String comment_content = comments.stream()
                    .filter(comment -> comment.equals("Bank Requested to Delay")
                            || comment.startsWith("Bank Requested to Delay ")
                            || comment.toLowerCase().startsWith("bank requested to delay")
                            || comment.toUpperCase().startsWith("BANK REQUESTED TO DELAY"))
                    .findFirst()
                    .orElse("No matching comment");

            boolean hasUnconfirmed = filteredRecords.stream().anyMatch(record -> !record.isConfirmation());
            boolean isOverdue = checkIfOverdue(activity, date);
            boolean isDelayedRequest = !comment_content.equals("No matching comment");

            // Skip if both delayed request and overdue
            if (isDelayedRequest && isOverdue) {
                System.out.println("Skipping activity due to delay request and being overdue.");
                continue;
            }

            if (!isOverdue) {
                continue;
            }

            for (Records record : filteredRecords){
                ActivityResponse response = mapToActivityResponse(activity, record, dateFormat);

                if ("Completed".equalsIgnoreCase(record.getStatus())) {
                    if (record.isConfirmation()) {
                        responseMap.get("completedConfirmed").add(response);
                    } else {
                        responseMap.get("completedNotConfirmed").add(response);
                    }
                } else if ("Pending".equalsIgnoreCase(record.getStatus())) {
                    responseMap.get("pending").add(response);
                }

                if (!record.isConfirmation()) {
                    responseMap.get("overdue").add(response);
                    overdueUnconfirmedNames.add(activity.getName());
                    break;
                }
            }
            responseMap.forEach((key, value) -> value.sort(Comparator.comparing(ActivityResponse::getActivityOrder)));
        }

        // Handling the what's app message.
        LocalTime now = LocalTime.now();

        if (now.isAfter(midNightStart) && now.isBefore(midNightStop)) {
            // Only send midnight overdue messages between 12:00 AM and 6:59 AM
            if (!overdueActivityNames.isEmpty()) {
                System.out.println("Sending night WhatsApp message!");
                //whatsAppService.sendMidnightOverdueRecordsMessage(overdueActivityNames);
            }
        } else {
            // Outside of midnight window, send unconfirmed messages
            if (!overdueUnconfirmedNames.isEmpty()) {
                //whatsAppService.sendUnconfirmedActivitiesMessage(new ArrayList<>(overdueUnconfirmedNames));
            }
        }

        return responseMap;
    }

    private boolean checkIfOverdue(Activities activity, Date currentDate) {

        // this is single what's app message
        if (activity.getScheduleTime() == null) return false;

        try {
            String[] timeParts = activity.getScheduleTime().split("\\.");
            if (timeParts.length != 2 ) return false;

            int hour = Integer.parseInt(timeParts[0]);
            int minute = Integer.parseInt(timeParts[1]);

            LocalTime schedule = LocalTime.of(hour, minute);
            LocalTime now = LocalTime.now(ZoneId.systemDefault());

            return now.isAfter(schedule.plusMinutes(15));

        }catch (Exception e) {
            return false;
        }

    }

    private ActivityResponse mapToActivityResponse(Activities activity, Records record, SimpleDateFormat dateFormat) {
        ActivityResponse response = new ActivityResponse();

        // Set activity fields
        response.setActivityId(activity.getId());
        response.setName(activity.getName());
        response.setScheduleTime(activity.getScheduleTime());
        response.setTime(activity.getTime());
        response.setDescription(activity.getDescription());
        response.setShift(activity.getShift());
        response.setActivityOrder(activity.getActivityOrder());

        // Set record fields
        response.setRecordId(record.getId());
        response.setUser(record.getUser());
        response.setConfirmUser(record.getConfirmUser());
        response.setConfirmation(record.isConfirmation());
        response.setStatus(record.getStatus());
        response.setDate(record.getDate());
        response.setComment(record.getComment());

        response.setCompletedTime(record.getCompletedTime() != null ? dateFormat.format(record.getCompletedTime()) : null);
        response.setConfirmTime(record.getConfirmTime() != null ? dateFormat.format(record.getConfirmTime()) : null);

        return response;
    }

    private boolean isSameDate(Date date1, Date date2) {

        if (date1 == null || date2 == null) return false;

        Calendar cal1 = Calendar.getInstance();
        Calendar cal2 = Calendar.getInstance();
        cal1.setTime(date1);
        cal2.setTime(date2);

        return cal1.get(Calendar.YEAR) == cal2.get(Calendar.YEAR) &&
                cal1.get(Calendar.MONTH) == cal2.get(Calendar.MONTH) &&
                cal1.get(Calendar.DAY_OF_MONTH) == cal2.get(Calendar.DAY_OF_MONTH);
    }


    // Admin Panel Count
    public ActivityResponseWithCounts getAllByDateAndShiftWithCounts(Date date, String shift) {
        List<ActivityResponse> responses = getActivityResponses(date, shift);

        int totalCount = responses.size();
        int completedCount = (int) responses.stream()
                .filter(ar -> "completed".equalsIgnoreCase(ar.getStatus()))
                .count();
        int pendingCount = (int) responses.stream()
                .filter(ar -> "pending".equalsIgnoreCase(ar.getStatus()))
                .count();
        int notApplicableCount = (int) responses.stream()
                .filter(ar -> "not applicable".equalsIgnoreCase(ar.getStatus()))
                .count();

        System.out.println("TOTAL COUNT : " + totalCount);
        System.out.println("COMPLETED COUNT : " + completedCount);
        System.out.println("PENDING COUNT : " + pendingCount);
        System.out.println("NOT APPLICABLE COUNT : " + notApplicableCount);

        return new ActivityResponseWithCounts(
                responses.stream()
                        .sorted(Comparator.comparing(ActivityResponse::getActivityOrder))
                        .toList(),
                totalCount,
                completedCount,
                pendingCount,
                notApplicableCount
        );
    }

    private List<ActivityResponse> getActivityResponses(Date date, String shift) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy  HH:mm");
        List<Activities> activityListByShift = activityRepo.findByShift(shift)
                .orElseThrow(() -> new RuntimeException("Value not present"));

        List<Activities> activityListByShiftAndDate = activityListByShift.stream()
                .peek(activity -> {
                    List<Records> filteredRecords = activity.getRecords().stream()
                            .filter(record -> isSameDate(record.getDate(), date))
                            .collect(Collectors.toList());
                    activity.setRecords(filteredRecords);
                }).toList();

        return activityListByShiftAndDate.stream()
                .flatMap(activity -> activity.getRecords().stream().map(record -> {
                    ActivityResponse response = new ActivityResponse();
                    response.setActivityId(activity.getId());
                    response.setName(activity.getName());
                    response.setScheduleTime(activity.getScheduleTime());
                    response.setTime(activity.getTime());
                    response.setDescription(activity.getDescription());
                    response.setShift(activity.getShift());
                    response.setRecordId(record.getId());
                    response.setActivityOrder(activity.getActivityOrder());
                    response.setUser(record.getUser());
                    response.setConfirmUser(record.getConfirmUser());
                    response.setConfirmation(record.isConfirmation());
                    response.setStatus(record.getStatus());
                    if (record.getCompletedTime() != null) {
                        response.setCompletedTime(dateFormat.format(record.getCompletedTime()));
                    }
                    if (record.getConfirmTime() != null) {
                        response.setConfirmTime(dateFormat.format(record.getConfirmTime()));
                    }
                    response.setDate(record.getDate());
                    response.setComment(record.getComment());
                    return response;
                })).toList();
    }

}
