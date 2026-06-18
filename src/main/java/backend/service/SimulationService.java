package backend.service;

import backend.model.*;
import backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SimulationService {

    @Autowired
    private SimulationConfigRepository configRepository;

    @Autowired
    private SimulationSessionRepository sessionRepository;

    @Autowired
    private TicketTransactionRepository transactionRepository;

    private Vendor[] vendors;
    private Customer[] customers;
    private TicketPool ticketPool;
    private volatile boolean isRunning = false;
    private final SimulationStatus status = new SimulationStatus();
    private int totalTickets = 0;
    private SimulationSession currentSession;

    public String configureSimulation(Configuration config) {
        if (config.getTotalTickets() <= 0 ||
            config.getTicketReleaseRate() <= 0 ||
            config.getCustomerRetrievalRate() <= 0 ||
            config.getMaxTicketCapacity() <= 0 ||
            config.getVendorCount() <= 0 ||
            config.getCustomerCount() <= 0 ||
            config.getCustomerTicketQuantity() <= 0) {
            throw new IllegalArgumentException("Invalid configuration values");
        }

        this.totalTickets = config.getTotalTickets();

        // Save config entity to database
        SimulationConfigEntity configEntity = new SimulationConfigEntity();
        configEntity.setTotalTickets(config.getTotalTickets());
        configEntity.setTicketReleaseRate(config.getTicketReleaseRate());
        configEntity.setCustomerRetrievalRate(config.getCustomerRetrievalRate());
        configEntity.setMaxTicketCapacity(config.getMaxTicketCapacity());
        configEntity.setVendorCount(config.getVendorCount());
        configEntity.setCustomerCount(config.getCustomerCount());
        configEntity.setCustomerTicketQuantity(config.getCustomerTicketQuantity());
        configRepository.save(configEntity);

        int vendorCount = config.getVendorCount();
        int customerCount = config.getCustomerCount();

        ticketPool = new TicketPool(config, transactionRepository);
        vendors = new Vendor[vendorCount];
        customers = new Customer[customerCount];

        for (int i = 0; i < vendorCount; i++) {
            vendors[i] = new Vendor(config.getTotalTickets() / config.getVendorCount(), config.getTicketReleaseRate(), ticketPool);
        }

        for (int i = 0; i < customerCount; i++) {
            customers[i] = new Customer(config.getCustomerTicketQuantity(), config.getCustomerRetrievalRate(), ticketPool);
        }

        status.setRemainingTicketsToAdd(config.getTotalTickets());
        status.setRemainingTicketPoolSize(config.getMaxTicketCapacity());
        return "Simulation configured successfully!";
    }

    public String startSimulation() {
        if (isRunning) {
            return "Simulation is already running!";
        }
        if (vendors == null || customers == null) return "Please configure the simulation first!";
        isRunning = true;
        status.setRunning(true);

        // Create and save new SimulationSession
        currentSession = new SimulationSession();
        currentSession.setStartedAt(LocalDateTime.now());
        currentSession.setStatus("RUNNING");
        currentSession.setTotalTicketsSold(0);
        currentSession = sessionRepository.save(currentSession);

        for (Vendor vendor : vendors) {
            new Thread(vendor).start();
        }
        for (Customer customer : customers) {
            new Thread(customer).start();
        }
        return "Simulation started!";
    }

    public String stopSimulation() {
        if (!isRunning) {
            return "Simulation is not running!";
        }
        if (vendors == null || customers == null) return "Simulation has not been configured!";
        isRunning = false;
        status.setRunning(false);

        for (Vendor vendor : vendors) {
            vendor.stopThread();
        }
        for (Customer customer : customers) {
            customer.stopThread();
        }

        // Update and save SimulationSession
        if (currentSession != null) {
            currentSession.setStoppedAt(LocalDateTime.now());
            currentSession.setStatus("STOPPED");
            if (ticketPool != null) {
                currentSession.setTotalTicketsSold(ticketPool.getTotalSold());
            }
            sessionRepository.save(currentSession);
        }

        return "Simulation stopped!";
    }

    public SimulationStatus getSimulationStatus() {
        if (ticketPool == null) return status;
        status.setTicketPoolSize(ticketPool.getTicketPoolSize());
        status.setRemainingTicketPoolSize(ticketPool.getRemainingCapacity());
        status.setTotalTicketsAdded(ticketPool.getTotalSold());
        if (ticketPool != null) {
            status.setRemainingTicketsToAdd(totalTickets - ticketPool.getTotalAdded());
        }
        return status;
    }

    public List<TicketTransaction> getAllTransactions() {
        return transactionRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<SimulationSession> getSessionHistory() {
        return sessionRepository.findAllByOrderByStartedAtDesc();
    }
}
