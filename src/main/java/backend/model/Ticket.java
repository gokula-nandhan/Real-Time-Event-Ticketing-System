package backend.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


public class Ticket {
    private int ticketID;
    private String eventName;
    private int ticketPrice;
    private LocalDateTime releasedDateTime;
    private LocalDateTime purchasedDateTime;


    public Ticket(int ticketID, String eventName, int ticketPrice) {
        this.ticketID = ticketID;
        this.eventName = eventName;
        this.ticketPrice = ticketPrice;
    }

    public int getTicketID() {
        return ticketID;
    }

    public String getEventName() {
        return eventName;
    }

    public int getTicketPrice() {
        return ticketPrice;
    }

    public LocalDateTime getReleasedDateTime() {
        return releasedDateTime;
    }

    public void setReleasedDateTime(LocalDateTime releasedDateTime) {
        this.releasedDateTime = releasedDateTime;
    }

    public LocalDateTime getPurchasedDateTime() {
        return purchasedDateTime;
    }

    public void setPurchasedDateTime(LocalDateTime purchasedDateTime) {
        this.purchasedDateTime = purchasedDateTime;
    }



    @Override
    public String toString() {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        return "[" +
                "TicketID : " + ticketID +
                ", EventName : '" + eventName + '\'' +
                ", TicketPrice : " + ticketPrice +
                ", ReleasedDateTime : " + (releasedDateTime.format(formatter)) +
                ", PurchasedDateTime : " + (purchasedDateTime != null ? purchasedDateTime.format(formatter) : "N/A") +
                ']';
    }
}

