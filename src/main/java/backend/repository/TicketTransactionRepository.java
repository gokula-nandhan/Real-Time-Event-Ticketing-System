package backend.repository;

import backend.model.TicketTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketTransactionRepository extends JpaRepository<TicketTransaction, Long> {
    List<TicketTransaction> findAllByOrderByCreatedAtDesc();
    long countByEventName(String eventName);
}
