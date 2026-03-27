import { useEffect, useState } from "react";
import { createOfficer, getAllOfficers } from "../api/officerApi";
import Loader from "../components/common/Loader";
import { isStrongEnoughPassword, isValidEmail, isValidPhone } from "../utils/validation";

const roleOptions = [
  "SAFETY_OFFICER",
  "MEDICAL_OFFICER",
  "SECURITY_OFFICER",
  "TECHNICAL_OFFICER",
];

function OfficerManagementPage() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "SAFETY_OFFICER",
  });

  useEffect(() => {
    loadOfficers();
  }, []);

  const loadOfficers = async () => {
    try {
      setLoading(true);
      const data = await getAllOfficers();
      setOfficers(data);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to load officers.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required.";
    } else if (formData.fullName.trim().length < 3) {
      errors.fullName = "Full name must be at least 3 characters.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Enter a valid email address.";
    }

    if (!formData.password.trim()) {
      errors.password = "Temporary password is required.";
    } else if (!isStrongEnoughPassword(formData.password)) {
      errors.password = "Password must be at least 6 characters and include letters and numbers.";
    }

    if (formData.phoneNumber.trim() && !isValidPhone(formData.phoneNumber.trim())) {
      errors.phoneNumber = "Enter a valid phone number.";
    }

    if (!formData.role) {
      errors.role = "Role is required.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await createOfficer(formData);
      setSuccessMessage("Officer account created successfully.");
      setErrorMessage("");
      setFormData({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        role: "SAFETY_OFFICER",
      });
      setFieldErrors({});
      await loadOfficers();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Failed to create officer."
      );
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <h2>Officer Management</h2>
        <p>Create officers and monitor their current workload.</p>
      </div>

      {successMessage && <div className="success-box">{successMessage}</div>}
      {errorMessage && <div className="error-box">{errorMessage}</div>}

      <div className="form-card section-space">
        <h3 className="section-title">Add New Officer</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter officer name"
                className={fieldErrors.fullName ? "input-error" : ""}
              />
              {fieldErrors.fullName && <div className="field-error">{fieldErrors.fullName}</div>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className={fieldErrors.email ? "input-error" : ""}
              />
              {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
            </div>

            <div className="form-group">
              <label>Temporary Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter temporary password"
                className={fieldErrors.password ? "input-error" : ""}
              />
              {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={fieldErrors.phoneNumber ? "input-error" : ""}
              />
              {fieldErrors.phoneNumber && <div className="field-error">{fieldErrors.phoneNumber}</div>}
            </div>

            <div className="form-group full-width">
              <label>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={fieldErrors.role ? "input-error" : ""}
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {fieldErrors.role && <div className="field-error">{fieldErrors.role}</div>}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn">
              Create Officer
            </button>
          </div>
        </form>
      </div>

      <div className="panel-card">
        <div className="panel-header">
          <h3>Officer List</h3>
        </div>

        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Available</th>
                <th>Active Incidents</th>
              </tr>
            </thead>
            <tbody>
              {officers.length > 0 ? (
                officers.map((officer) => (
                  <tr key={officer.id}>
                    <td>{officer.id}</td>
                    <td>{officer.fullName}</td>
                    <td>{officer.email}</td>
                    <td>{officer.phoneNumber || "-"}</td>
                    <td>{officer.role}</td>
                    <td>{officer.isAvailable ? "Yes" : "No"}</td>
                    <td>{officer.activeIncidentCount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No officers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OfficerManagementPage;