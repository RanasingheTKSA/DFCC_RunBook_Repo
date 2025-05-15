package com.ncinga.backend.repos;

import com.ncinga.backend.documents.Activities;
import com.ncinga.backend.documents.Records;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface RecordRepo extends MongoRepository<Records,String> {
     Optional<List<Records>> findByDateBetween(Date start, Date end);

     //Admin Dashboard
//     @Query(value = "{'date': {$gte: ?0, $lte: ?1}}", count = true)
//     long countByDateBetween(Date startDate, Date endDate);
//
//     @Query(value = "{'date': {$gte: ?0, $lte: ?1}, 'status': ?2}", count = true)
//     long countByDateBetweenAndStatus(Date startDate, Date endDate, String status);
//
//     @Query("{'date': {$gte: ?0, $lte: ?1}, 'status': ?2}")
//     List<Records> findByDateBetweenAndStatus(Date startDate, Date endDate, String status);

}
