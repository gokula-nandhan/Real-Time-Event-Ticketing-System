package backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "simulation_config")
public class SimulationConfigEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "total_tickets", nullable = false)
    private int totalTickets;

    @Column(name = "ticket_release_rate", nullable = false)
    private int ticketReleaseRate;

    @Column(name = "customer_retrieval_rate", nullable = false)
    private int customerRetrievalRate;

    @Column(name = "max_ticket_capacity", nullable = false)
    private int maxTicketCapacity;

    @Column(name = "vendor_count", nullable = false)
    private int vendorCount;

    @Column(name = "customer_count", nullable = false)
    private int customerCount;

    @Column(name = "customer_ticket_quantity", nullable = false)
    private int customerTicketQuantity;

    @Column(name = "configured_at", insertable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime configuredAt;

    public SimulationConfigEntity() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getTotalTickets() {
        return totalTickets;
    }

    public void setTotalTickets(int totalTickets) {
        this.totalTickets = totalTickets;
    }

    public int getTicketReleaseRate() {
        return ticketReleaseRate;
    }

    public void setTicketReleaseRate(int ticketReleaseRate) {
        this.ticketReleaseRate = ticketReleaseRate;
    }

    public int getCustomerRetrievalRate() {
        return customerRetrievalRate;
    }

    public void setCustomerRetrievalRate(int customerRetrievalRate) {
        this.customerRetrievalRate = customerRetrievalRate;
    }

    public int getMaxTicketCapacity() {
        return maxTicketCapacity;
    }

    public void setMaxTicketCapacity(int maxTicketCapacity) {
        this.maxTicketCapacity = maxTicketCapacity;
    }

    public int getVendorCount() {
        return vendorCount;
    }

    public void setVendorCount(int vendorCount) {
        this.vendorCount = vendorCount;
    }

    public int getCustomerCount() {
        return customerCount;
    }

    public void setCustomerCount(int customerCount) {
        this.customerCount = customerCount;
    }

    public int getCustomerTicketQuantity() {
        return customerTicketQuantity;
    }

    public void setCustomerTicketQuantity(int customerTicketQuantity) {
        this.customerTicketQuantity = customerTicketQuantity;
    }

    public LocalDateTime getConfiguredAt() {
        return configuredAt;
    }

    public void setConfiguredAt(LocalDateTime configuredAt) {
        this.configuredAt = configuredAt;
    }
}
