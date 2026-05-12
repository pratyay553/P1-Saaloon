package com.saloon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.saloon.user", "com.saloon.common", "com.saloon.config"})
public class SAloonApplication {

    public static void main(String[] args) {
        SpringApplication.run(SAloonApplication.class, args);
    }

}
