CREATE DATABASE IF NOT EXISTS festival_db;
USE festival_db;

CREATE TABLE IF NOT EXISTS ticket_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(50) NOT NULL,
    ticket_id INT NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    ticket_price DECIMAL(10,2) NOT NULL,
    vendor_name VARCHAR(50) NOT NULL,
    customer_name VARCHAR(50) NOT NULL,
    released_at DATETIME,
    purchased_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS simulation_config (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    total_tickets INT NOT NULL,
    ticket_release_rate INT NOT NULL,
    customer_retrieval_rate INT NOT NULL,
    max_ticket_capacity INT NOT NULL,
    vendor_count INT NOT NULL,
    customer_count INT NOT NULL,
    customer_ticket_quantity INT NOT NULL,
    configured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS simulation_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    started_at DATETIME,
    stopped_at DATETIME,
    total_tickets_sold INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'STOPPED'
);
