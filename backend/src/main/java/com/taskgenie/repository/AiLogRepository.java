package com.taskgenie.repository;

import com.taskgenie.model.AiLog;
import com.taskgenie.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AiLogRepository extends JpaRepository<AiLog, UUID> {

  List<AiLog> findByUser(User user);
}


