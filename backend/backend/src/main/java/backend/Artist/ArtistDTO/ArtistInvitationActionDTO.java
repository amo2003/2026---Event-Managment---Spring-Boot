package backend.dto.ArtistDTO;

import backend.enums.ArtistEnums.InvitationStatus;

public class ArtistInvitationActionDTO {

    private InvitationStatus status;
    private String declineReason;

    public ArtistInvitationActionDTO() {
    }

    public InvitationStatus getStatus() {
        return status;
    }

    public String getDeclineReason() {
        return declineReason;
    }

    public void setStatus(InvitationStatus status) {
        this.status = status;
    }

    public void setDeclineReason(String declineReason) {
        this.declineReason = declineReason;
    }
}