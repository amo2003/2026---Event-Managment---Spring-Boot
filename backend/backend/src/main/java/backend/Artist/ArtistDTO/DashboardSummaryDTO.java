package backend.Artist.ArtistDTO;

import java.util.List;

public class DashboardSummaryDTO {

    private Long eventId;
    private long totalInquiries;
    private long interestedCount;
    private long notInterestedCount;
    private long pendingInquiryCount;

    private long totalInvitations;
    private long acceptedCount;
    private long declinedCount;
    private long finalizedCount;

    private long calendarConfirmedCount;

    private List<ArtistVoteResponseDTO> voteResults;

    public DashboardSummaryDTO() {
    }

    public Long getEventId() {
        return eventId;
    }

    public long getTotalInquiries() {
        return totalInquiries;
    }

    public long getInterestedCount() {
        return interestedCount;
    }

    public long getNotInterestedCount() {
        return notInterestedCount;
    }

    public long getPendingInquiryCount() {
        return pendingInquiryCount;
    }

    public long getTotalInvitations() {
        return totalInvitations;
    }

    public long getAcceptedCount() {
        return acceptedCount;
    }

    public long getDeclinedCount() {
        return declinedCount;
    }

    public long getFinalizedCount() {
        return finalizedCount;
    }

    public long getCalendarConfirmedCount() {
        return calendarConfirmedCount;
    }

    public List<ArtistVoteResponseDTO> getVoteResults() {
        return voteResults;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public void setTotalInquiries(long totalInquiries) {
        this.totalInquiries = totalInquiries;
    }

    public void setInterestedCount(long interestedCount) {
        this.interestedCount = interestedCount;
    }

    public void setNotInterestedCount(long notInterestedCount) {
        this.notInterestedCount = notInterestedCount;
    }

    public void setPendingInquiryCount(long pendingInquiryCount) {
        this.pendingInquiryCount = pendingInquiryCount;
    }

    public void setTotalInvitations(long totalInvitations) {
        this.totalInvitations = totalInvitations;
    }

    public void setAcceptedCount(long acceptedCount) {
        this.acceptedCount = acceptedCount;
    }

    public void setDeclinedCount(long declinedCount) {
        this.declinedCount = declinedCount;
    }

    public void setFinalizedCount(long finalizedCount) {
        this.finalizedCount = finalizedCount;
    }

    public void setCalendarConfirmedCount(long calendarConfirmedCount) {
        this.calendarConfirmedCount = calendarConfirmedCount;
    }

    public void setVoteResults(List<ArtistVoteResponseDTO> voteResults) {
        this.voteResults = voteResults;
    }
}