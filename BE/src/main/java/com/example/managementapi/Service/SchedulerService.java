package com.example.managementapi.Service;

import com.example.managementapi.Entity.Product;
import com.example.managementapi.Repository.ProductRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class SchedulerService {

    private final ProductRepository productRepository;

    private EmailService emailService;

    @Scheduled(fixedRate = 3600000) // --> 1h check 1 lần
    public void checkLowQuantiyProduct(){

        List<Product> checkProductQuantity =  productRepository.findByProductQuantityLessThan(10);

        LocalDateTime now = LocalDateTime.now();

        System.out.println("Is Running: " + now);

        for(Product product : checkProductQuantity){
            System.out.println("Comming: " + now);

            if (product.getLastNotified() == null ||
                    product.getLastNotified().isBefore(now.minusHours(24)))
            {
                try {
                    System.out.println("Is Sending Email : " + now);

                    emailService.sendLowStockEmail("kienphongtran2003@gmail.com", product);
                    product.setLastNotified(now);
                    productRepository.save(product);
                } catch (Exception e) {
                    System.err.println("Lỗi khi gửi email cho sản phẩm " + product.getProductName() + ": " + e.getMessage());
                }
            }
        }
    }


}
