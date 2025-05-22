package com.ncinga.backend.dtos;

import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ActivityResponseWithCounts {

    private List<ActivityResponse> activities;
    private int totalCount;
    private int completedCount;
    private int pendingCount;
    private int notApplicableCount;
    private int isActiveCount;

    public ActivityResponseWithCounts(List<ActivityResponse> activities,
                                      int totalCount,
                                      int completedCount,
                                      int pendingCount,
                                      int notApplicableCount,
                                      int isActiveCount) {
        this.activities = activities;
        this.totalCount = totalCount;
        this.completedCount = completedCount;
        this.pendingCount = pendingCount;
        this.notApplicableCount = notApplicableCount;
        this.isActiveCount = isActiveCount;

    }
}
