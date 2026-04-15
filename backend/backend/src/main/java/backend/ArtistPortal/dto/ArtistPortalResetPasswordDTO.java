package backend.ArtistPortal.dto;

public class ArtistPortalResetPasswordDTO {

    private String email;
    private String newPassword;

    public ArtistPortalResetPasswordDTO() {
    }

    public String getEmail() {
        return email;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}