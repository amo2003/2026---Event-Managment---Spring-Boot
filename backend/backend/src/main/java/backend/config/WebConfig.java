package backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve files from uploads/events folder under /images/events/** URL
        registry.addResourceHandler("/images/events/**")
                .addResourceLocations("file:uploads/events/");

        // Serve uploaded slips under /uploads/slips/**
        registry.addResourceHandler("/uploads/slips/**")
                .addResourceLocations("file:uploads/slips/");

        // Serve generated QR codes under /uploads/qrcodes/**
        registry.addResourceHandler("/uploads/qrcodes/**")
                .addResourceLocations("file:uploads/qrcodes/");
    }
}