package backend.repository;

import backend.model.SimulationConfigEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SimulationConfigRepository extends JpaRepository<SimulationConfigEntity, Long> {}
