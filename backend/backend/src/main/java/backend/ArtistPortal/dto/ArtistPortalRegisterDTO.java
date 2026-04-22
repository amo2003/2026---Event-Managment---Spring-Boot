package backend.ArtistPortal.dto;

public class ArtistPortalRegisterDTO {
    private String email;
    private String password;

    public ArtistPortalRegisterDTO() {
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}