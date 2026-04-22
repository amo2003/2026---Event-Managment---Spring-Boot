package backend.ArtistPortal.dto;

public class ArtistPortalLoginDTO {
    private String email;
    private String password;

    public ArtistPortalLoginDTO() {
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