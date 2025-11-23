package com.example.Noticessmicroservice.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Noticessmicroservice.model.Notice;
import com.example.Noticessmicroservice.repository.NoticeRepository;
import java.time.*;
import java.util.List;
@Service
public class NoticeService {
	
	@Autowired
	private NoticeRepository noticeRepository;
	
	public Notice create(Notice n) {
		n.setDate(Instant.now());
		return noticeRepository.save(n);
	}
	
	public List<Notice> getAll(){
		return noticeRepository.findAll();
	}
	
	public Notice update(String noticeId, Notice n) {
		Notice update = noticeRepository.findByNoticeId(noticeId);
		update.setTitle(n.getTitle());
		update.setDate(Instant.now());
		return noticeRepository.save(update);
	}
	

}
