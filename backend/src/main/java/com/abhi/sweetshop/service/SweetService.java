package com.abhi.sweetshop.service;

import com.abhi.sweetshop.model.SweetItem;
import com.abhi.sweetshop.repository.SweetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SweetService {

    private final SweetRepository sweetRepository;

    public SweetService(SweetRepository sweetRepository) {
        this.sweetRepository = sweetRepository;
    }

    public SweetItem createSweet(String name, String description, double price) {
        SweetItem sweet = new SweetItem();
        sweet.setName(name);
        sweet.setDescription(description);
        sweet.setPrice(price);
        return sweetRepository.save(sweet);
    }

    public SweetItem getSweetById(Long id) {
        Optional<SweetItem> sweet = sweetRepository.findById(id);
        if (sweet.isEmpty()) {
            throw new RuntimeException("Sweet not found");
        }
        return sweet.get();
    }

    public SweetItem updateSweet(Long id, String name, String description, double price) {
        Optional<SweetItem> sweetOptional = sweetRepository.findById(id);
        if (sweetOptional.isEmpty()) {
            throw new RuntimeException("Sweet not found");
        }
        SweetItem sweet = sweetOptional.get();
        sweet.setName(name);
        sweet.setDescription(description);
        sweet.setPrice(price);
        return sweetRepository.save(sweet);
    }

    public void deleteSweet(Long id) {
        if (!sweetRepository.existsById(id)) {
            throw new RuntimeException("Sweet not found");
        }
        sweetRepository.deleteById(id);
    }

    public List<SweetItem> listAllSweets() {
        return sweetRepository.findAll();
    }
}

