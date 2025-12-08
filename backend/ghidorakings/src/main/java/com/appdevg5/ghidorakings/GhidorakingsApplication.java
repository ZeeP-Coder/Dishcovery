package com.appdevg5.ghidorakings;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.appdevg5.ghidorakings.entity.UserEntity;
import com.appdevg5.ghidorakings.repository.UserRepository;

@SpringBootApplication
public class GhidorakingsApplication {

	public static void main(String[] args) {
		SpringApplication.run(GhidorakingsApplication.class, args);
	}

	@Bean
	CommandLineRunner initAdmin(UserRepository userRepository) {
		return args -> {
			// Check if admin already exists
			if (userRepository.findByEmail("jnfranzadin@gmail.com").isEmpty()) {
				UserEntity admin = new UserEntity();
				admin.setUsername("Admin");
				admin.setEmail("jnfranzadin@gmail.com");
				admin.setPassword("dishcoveryadmin");
				admin.setAdmin(true);
				userRepository.save(admin);
				System.out.println("Admin account created successfully!");
			} else {
				System.out.println("Admin account already exists.");
			}
		};
	}

}
