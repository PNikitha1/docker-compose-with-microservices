package com.example.Roomsmicroservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class RoomsmicroserviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(RoomsmicroserviceApplication.class, args);
	}

}
