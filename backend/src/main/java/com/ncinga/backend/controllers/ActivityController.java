package com.ncinga.backend.controllers;

import ch.qos.logback.core.net.SyslogOutputStream;
import com.ncinga.backend.documents.Activities;
import com.ncinga.backend.documents.Records;
import com.ncinga.backend.dtos.ActivityResponse;
import com.ncinga.backend.dtos.ActivityResponseWithCounts;
import com.ncinga.backend.services.ActivityService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping(path = "/activities")
@CrossOrigin(origins = "*")
@Data
public class ActivityController {

    @Autowired
    private final ActivityService activityService;

    @PostMapping(path="/create")
    public ResponseEntity<Activities> createActivity(@RequestBody Activities activity){
        System.out.println(activity);
        return ResponseEntity.ok(activityService.createService(activity));
    }

    @GetMapping(path = "/getallbydateandshitf/{date}/{shitf}")
    public ResponseEntity<List<ActivityResponse>> getAllByDateAndShift(
            @PathVariable Date date,
            @PathVariable String shitf){
        return ResponseEntity.ok(activityService.getAllByDateAndShift(date, shitf));
    }

    @GetMapping(path = "/getanalyticsbydateandshitf/{date}/{shitf}")
    public ResponseEntity<List<AtomicInteger>> getBarChartDataByDateAndShift(
            @PathVariable Date date,
            @PathVariable String shitf){
        return ResponseEntity.ok(activityService.getBarChartDataByDateAndShift(date, shitf));
    }

    @GetMapping(path = "/getanalyticsSummarybydate/{date}")
    public ResponseEntity<List<Double>> getBarChartSummaryDataByDate(
            @PathVariable Date date){
        return ResponseEntity.ok(activityService.getBarChartPercentageDataByDate(date));
    }

    @PostMapping(path = "/getwhatsappdetails/{date}/{shift}")
    public ResponseEntity<Map<String, List<ActivityResponse>>> getWhatsappDetails (
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") Date date,
            @PathVariable String shift) {
        //return ResponseEntity.ok(activityService.getWhatsappDetails(date, shift));
        return ResponseEntity.ok(activityService.getWhatsappDetails(date, shift));
    }

    // schedule time
    // this is working one
    @PostMapping(path = "/scheduleMessage/{date}/{shift}")
    public ResponseEntity<Map<String, List<ActivityResponse>>> scheduleMessage (
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") Date date,
            @PathVariable String shift) {
        //return ResponseEntity.ok(activityService.getWhatsappDetails(date, shift));
        return ResponseEntity.ok(activityService.getWhatsappDetails(date, shift));
    }

    // Admin Panel
    @GetMapping(path = "/getallwithcountsbydateandshift/{date}/{shift}")
    public ResponseEntity<ActivityResponseWithCounts> getAllWithCountsByDateAndShift(
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") Date date,
            @PathVariable String shift) {
        return ResponseEntity.ok(activityService.getAllByDateAndShiftWithCounts(date, shift));
    }

}
