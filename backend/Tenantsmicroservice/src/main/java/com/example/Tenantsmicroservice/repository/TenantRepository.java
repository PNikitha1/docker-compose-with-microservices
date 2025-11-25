
package com.example.Tenantsmicroservice.repository;

import com.example.Tenantsmicroservice.model.Tenants;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TenantRepository extends JpaRepository<Tenants, Long> {

    boolean existsByTenantId(String tenantId);

    @Query("""
           select t from Tenants t
            where lower(t.name)  like lower(concat('%', :q, '%'))
               or lower(t.phone) like lower(concat('%', :q, '%'))
               or lower(t.room)  like lower(concat('%', :q, '%'))
           """)
    List<Tenants> search(@Param("q") String q);
}
