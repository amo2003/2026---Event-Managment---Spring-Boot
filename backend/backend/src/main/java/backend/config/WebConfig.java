package backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;
import java.io.IOException;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .exposedHeaders("*");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        try {
            String projectRoot = new File(".").getCanonicalPath();
            
            // Serve files from uploads/events folder under /images/events/** URL
            registry.addResourceHandler("/images/events/**")
                    .addResourceLocations("file:" + projectRoot + File.separator + "uploads" + File.separator + "events" + File.separator);

            // Serve uploaded slips under /uploads/slips/**
            registry.addResourceHandler("/uploads/slips/**")
                    .addResourceLocations("file:" + projectRoot + File.separator + "uploads" + File.separator + "slips" + File.separator);

            // Serve generated QR codes under /uploads/qrcodes/**
            registry.addResourceHandler("/uploads/qrcodes/**")
                    .addResourceLocations("file:" + projectRoot + File.separator + "uploads" + File.separator + "qrcodes" + File.separator);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}