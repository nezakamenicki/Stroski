package com.example.backend;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
@Tag(name = "Stroški", description = "CRUD operacije nad stroški")
@CrossOrigin
@RestController
@RequestMapping("/api/stroski")
public class StrosekController {

    private final StrosekRepository repository;

    public StrosekController(StrosekRepository repository) {
        this.repository = repository;
    }

    // CREATE - POST
    @PostMapping
    public ResponseEntity<Strosek> dodaj(@Valid @RequestBody Strosek strosek) {
        strosek.setId(null); // poskrbi, da se vedno ustvari nov zapis
        Strosek shranjen = repository.save(strosek);
        return ResponseEntity.status(HttpStatus.CREATED).body(shranjen);
    }

    // READ - vsi zapisi - GET
    @Operation(summary = "Vrni vse stroške")
    @GetMapping
    public List<Strosek> vrniVse() {
        return repository.findAll();
    }

    // READ - en zapis - GET
    @Operation(summary = "Vrni en strošek")
    @GetMapping("/{id}")
    public ResponseEntity<Strosek> vrniEnega(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE - PUT
    @Operation(summary = "Posodobi strošek")
    @PutMapping("/{id}")
    public ResponseEntity<Strosek> posodobi(@PathVariable Long id,
                                            @Valid @RequestBody Strosek novi) {
        return repository.findById(id)
                .map(obstojec -> {
                    obstojec.setNaziv(novi.getNaziv());
                    obstojec.setZnesek(novi.getZnesek());
                    obstojec.setKategorija(novi.getKategorija());
                    obstojec.setDatum(novi.getDatum());
                    return ResponseEntity.ok(repository.save(obstojec));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE - DELETE
    @Operation(summary = "Izbriši strošek")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> izbrisi(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}