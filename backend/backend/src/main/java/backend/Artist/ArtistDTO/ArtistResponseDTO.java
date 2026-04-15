package backend.Artist.ArtistDTO;

import backend.Artist.ArtistEnums.ArtistCategory;

public class ArtistResponseDTO {

    private Long id;
    private String artistName;
    private ArtistCategory category;
    private String email;
    private String phoneNumber;
    private String bio;
    private String portfolioLink;
    private String socialLink;
    private String performancePreferences;
    private Boolean active;

    public ArtistResponseDTO() {
    }

    public ArtistResponseDTO(Long id, String artistName, ArtistCategory category, String email,
                             String phoneNumber, String bio, String portfolioLink,
                             String socialLink, String performancePreferences, Boolean active) {
        this.id = id;
        this.artistName = artistName;
        this.category = category;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.bio = bio;
        this.portfolioLink = portfolioLink;
        this.socialLink = socialLink;
        this.performancePreferences = performancePreferences;
        this.active = active;
    }

    public Long getId() {
        return id;
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

    public Boolean getActive() {
        return active;
    }

    public void setId(Long id) {
        this.id = id;
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

    public void setActive(Boolean active) {
        this.active = active;
    }
}