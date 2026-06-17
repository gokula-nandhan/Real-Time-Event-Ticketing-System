package backend.model;




public class SimulationStatus {
    private boolean isRunning;
    private int totalTicketsAdded;
    private int remainingTicketsToAdd;
    private int ticketPoolSize;
    private int remainingTicketPoolSize;

    public SimulationStatus() {}

    public SimulationStatus(boolean isRunning, int totalTicketsAdded, int remainingTicketsToAdd, int ticketPoolSize, int remainingTicketPoolSize) {
        this.isRunning = isRunning;
        this.totalTicketsAdded = totalTicketsAdded;
        this.remainingTicketsToAdd = remainingTicketsToAdd;
        this.ticketPoolSize = ticketPoolSize;
        this.remainingTicketPoolSize = remainingTicketPoolSize;
    }

    // Getters and setters
    public boolean isRunning() {
        return isRunning;
    }

    public void setRunning(boolean isRunning) {
        this.isRunning = isRunning;
    }

    public int getTotalTicketsAdded() {
        return totalTicketsAdded;
    }

    public void setTotalTicketsAdded(int totalTicketsAdded) {
        this.totalTicketsAdded = totalTicketsAdded;
    }

    public int getRemainingTicketsToAdd() {
        return remainingTicketsToAdd;
    }

    public void setRemainingTicketsToAdd(int remainingTicketsToAdd) {
        this.remainingTicketsToAdd = remainingTicketsToAdd;
    }

    public int getTicketPoolSize() {
        return ticketPoolSize;
    }

    public void setTicketPoolSize(int ticketPoolSize) {
        this.ticketPoolSize = ticketPoolSize;
    }

    public int getRemainingTicketPoolSize() {
        return remainingTicketPoolSize;
    }

    public void setRemainingTicketPoolSize(int remainingTicketPoolSize) {
        this.remainingTicketPoolSize = remainingTicketPoolSize;
    }

    @Override
    public String toString() {
        return "SimulationStatus{" +
                "isRunning=" + isRunning +
                ", totalTicketsAdded=" + totalTicketsAdded +
                ", remainingTicketsToAdd=" + remainingTicketsToAdd +
                ", ticketPoolSize=" + ticketPoolSize +
                ", remainingTicketPoolSize=" + remainingTicketPoolSize +
                '}';
    }
}


