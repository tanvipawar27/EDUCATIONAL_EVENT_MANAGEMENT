package com.edutech.educationalresourcedistributionsystem.controller;
 
import com.edutech.educationalresourcedistributionsystem.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
 
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
 
@RestController
@RequestMapping("/api/otp")
@CrossOrigin(origins = "*")
public class OtpController {
 
    private static final Logger logger = LoggerFactory.getLogger(OtpController.class);
 
    @Autowired
    private OtpService otpService;
 
    // ✅ Send OTP to email
    @PostMapping("/send")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {
        logger.info("OTP send request received for email: {}", email);
        try {
            otpService.sendOtp(email);
            return ResponseEntity.ok("OTP sent successfully to " + email);
        } catch (Exception e) {
            logger.error("Error sending OTP to {}: {}", email, e.getMessage());
            return ResponseEntity.internalServerError().body("Failed to send OTP. Please try again.");
        }
    }
 
    // ✅ Verify OTP
    @PostMapping("/verify")
    public ResponseEntity<String> verifyOtp(@RequestParam String email,
                                            @RequestParam String otp) {
        logger.info("OTP verify request received for email: {}", email);
        boolean valid = otpService.verifyOtp(email, otp);
        if (valid) {
            otpService.clearOtp(email);
            logger.info("OTP verified successfully for {}", email);
            return ResponseEntity.ok("OTP verified successfully!");
        } else {
            logger.warn("Invalid or expired OTP for {}", email);
            return ResponseEntity.badRequest().body("Invalid or expired OTP");
        }
    }
}