package com.example.Tenantsmicroservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.example.Tenantsmicroservice.model.Tenants;
import com.example.Tenantsmicroservice.repository.TenantRepository;

import java.util.List;

@Service
@Transactional
public class TenantService {

	@Autowired
    private TenantRepository repo;

    public List<Tenants> getAll(String q) {
        if (StringUtils.hasText(q)) {
            return repo.search(q.trim());
        }
        return repo.findAll();
    }

    public Tenants getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tenant not found: " + id));
    }

    public Tenants create(Tenants t) {
        if (repo.existsByTenantId(t.getTenantId())) {
            throw new IllegalArgumentException("TenantId already exists: " + t.getTenantId());
        }
        return repo.save(t);
    }

    public Tenants update(Long id, Tenants patch) {
        Tenants t = getById(id);
        t.setTenantId(patch.getTenantId());
        t.setName(patch.getName());
        t.setPhone(patch.getPhone());
        t.setRoom(patch.getRoom());
        t.setCheckIn(patch.getCheckIn());
        t.setDue(patch.getDue());
        return repo.save(t);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
