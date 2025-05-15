package com.ncinga.backend.repos;

import com.ncinga.backend.documents.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepo extends MongoRepository<User, String> {
    User findByUsername(String username);
}
