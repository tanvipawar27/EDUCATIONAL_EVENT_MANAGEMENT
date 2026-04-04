package com.edutech.educationalresourcedistributionsystem.service;
 
import com.edutech.educationalresourcedistributionsystem.entity.OtpVerification;
import com.edutech.educationalresourcedistributionsystem.repository.OtpVerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
 
import javax.mail.internet.MimeMessage;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
 
@Service
public class OtpService {
 
    private static final Logger logger = LoggerFactory.getLogger(OtpService.class);
 
    @Autowired
    private OtpVerificationRepository otpRepository;
 
    @Autowired
    private JavaMailSender mailSender;
 
    @Value("${otp.expiry.minutes:5}")
    private int otpExpiryMinutes;
 
    // ✅ Generate random 6-digit OTP
    public String generateOtp() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }
 
    // ✅ Send OTP to email and save record
    @Transactional
    public void sendOtp(String email) {
        logger.info("Generating OTP for email: {}", email);
 
        // Remove any existing OTP for this email
        otpRepository.deleteByEmail(email);
 
        String otp = generateOtp();
 
        OtpVerification record = new OtpVerification();
        record.setEmail(email);
        record.setOtp(otp);
        record.setExpiryTime(LocalDateTime.now().plusMinutes(otpExpiryMinutes));
        record.setVerified(false);
 
        otpRepository.save(record);
 
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
 
            helper.setTo(email);
            helper.setSubject("EduSphere Registration OTP");
            helper.setText(buildOtpEmailBody(otp), true);
 
            mailSender.send(message);
            logger.info("OTP email sent successfully to {}", email);
 
        } catch (Exception e) {
            logger.error("Failed to send OTP email to {}: {}", email, e.getMessage());
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }
 
    private String buildOtpEmailBody(String otp) {
        return "<html><body style='font-family:Arial,sans-serif;'>"
                + "<h2 style='color:#2c3e50;'>EduSphere Verification</h2>"
                + "<p>Dear User,</p>"
                + "<p>Your One-Time Password (OTP) is:</p>"
                + "<h3 style='color:#e74c3c;'>" + otp + "</h3>"
                + "<p>This OTP is valid for <b>" + otpExpiryMinutes + " minutes</b>. Please do not share it with anyone.</p>"
                + "<br/><p>Regards,<br/>EduSphere Team</p>"
                + "</body></html>";
    }
 
    // ✅ Verify OTP
    @Transactional
    public boolean verifyOtp(String email, String enteredOtp) {
        logger.info("Verifying OTP for email: {}", email);
 
        Optional<OtpVerification> recordOpt = otpRepository.findByEmail(email);
        if (recordOpt.isPresent()) {
            OtpVerification record = recordOpt.get();
 
            if (record.getExpiryTime().isBefore(LocalDateTime.now())) {
                logger.warn("Expired OTP for {}", email);
                otpRepository.delete(record);
                return false;
            }
 
            if (MessageDigest.isEqual(record.getOtp().getBytes(), enteredOtp.getBytes())) {
                record.setVerified(true);
                otpRepository.save(record);
                logger.info("OTP verified successfully for {}", email);
                return true;
            } else {
                logger.warn("Invalid OTP for {}", email);
                return false;
            }
        } else {
            logger.error("No OTP record found for {}", email);
            return false;
        }
    }
 
    // ✅ Clear OTP after successful verification
    @Transactional
    public void clearOtp(String email) {
        logger.info("Clearing OTP record for {}", email);
        otpRepository.deleteByEmail(email);
    }
}