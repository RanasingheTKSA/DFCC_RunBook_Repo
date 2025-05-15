package com.ncinga.backend.documents;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document("activities")
@Data
@NoArgsConstructor
public class Activities {
    @Id
    private String id;
    private String name;
    private String scheduleTime;
    private String time;
    private String shift; //Morning,Mid,Night
    private int activityOrder;
    private String description;

    @DBRef
    private List<Records> records;

    public List<Records> getRecords() {
        return records != null ? records : new ArrayList<>();
    }
}
