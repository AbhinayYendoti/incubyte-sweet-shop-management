package com.abhi.sweetshop.controller;

import com.abhi.sweetshop.model.SweetItem;
import com.abhi.sweetshop.service.SweetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sweets")
public class SweetController {

    private final SweetService sweetService;

    public SweetController(SweetService sweetService) {
        this.sweetService = sweetService;
    }

    @GetMapping
    public ResponseEntity<List<SweetItem>> getAllSweets() {
        return ResponseEntity.ok(sweetService.listAllSweets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SweetItem> getSweetById(@PathVariable Long id) {
        try {
            SweetItem sweet = sweetService.getSweetById(id);
            return ResponseEntity.ok(sweet);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<SweetItem> createSweet(@RequestBody SweetItem sweetItem) {
        SweetItem created = sweetService.createSweet(
                sweetItem.getName(),
                sweetItem.getDescription(),
                sweetItem.getPrice()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<SweetItem> updateSweet(@PathVariable Long id, @RequestBody SweetItem sweetItem) {
        try {
            SweetItem updated = sweetService.updateSweet(
                    id,
                    sweetItem.getName(),
                    sweetItem.getDescription(),
                    sweetItem.getPrice()
            );
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSweet(@PathVariable Long id) {
        try {
            sweetService.deleteSweet(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/restock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SweetItem> restockSweet(@PathVariable Long id, @RequestBody RestockRequest request) {
        try {
            SweetItem sweet = sweetService.getSweetById(id);
            return ResponseEntity.ok(sweet);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/purchase")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PurchaseResponse> purchaseSweet(@PathVariable Long id, @RequestBody PurchaseRequest request) {
        try {
            SweetItem sweet = sweetService.getSweetById(id);
            PurchaseResponse response = new PurchaseResponse(
                    sweet.getId(),
                    sweet.getName(),
                    sweet.getPrice() * request.getQuantity(),
                    request.getQuantity()
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    public static class RestockRequest {
        private int quantity;

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }
    }

    public static class PurchaseRequest {
        private int quantity;

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }
    }

    public static class PurchaseResponse {
        private Long sweetId;
        private String sweetName;
        private double totalAmount;
        private int quantity;

        public PurchaseResponse(Long sweetId, String sweetName, double totalAmount, int quantity) {
            this.sweetId = sweetId;
            this.sweetName = sweetName;
            this.totalAmount = totalAmount;
            this.quantity = quantity;
        }

        public Long getSweetId() {
            return sweetId;
        }

        public String getSweetName() {
            return sweetName;
        }

        public double getTotalAmount() {
            return totalAmount;
        }

        public int getQuantity() {
            return quantity;
        }
    }
}




