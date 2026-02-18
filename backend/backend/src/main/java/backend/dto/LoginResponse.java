package backend.dto;

public class LoginResponse {
    private String name;
    private String email;
    private String role;
    private String token;
    private String faculty;

    public LoginResponse(String name, String email, String role, String token,  String faculty) {
        this.name = name;
        this.email = email;
        this.role = role;
        this.token = token;
        this.faculty = faculty;
    }

    // Getters
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getToken() { return token; }
    public String getFaculty() { return faculty; }
}
