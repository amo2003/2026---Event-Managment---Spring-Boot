const mockCalendarData = [
  {
    id: 1,
    artistId: 1,
    eventName: "Viramaya",
    venue: "Main Auditorium",
    eventDateTime: "2026-04-23 18:00",
    syncStatus: "SYNCED",
  },
  {
    id: 2,
    artistId: 1,
    eventName: "Campus Beats",
    venue: "Open Air Theatre",
    eventDateTime: "2026-05-02 19:30",
    syncStatus: "PENDING",
  },
  {
    id: 3,
    artistId: 2,
    eventName: "Spring Fest",
    venue: "Hall B",
    eventDateTime: "2026-05-10 17:00",
    syncStatus: "SYNCED",
  },
];

const calendarService = {
  getCalendarByArtist(artistId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockCalendarData.filter(
          (event) => String(event.artistId) === String(artistId)
        );

        resolve({
          data: filtered,
        });
      }, 300);
    });
  },

  addEventToCalendar(payload) {
    return new Promise((resolve) => {
      const newEvent = {
        id: mockCalendarData.length + 1,
        artistId: payload.artistId,
        eventName: payload.eventName,
        venue: payload.venue,
        eventDateTime: payload.eventDateTime,
        syncStatus: "SYNCED",
      };

      mockCalendarData.push(newEvent);

      resolve({
        data: newEvent,
      });
    });
  },
};

export default calendarService;