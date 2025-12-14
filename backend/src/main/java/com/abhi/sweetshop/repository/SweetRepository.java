package com.abhi.sweetshop.repository;

import com.abhi.sweetshop.model.SweetItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SweetRepository extends JpaRepository<SweetItem, Long> {
}




