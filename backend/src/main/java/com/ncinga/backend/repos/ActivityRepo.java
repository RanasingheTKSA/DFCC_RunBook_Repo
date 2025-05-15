package com.ncinga.backend.repos;

import com.ncinga.backend.documents.Activities;
import com.ncinga.backend.documents.Records;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface ActivityRepo extends MongoRepository<Activities, String>{

    Optional<List<Activities>> findByShift(String shift);

    // Additional query methods if needed
    @Query("{ 'shift': ?0, 'records.date': ?1 }")
    Optional<List<Activities>> findByShiftAndDate(String shift, Date date);

}
