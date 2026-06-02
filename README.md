# Real-Time Event Ticketing System

1. INTRODUCTION

This system is designed to simulate a real-time event management ticketing environment.
Concurrent processes that are managed by the Producer-Consumer paradigm include the release of tickets by vendors and the purchase
of tickets by customers. The aim is to make use of Object-oriented programming (OOP) principles and multi-threading are used to ensure
data integrity and smooth concurrency management.



2. SETUP INSTRUCTIONS

2.1 Prerequisites:
Before running the application, ensure you have the following installed:

    Java: 21 (LTS). (Required by pom.xml)
    Maven: 3.9+ (or use the included Maven wrapper ./mvnw)
    Optional for Spring Boot API mode: MySQL running locally (see src/main/resources/application.properties)

2.2 Build and Run the Application

    2.2.1 Navigate to the project directory:
    cd /path/to/Real-Time-Event-Ticketing-System

    2.2.2 If using Maven wrapper, make it executable once:
    chmod +x mvnw

    2.2.3 Build and run tests:
    ./mvnw clean test
    (or: mvn clean test)

2.3 Run Modes

Spring Boot API mode:

    ./mvnw spring-boot:run
    (or: mvn spring-boot:run)

    API runs at:
    http://localhost:8080

CLI simulation mode:

    ./mvnw -DskipTests compile
    java -cp target/classes CLI.Main

Note:
This repository does not contain an Angular frontend project.


3. USAGE INSTRUCTIONS

How to Configure and Start the System

3.1 For CLI mode, run:
java -cp target/classes CLI.Main

For API mode, start Spring Boot and call endpoints on:
http://localhost:8080

3.2 Configure the System:

Input values into the 6 configuration fields:
Total Tickets,
Ticket Release Rate,
Customer Retrieval Rate,
Maximum Ticket Capacity,
Number of Customers,
Number of Vendors,


Ensure all input fields are filled with valid data before proceeding.

3.3 Start the System:

Click the Start button to initialize the ticketing system.
The backend will process ticket releases and purchases based on the input configuration.

3.4 Stop the System:

Click the Stop button to halt operations.
Logs and system status will be preserved if implemented.

4. EXPLANATION OF UI CCONTROLS

4.1 Start Button:

Initializes the system with the configuration parameters entered in the input fields.
Starts ticketing operations in real-time.

4.2 Stop Button:

Halts ticketing operations.
Preserves system state for review (if implemented)

4.3 Input Fields:

Total Tickets: Total number of tickets available.

Ticket Release Rate: Number of tickets released per unit time.

Customer Retrieval Rate: Number of tickets customers attempt to retrieve per unit time.

Maximum Ticket Capacity: Maximum tickets a customer can hold in the ticketpool.

Number of Vendors: Number of vendors  to release tickets.

Number of Customers: Number of customers to buy tickets.
