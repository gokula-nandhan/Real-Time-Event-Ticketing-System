package backend.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class TicketPool {
    private List<Ticket> ticketPool;
    private int maximumCapacity;
    private int totalSold = 0;
    private int totalAdded = 0;

    public TicketPool(Configuration configMaxCapacity) {
        this.maximumCapacity = configMaxCapacity.getMaxTicketCapacity();
        this.ticketPool = Collections.synchronizedList(new ArrayList<>());
    }


    public int getTicketPoolSize() {
        return ticketPool.size();
    }

    public int getRemainingCapacity() {
        return maximumCapacity - ticketPool.size();
    }

    public int getTotalSold() {
        return totalSold;
    }

    public int getTotalAdded() {
        return totalAdded;
    }

    public synchronized void addTicket(Ticket ticket){
        while(ticketPool.size() >= maximumCapacity){
            try{
                System.out.println("Ticket pool is full. Vendors are Waiting for customers to buy tickets...");
                wait();
            }catch(InterruptedException e){
                Thread.currentThread().interrupt();
                break;
            }

        }
        if (Thread.currentThread().isInterrupted()) {
            return;
        }
        ticketPool.add(ticket);
        totalAdded++;
        notifyAll();
        System.out.println("\nTicket released by vendor successfully!");
        System.out.println("Ticket released by " +Thread.currentThread().getName());
        System.out.println("Released Ticket Details : "+ ticket);
        System.out.println("Current size of ticket pool : " + ticketPool.size() +"\n");
    }

    public synchronized Ticket buyTicket(){
        while(ticketPool.isEmpty()){
            try{
                System.out.println("No tickets available. Customers are waiting for vendors to release tickets...");
                wait();
            }catch(InterruptedException e){
                Thread.currentThread().interrupt();
                break;
            }
        }
        if (Thread.currentThread().isInterrupted()) {
            return null;
        }

        Ticket ticket = ticketPool.remove(0);
        ticket.setPurchasedDateTime(LocalDateTime.now());
        totalSold++;
        notifyAll();
        System.out.println("\nTicket purchased by customer successfully!");
        System.out.println("Ticket purchased by " +Thread.currentThread().getName());
        System.out.println("Purchased Ticket Details : "+ ticket);
        System.out.println("Current ticket pool size : " + ticketPool.size() + "\n");
        return ticket;
    }


}





