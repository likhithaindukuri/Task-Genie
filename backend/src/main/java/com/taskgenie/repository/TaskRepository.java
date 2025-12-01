package com.taskgenie.repository;

import com.taskgenie.model.Task;
import com.taskgenie.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {

  List<Task> findByUser(User user);
}


