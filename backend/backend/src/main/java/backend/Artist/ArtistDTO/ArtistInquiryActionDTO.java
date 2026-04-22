package backend.Artist.ArtistDTO;

import backend.Artist.ArtistEnums.InquiryStatus;

public class ArtistInquiryActionDTO {

    private InquiryStatus status;
    private String responseMessage;

    public ArtistInquiryActionDTO() {
    }

    public InquiryStatus getStatus() {
        return status;
    }

    public String getResponseMessage() {
        return responseMessage;
    }

    public void setStatus(InquiryStatus status) {
        this.status = status;
    }

    public void setResponseMessage(String responseMessage) {
        this.responseMessage = responseMessage;
    }
}