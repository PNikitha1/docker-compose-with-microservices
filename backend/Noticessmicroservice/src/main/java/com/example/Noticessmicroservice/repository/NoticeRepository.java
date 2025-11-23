package com.example.Noticessmicroservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Noticessmicroservice.model.Notice;

@Repository
public interface NoticeRepository extends JpaRepository<Notice,Long>{
	Notice findByNoticeId(String noticeId);

}
