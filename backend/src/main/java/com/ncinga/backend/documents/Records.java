package com.ncinga.backend.documents;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document("records")
@Data
@NoArgsConstructor
public class Records {
    @Id
    private String id;
    private String user;
    private String confirmUser;
    private boolean confirmation;
    private String status; //complete|not complete|pending
    private Date confirmTime;
    private Date completedTime;
    private Date date;
    private String comment;
    private  String scheduleTime;
}
