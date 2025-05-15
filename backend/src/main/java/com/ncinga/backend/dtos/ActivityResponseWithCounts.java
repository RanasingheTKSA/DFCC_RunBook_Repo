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

    public ActivityResponseWithCounts(List<ActivityResponse> activities,
                                      int totalCount,
                                      int completedCount,
                                      int pendingCount,
                                      int notApplicableCount) {
        this.activities = activities;
        this.totalCount = totalCount;
        this.completedCount = completedCount;
        this.pendingCount = pendingCount;
        this.notApplicableCount = notApplicableCount;
    }
}
