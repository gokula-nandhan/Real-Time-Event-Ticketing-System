package backend.repository;

import backend.model.SimulationSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SimulationSessionRepository extends JpaRepository<SimulationSession, Long> {
    List<SimulationSession> findAllByOrderByStartedAtDesc();
}
