package CLI;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class TicketPool {
    private List<Ticket> ticketPool;
    private int maximumCapacity;
    private int totalSold = 0;




    public TicketPool(Configuration configMaxCapacity) {
        this.maximumCapacity = configMaxCapacity.getMaxTicketCapacity();
        this.ticketPool = Collections.synchronizedList(new ArrayList<>());
    }





    // The synchronized keyword ensures that only one thread can execute this method at a time, protecting shared state access.
    public synchronized void addTicket(Ticket ticket){
        // The capacity check prevents adding tickets beyond maximumCapacity, avoiding pool overflow.
        while(ticketPool.size() >= maximumCapacity){
            try{
                System.out.println("Ticket pool is full. Vendors are Waiting for customers to buy tickets...");
                // wait() pauses the current thread and releases the monitor lock, allowing other threads to proceed.
                wait();
            }catch(InterruptedException e){
                e.printStackTrace();
                // Set the interrupt status back on the thread and break the loop to handle termination.
                Thread.currentThread().interrupt();
                break;
            }

        }
        // Handle exit cleanly if interrupted
        if (Thread.currentThread().isInterrupted()) {
            return;
        }
        ticketPool.add(ticket);
        // notifyAll() wakes up other threads that are waiting on this pool's lock.
        notifyAll();
        System.out.println("\nTicket released by vendor successfully!");
        System.out.println("Ticket released by " +Thread.currentThread().getName());
        System.out.println("Released Ticket Details : "+ ticket);
        System.out.println("Current size of ticket pool : " + ticketPool.size() +"\n");
        System.out.println("[STATUS] Pool: " + ticketPool.size() + "/" + maximumCapacity + " | Sold: " + totalSold);
    }

    // The synchronized keyword ensures mutual exclusion to preserve the integrity of the shared ticket list.
    public synchronized Ticket buyTicket(){
        // The empty check prevents purchasing a ticket when the pool is empty, avoiding underflow.
        while(ticketPool.isEmpty()){
            try{
                System.out.println("No tickets available. Customers are waiting for vendors to release tickets...");
                // wait() pauses the customer thread and releases the monitor lock, waiting until a vendor adds a ticket.
                wait();
            }catch(InterruptedException e){
                e.printStackTrace();
                // Set the interrupt status back on the thread and break the loop to handle termination.
                Thread.currentThread().interrupt();
                break;
            }
        }
        // Handle exit cleanly if interrupted
        if (Thread.currentThread().isInterrupted()) {
            return null;
        }

        Ticket ticket = ticketPool.remove(0);
        ticket.setPurchasedDateTime(LocalDateTime.now());
        totalSold++;
        // notifyAll() wakes up other threads waiting on this pool's lock.
        notifyAll();
        System.out.println("\nTicket purchased by customer successfully!");
        System.out.println("Ticket purchased by " +Thread.currentThread().getName());
        System.out.println("Purchased Ticket Details : "+ ticket);
        System.out.println("Current ticket pool size : " + ticketPool.size() + "\n");
        System.out.println("[STATUS] Pool: " + ticketPool.size() + "/" + maximumCapacity + " | Sold: " + totalSold);
        return ticket;
    }
}
