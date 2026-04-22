package backend.Artist.ArtistModel;

import backend.Artist.ArtistEnums.ArtistCategory;
import jakarta.persistence.*;

@Entity
@Table(name = "artist_leads")
public class ArtistLead {

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
    private String notes;

    @Column(nullable = false)
    private Boolean convertedToArtist = false;

    public ArtistLead() {
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

    public String getNotes() {
        return notes;
    }

    public Boolean getConvertedToArtist() {
        return convertedToArtist;
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

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public void setConvertedToArtist(Boolean convertedToArtist) {
        this.convertedToArtist = convertedToArtist;
    }
}