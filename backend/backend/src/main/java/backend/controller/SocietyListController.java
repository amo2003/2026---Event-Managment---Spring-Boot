package backend.controller;

import backend.model.SocietyListModel;
import backend.repository.SocietyListRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/society-list")
@CrossOrigin
public class SocietyListController {

    private final SocietyListRepository repository;

    public SocietyListController(SocietyListRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<SocietyListModel> getAllSocieties() {
        return repository.findAll();
    }

    @PostMapping
    public SocietyListModel addSociety(@RequestBody SocietyListModel society) {
        if (repository.existsByName(society.getName())) {
            throw new RuntimeException("Society already exists!");
        }
        return repository.save(society);
    }
}