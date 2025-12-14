package com.abhi.sweetshop.service;

import com.abhi.sweetshop.model.InventoryItem;
import com.abhi.sweetshop.repository.InventoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    public InventoryItem createItem(String name, String description, double price, int quantity) {
        InventoryItem item = new InventoryItem();
        item.setName(name);
        item.setDescription(description);
        item.setPrice(price);
        item.setQuantity(quantity);
        return inventoryRepository.save(item);
    }

    public InventoryItem getItemById(Long id) {
        Optional<InventoryItem> item = inventoryRepository.findById(id);
        if (item.isEmpty()) {
            throw new RuntimeException("Item not found");
        }
        return item.get();
    }

    public InventoryItem updateItem(Long id, String name, String description, double price, int quantity) {
        Optional<InventoryItem> itemOptional = inventoryRepository.findById(id);
        if (itemOptional.isEmpty()) {
            throw new RuntimeException("Item not found");
        }
        InventoryItem item = itemOptional.get();
        item.setName(name);
        item.setDescription(description);
        item.setPrice(price);
        item.setQuantity(quantity);
        return inventoryRepository.save(item);
    }

    public void deleteItem(Long id) {
        if (!inventoryRepository.existsById(id)) {
            throw new RuntimeException("Item not found");
        }
        inventoryRepository.deleteById(id);
    }

    public List<InventoryItem> listAllItems() {
        return inventoryRepository.findAll();
    }
}




