package com.ncinga.backend.controllers;

import com.ncinga.backend.dtos.ActivityRequest;
import com.ncinga.backend.services.RecordService;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping(path="/records")
@CrossOrigin(origins = "*")
@Data
public class RecordController {
    private final RecordService recordService;

    @GetMapping(path = "/create/daily/{date}")
    public ResponseEntity<String> createDailyRecords(@PathVariable Date date){
        return ResponseEntity.ok(recordService.createDailyRecords(date));
    }

    @PostMapping(path="/update/confirmation")
    public ResponseEntity<String> updateRecordConfirmation(@RequestBody ActivityRequest activityRequest){
        return ResponseEntity.ok(recordService.updateServiceForConfirmation(activityRequest));
    }

    @PostMapping(path="/update/status")
    public ResponseEntity<String> updateRecordStatus(@RequestBody ActivityRequest activityRequest){
        return ResponseEntity.ok(recordService.updateServiceForStatus(activityRequest));
    }

    @PostMapping(path="/update/comment")
    public ResponseEntity<String> updateRecordComment(@RequestBody ActivityRequest activityRequest){
        return ResponseEntity.ok(recordService.updateServiceForComment(activityRequest));
    }

    // Admin Panel
//    @GetMapping("/counts")
//    public ResponseEntity<Map<String, Long>> getRecordCounts(
//            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
//
//        Map<String, Long> counts = recordService.getRecordCountsByDate(date.toString());
//        return ResponseEntity.ok(counts);
//    }

}
