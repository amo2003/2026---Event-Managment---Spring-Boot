package backend.dto.ArtistDTO;

import backend.enums.ArtistEnums.ArtistCategory;

public class ArtistRequestDTO {

    private String artistName;
    private ArtistCategory category;
    private String email;
    private String phoneNumber;
    private String bio;
    private String portfolioLink;
    private String socialLink;
    private String performancePreferences;

    public ArtistRequestDTO() {
    }

    public String getArtistName() {
        return artistName;
    }

    public ArtistCategory getCategory() {
        return category;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getBio() {
        return bio;
    }

    public String getPortfolioLink() {
        return portfolioLink;
    }

    public String getSocialLink() {
        return socialLink;
    }

    public String getPerformancePreferences() {
        return performancePreferences;
    }

    public void setArtistName(String artistName) {
        this.artistName = artistName;
    }

    public void setCategory(ArtistCategory category) {
        this.category = category;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public void setPortfolioLink(String portfolioLink) {
        this.portfolioLink = portfolioLink;
    }

    public void setSocialLink(String socialLink) {
        this.socialLink = socialLink;
    }

    public void setPerformancePreferences(String performancePreferences) {
        this.performancePreferences = performancePreferences;
    }
}