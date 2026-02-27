package backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PayHereConfig {

    @Value("${payhere.merchant.id}")
    private String merchantId;

    @Value("${payhere.merchant.secret}")
    private String merchantSecret;

    @Value("${payhere.sandbox}")
    private boolean sandbox;

    @Value("${payhere.currency}")
    private String currency;

    public String getMerchantId() {
        return merchantId;
    }

    public String getMerchantSecret() {
        return merchantSecret;
    }

    public boolean isSandbox() {
        return sandbox;
    }

    public String getCurrency() {
        return currency;
    }
}
