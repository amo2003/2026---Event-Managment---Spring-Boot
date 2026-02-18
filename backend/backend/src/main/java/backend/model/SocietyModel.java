package backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "societies")
public class SocietyModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String faculty;
    private String presidentName;

    @Column(unique = true)
    private String email;

    private String contactNumber;
    private String advisorName;

    private String password;

    @Column(unique = true)
    private String pinCode;

    public SocietyModel() {}

    // Getters & Setters

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getFaculty() { return faculty; }

    public void setFaculty(String faculty) { this.faculty = faculty; }

    public String getPresidentName() { return presidentName; }

    public void setPresidentName(String presidentName) { this.presidentName = presidentName; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getContactNumber() { return contactNumber; }

    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getAdvisorName() { return advisorName; }

    public void setAdvisorName(String advisorName) { this.advisorName = advisorName; }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    public String getPinCode() { return pinCode; }

    public void setPinCode(String pinCode) { this.pinCode = pinCode; }
}
