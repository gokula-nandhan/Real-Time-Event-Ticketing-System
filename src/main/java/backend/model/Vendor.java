package backend.model;

import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicInteger;

public class Vendor implements Runnable {
    private int totalTickets;
    private int ticketReleaseRate;
    private TicketPool ticketPool;
    private static final AtomicInteger ticketIdCounter = new AtomicInteger(0); // Thread-safe ticket ID generator
    private volatile boolean running = true;



    public Vendor(int totalTickets, int ticketReleaseRate, TicketPool ticketPool) {
        this.totalTickets = totalTickets;
        this.ticketReleaseRate = ticketReleaseRate;
        this.ticketPool = ticketPool;
    }

    @Override
    public void run() {
        for(int i = 0; i < totalTickets && running; i++) {
            int ticketId = ticketIdCounter.incrementAndGet();
            Ticket ticket = new Ticket(ticketId,"Event Name",1000);
            ticket.setReleasedDateTime(LocalDateTime.now());
            ticketPool.addTicket(ticket);
            try{
                Thread.sleep(ticketReleaseRate * 1000);
            }catch(InterruptedException e){
                if (!running)
                    break;
            }
        }
    }

    public void stopThread() {
        this.running = false; // Set the flag to false to stop the thread execution
    }
}









