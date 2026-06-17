package backend.model;

import java.io.FileReader;
import java.io.IOException;
import java.io.FileWriter;
import com.google.gson.Gson;

public class Configuration {
    private int totalTickets;
    private int ticketReleaseRate;
    private int customerRetrievalRate;
    private int maxTicketCapacity;
    private int vendorCount;
    private int customerCount;
    private int customerTicketQuantity;


    public Configuration() {}


    public Configuration(int customerRetrievalRate) {
        this.customerRetrievalRate = customerRetrievalRate;
    }

    public Configuration(int totalTickets, int ticketReleaseRate) {
        this.totalTickets = totalTickets;
        this.ticketReleaseRate = ticketReleaseRate;
    }

    public Configuration(int totalTickets, int ticketReleaseRate, int customerRetrievalRate, int maxTicketCapacity, int vendorCount, int customerCount) {
        this.totalTickets = totalTickets;
        this.ticketReleaseRate = ticketReleaseRate;
        this.customerRetrievalRate = customerRetrievalRate;
        this.maxTicketCapacity = maxTicketCapacity;
        this.vendorCount = vendorCount;
        this.customerCount = customerCount;
    }

    public int getTotalTickets() {
        return totalTickets;
    }


    public int getTicketReleaseRate() {
        return ticketReleaseRate;
    }


    public int getCustomerRetrievalRate() {
        return customerRetrievalRate;
    }


    public int getMaxTicketCapacity() {
        return maxTicketCapacity;
    }


    public int getVendorCount() {
        return vendorCount;
    }


    public int getCustomerCount() {
        return customerCount;
    }

    public int getCustomerTicketQuantity() {
        return customerTicketQuantity;
    }

    public void setCustomerTicketQuantity(int customerTicketQuantity) {
        this.customerTicketQuantity = customerTicketQuantity;
    }


    //save to json file
    public void saveFileToJson() {
        Gson gson = new Gson();
        try (FileWriter writeFile = new FileWriter("configuration.json")){
            gson.toJson(this, writeFile);
        }catch (IOException e){
            throw new RuntimeException("Error saving configuration to JSON file",e);
        }
    }

    public void saveFileToTextFile() {
        try (FileWriter writeToTextFile = new FileWriter("configuration.txt")) {
            writeToTextFile.write("totalTickets : " + totalTickets + "\n");
            writeToTextFile.write("ticketReleaseRate : " + ticketReleaseRate + "\n");
            writeToTextFile.write("customerRetrievalRate : " + customerRetrievalRate + "\n");
            writeToTextFile.write("maximumTicketCapacity : " + maxTicketCapacity + "\n");
            writeToTextFile.write("vendorCount : " + vendorCount + "\n");
            writeToTextFile.write("customerCount : " + customerCount + "\n");
        }catch (IOException e){
            throw new RuntimeException("Error saving configuration to text file",e);
        }
    }

    //load details from json
    public Configuration loadFileFromJson() {
        Gson gson = new Gson();
        try(FileReader readFile = new FileReader("configuration.json")){
            return gson.fromJson(readFile, Configuration.class);
        }catch (IOException e){
            throw new RuntimeException("Error loading configuration from JSON file",e);
        }
    }




}


