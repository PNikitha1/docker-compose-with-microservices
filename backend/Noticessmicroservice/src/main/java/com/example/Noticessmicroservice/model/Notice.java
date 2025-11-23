package com.example.Noticessmicroservice.model;



import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name="notices")
public class Notice {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;


@Column(name = "notice_id", nullable = false, unique = true, length = 36)
private String noticeId; // e.g., "N011"


@Column(nullable = false, length = 200)
private String title;

@Column(nullable = false)
private Instant date;

public Notice() {
	super();
	// TODO Auto-generated constructor stub
}

public Notice(Long id, String noticeId, String title, Instant date) {
	super();
	this.id = id;
	this.noticeId = noticeId;
	this.title = title;
	this.date = date;
}

public Notice(String noticeId, String title, Instant date) {
	super();
	this.noticeId = noticeId;
	this.title = title;
	this.date = date;
}

public Long getId() {
	return id;
}

public void setId(Long id) {
	this.id = id;
}

public String getNoticeId() {
	return noticeId;
}

public void setNoticeId(String noticeId) {
	this.noticeId = noticeId;
}

public String getTitle() {
	return title;
}

public void setTitle(String title) {
	this.title = title;
}

public Instant getDate() {
	return date;
}

public void setDate(Instant instant) {
	this.date = instant;
}

// getters/setters, constructors

}

