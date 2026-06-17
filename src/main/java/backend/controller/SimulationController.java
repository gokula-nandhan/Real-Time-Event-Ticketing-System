package backend.controller;

import backend.model.Configuration;
import backend.model.SimulationStatus;
import backend.service.SimulationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/simulation")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000"})

public class SimulationController {

    @Autowired
    private SimulationService simulationService;



    @PostMapping("/configure")
    public String configureSimulation(@RequestBody Configuration config) {
        return simulationService.configureSimulation(config);
    }


    @PostMapping("/start")
    public String startSimulation() {
        return simulationService.startSimulation();
    }

    @PostMapping("/stop")
    public String stopSimulation() {
        return simulationService.stopSimulation();
    }

    @GetMapping("/status")
    public SimulationStatus getSimulationStatus() {
        return simulationService.getSimulationStatus();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(org.springframework.http.HttpStatus.BAD_REQUEST)
    public String handleValidationError(IllegalArgumentException e) {
        return e.getMessage();
    }
}




