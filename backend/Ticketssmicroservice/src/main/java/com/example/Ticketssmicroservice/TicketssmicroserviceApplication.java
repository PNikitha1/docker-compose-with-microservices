package com.example.Ticketssmicroservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class TicketssmicroserviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(TicketssmicroserviceApplication.class, args);
	}

}
