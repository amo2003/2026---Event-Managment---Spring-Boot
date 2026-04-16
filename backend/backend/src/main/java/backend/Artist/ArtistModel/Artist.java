package backend.Artist.ArtistModel;

import backend.Artist.ArtistEnums.ArtistCategory;
import jakarta.persistence.*;

@Entity
@Table(name = "artists")
public class Artist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String artistName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ArtistCategory category;

    @Column(nullable = false, unique = true)
    private String email;

    private String phoneNumber;

    @Column(length = 1000)
    private String bio;

    private String portfolioLink;

    private String socialLink;

    private String performancePreferences;

    @Column(nullable = false)
    private Boolean active = true;

    public Artist() {
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