package backend.dto.ArtistDTO;

import backend.enums.ArtistEnums.ArtistCategory;

public class ArtistLeadRequestDTO {

    private String artistName;
    private ArtistCategory category;
    private String email;
    private String phoneNumber;
    private String notes;

    public ArtistLeadRequestDTO() {
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
}