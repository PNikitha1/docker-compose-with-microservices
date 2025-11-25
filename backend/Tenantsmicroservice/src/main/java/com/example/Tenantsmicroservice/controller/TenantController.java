package com.example.Tenantsmicroservice.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Tenantsmicroservice.dto.TenantRequest;
import com.example.Tenantsmicroservice.dto.TenantResponse;
import com.example.Tenantsmicroservice.model.Tenants;
import com.example.Tenantsmicroservice.service.TenantService;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/tenants")
public class TenantController {
	
	@Autowired
    private TenantService service;


    // GET /api/tenants?q=
    @GetMapping
    public List<TenantResponse> list(@RequestParam(value = "q", required = false) String q) {
        return service.getAll(q).stream().map(TenantResponse::from).toList();
    }

    // GET /api/tenants/{id}
    @GetMapping("/{id}")
    public TenantResponse get(@PathVariable Long id) {
        return TenantResponse.from(service.getById(id));
    }

    // POST /api/tenants
    @PostMapping
    public ResponseEntity<TenantResponse> create(@Valid @RequestBody TenantRequest req) {
        Tenants t = new Tenants();
        t.setTenantId(req.getTenantId());
        t.setName(req.getName());
        t.setPhone(req.getPhone());
        t.setRoom(req.getRoom());
        t.setCheckIn(req.getCheckIn());
        t.setDue(req.getDue());
        Tenants saved = service.create(t);
        return ResponseEntity.created(URI.create("/tenants/" + saved.getId()))
                             .body(TenantResponse.from(saved));
    }

    // PUT /api/tenants/{id}
    @PutMapping("/{id}")
    public TenantResponse update(@PathVariable Long id, @Valid @RequestBody TenantRequest req) {
        Tenants patch = new Tenants();
        patch.setTenantId(req.getTenantId());
        patch.setName(req.getName());
        patch.setPhone(req.getPhone());
        patch.setRoom(req.getRoom());
        patch.setCheckIn(req.getCheckIn());
        patch.setDue(req.getDue());
        return TenantResponse.from(service.update(id, patch));
    }

    // DELETE /api/tenants/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/tenants/export (CSV)
    @GetMapping(value = "/export", produces = "text/csv")
    public ResponseEntity<byte[]> exportCsv(@RequestParam(value = "q", required = false) String q) {
        List<TenantResponse> rows = list(q);
        String header = "TenantId,Name,Phone,Room,CheckIn,Due";
        String body = rows.stream()
                .map(r -> String.join(",",
                        safe(r.getTenantId()),
                        safe(r.getName()),
                        safe(r.getPhone()),
                        safe(r.getRoom()),
                        safe(r.getCheckIn()),
                        String.valueOf(r.getDue())))
                .collect(Collectors.joining("\n"));
        String csv = header + "\n" + body;

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=tenants.csv")
                .contentType(new MediaType("text", "csv", StandardCharsets.UTF_8))
                .body(csv.getBytes(StandardCharsets.UTF_8));
    }

    private static String safe(String s) {
        if (s == null) return "";
        String escaped = s.replace("\"", "\"\"");
        return "\"" + escaped + "\"";
    }
}
