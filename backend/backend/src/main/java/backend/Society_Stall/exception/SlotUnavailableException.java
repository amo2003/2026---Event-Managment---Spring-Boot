package backend.Society_Stall.Service.exception;

public class SlotUnavailableException extends RuntimeException {

    public SlotUnavailableException() {
        super("Selected date/time is already booked. Please choose another slot.");
    }
}
