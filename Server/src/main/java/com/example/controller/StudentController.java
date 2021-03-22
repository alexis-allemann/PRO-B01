package com.example.controller;

import com.example.neo4jEntities.Student;
import com.example.services.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
class StudentController extends BaseController {

    private final StudentService studentService;

    StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/students")
    ResponseEntity<List<Student>> findAll() {
        try {
            return ResponseEntity.ok(studentService.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/students")
    ResponseEntity<Student> save(@RequestBody Student student) {
        try {
            return ResponseEntity.ok(studentService.save(student));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }    }

    @GetMapping("/students/{id}")
    ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(studentService.findById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}