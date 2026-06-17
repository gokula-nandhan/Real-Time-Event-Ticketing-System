
package backend.service;

import backend.model.*;
import org.springframework.stereotype.Service;


@Service
public class SimulationService {

    private Vendor[] vendors;
    private Customer[] customers;
    private TicketPool ticketPool;
    private volatile boolean isRunning = false;
    private final SimulationStatus status = new SimulationStatus();
    private int totalTickets = 0;

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
        int vendorCount = config.getVendorCount();
        int customerCount = config.getCustomerCount();

        ticketPool = new TicketPool(config);
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


}
