package backend.dto;

public class LoginResponse {
    private String name;
    private String email;
    private String role;
    private String token;
    private String faculty;
    private Long id;

    public LoginResponse(String name, String email, String role, String token,  String faculty, Long id) {
        this.name = name;
        this.email = email;
        this.role = role;
        this.token = token;
        this.faculty = faculty;
        this.id = id;
    }

    // Getters
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getToken() { return token; }
    public String getFaculty() { return faculty; }
    public Long getId() { return id; }
}
