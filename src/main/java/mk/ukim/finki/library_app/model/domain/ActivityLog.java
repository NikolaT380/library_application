package mk.ukim.finki.library_app.model.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action;

    private String description;

    private LocalDateTime timestamp;

    public ActivityLog(String action, String description) {
        this.action = action;
        this.description = description;
        this.timestamp = LocalDateTime.now();
    }
}
