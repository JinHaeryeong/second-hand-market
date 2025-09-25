package com.example.project;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig  implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/api/file/**")//웹에서 접근할 경로
                .addResourceLocations("file:///C:/Users/insen/devSource/second-hand-platform/uploads/");//실제 저장 경로
        ///  C:/Users/insen/devSource/second-hand-platform/uploads
    }
}
