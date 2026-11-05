package com.shoply;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;

/**
 * Shoply Application — Spring Boot entry point.
 *
 * Modular monolith: package-by-feature with acyclic module dependencies.
 * Base package: com.shoply
 *
 * Note: DataSource/JPA auto-configuration is excluded for now because
 * MySQL integration is configured in a later phase (Step 23+). The app
 * runs without a database in this initial scaffold phase.
 *
 * Modules: platform, identity, catalog, cart, checkout, inventory, reporting
 */
@SpringBootApplication(exclude = {
    DataSourceAutoConfiguration.class,
    HibernateJpaAutoConfiguration.class,
    DataSourceTransactionManagerAutoConfiguration.class
})
public class ShoplyApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShoplyApplication.class, args);
    }
}
