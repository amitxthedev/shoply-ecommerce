package com.shoply;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Shoply Application — Spring Boot entry point.
 *
 * Modular monolith: package-by-feature with acyclic module dependencies.
 * Base package: com.shoply
 *
 * Modules: platform, identity, catalog, cart, checkout, inventory, reporting
 */
@SpringBootApplication
public class ShoplyApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShoplyApplication.class, args);
    }
}
