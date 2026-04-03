package backend.dto.ArtistDTO;

import backend.enums.ArtistEnums.ArtistCategory;

public class ArtistLeadResponseDTO {

    private Long id;
    private String artistName;
    private ArtistCategory category;
    private String email;
    private String phoneNumber;
    private String notes;
    private Boolean convertedToArtist;

    public ArtistLeadResponseDTO() {
    }

    public ArtistLeadResponseDTO(Long id, String artistName, ArtistCategory category,
                                 String email, String phoneNumber, String notes,
                                 Boolean convertedToArtist) {
        this.id = id;
        this.artistName = artistName;
        this.category = category;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.notes = notes;
        this.convertedToArtist = convertedToArtist;
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