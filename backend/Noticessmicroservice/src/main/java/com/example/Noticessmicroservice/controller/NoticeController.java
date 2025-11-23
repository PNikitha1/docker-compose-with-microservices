package com.example.Noticessmicroservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.*;

import com.example.Noticessmicroservice.Service.NoticeService;
import com.example.Noticessmicroservice.model.Notice;

@RestController
@RequestMapping("/notices")
public class NoticeController {
	@Autowired
	private NoticeService noticeService;
	
	@PostMapping
	public ResponseEntity<Notice> create(@RequestBody Notice n) {
		return ResponseEntity.status(201).body(noticeService.create(n));
	}
	
	@GetMapping
	public ResponseEntity<List<Notice>> getAll(){
		return ResponseEntity.status(200).body(noticeService.getAll());
	}
	
	@PutMapping("/{noticeId}")
	public ResponseEntity<Notice> update(@PathVariable String noticeId, @RequestBody Notice n){
		return ResponseEntity.status(200).body(noticeService.update(noticeId, n));
	}
}
