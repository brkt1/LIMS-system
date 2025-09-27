import { ArrowLeft, Edit, Save, X, Eye, EyeOff } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { profileAPI } from "../../services/api";
import ProfilePictureUpload from "../ProfilePictureUpload";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Patient profile data state
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, City, State 12345",
    dateOfBirth: "1990-01-15",
    gender: "Male",
    bloodType: "O+",
    emergencyContact: "Jane Doe",
    emergencyPhone: "+1 (555) 987-6543",
    insuranceProvider: "Health Insurance Co.",
    insuranceNumber: "INS123456789",
    medicalHistory: "No significant medical history",
    allergies: "None known",
    medications: "None currently",
    bio: "Patient bio information...",
    timezone: "America/New_York",
    language: "en",
    notifications: {
      email: true,
      sms: true,
      push: false,
    },
  });

  // Load profile data from API on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Save profile data to localStorage only when using mock authentication
  useEffect(() => {
    // Only save to localStorage if we're not in editing mode and using mock auth
    const token = localStorage.getItem("access_token");
    const isMockAuth = token && token.startsWith("mock_");

    if (!isEditing && isMockAuth) {
      localStorage.setItem("patientProfile", JSON.stringify(profileData));
    }
  }, [profileData, isEditing]);

  const loadProfile = async () => {
    try {
      const response = await profileAPI.getProfile();
      const data = response.data;

      setProfileData({
        firstName: data.first_name || user?.first_name || "John",
        lastName: data.last_name || user?.last_name || "Doe",
        email: data.email || user?.email || "john.doe@example.com",
        phone: data.phone || "+1 (555) 123-4567",
        address: data.address || "123 Main Street, City, State 12345",
        dateOfBirth: data.date_of_birth || "1990-01-15",
        gender: data.gender || "Male",
        bloodType: data.blood_type || "O+",
        emergencyContact: data.emergency_contact || "Jane Doe",
        emergencyPhone: data.emergency_phone || "+1 (555) 987-6543",
        insuranceProvider: data.insurance_provider || "Health Insurance Co.",
        insuranceNumber: data.insurance_number || "INS123456789",
        medicalHistory:
          data.medical_history || "No significant medical history",
        allergies: data.allergies || "None known",
        medications: data.medications || "None currently",
        bio: data.bio || "Patient bio information...",
        timezone: data.timezone || "America/New_York",
        language: data.language || "en",
        notifications: {
          email: data.email_notifications ?? true,
          sms: data.sms_notifications ?? true,
          push: data.push_notifications ?? false,
        },
      });

      // Set profile picture URL
      if (data.profile_picture) {
        // Construct full URL for the profile picture
        const fullUrl = data.profile_picture.startsWith("http")
          ? data.profile_picture
          : `http://127.0.0.1:8000${data.profile_picture}`;
        setProfilePicture(fullUrl);
      }

      console.log("Profile loaded successfully from backend:", data);
    } catch (error: any) {
      console.error("Failed to load profile:", error);

      // If it's a 403 error, the user is using mock authentication
      if (error.response?.status === 403) {
        console.log(
          "Using mock authentication - profile data will be stored locally"
        );
        // Load from localStorage if available
        const savedProfile = localStorage.getItem("patientProfile");
        if (savedProfile) {
          try {
            const parsedProfile = JSON.parse(savedProfile);
            setProfileData(parsedProfile);
            // Also load profile picture from localStorage
            if (parsedProfile.profilePicture) {
              setProfilePicture(parsedProfile.profilePicture);
            }
          } catch (parseError) {
            console.error("Error parsing saved profile:", parseError);
          }
        }
      } else if (error.response?.status === 401) {
        console.log("Authentication required - user needs to log in");
        setLocalError("Please log in to access your profile.");
        // Try to load from localStorage as fallback
        const savedProfile = localStorage.getItem("patientProfile");
        if (savedProfile) {
          try {
            const parsedProfile = JSON.parse(savedProfile);
            setProfileData(parsedProfile);
            if (parsedProfile.profilePicture) {
              setProfilePicture(parsedProfile.profilePicture);
            }
          } catch (parseError) {
            console.error("Error parsing saved profile:", parseError);
          }
        }
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("notifications.")) {
      const notificationType = name.split(".")[1];
      setProfileData((prev: any) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationType]: (e.target as HTMLInputElement).checked,
        },
      }));
    } else if (name.startsWith("password")) {
      // Map password field names to passwordData keys
      const passwordKey = name.replace("password", "").toLowerCase();
      const keyMap: { [key: string]: string } = {
        oldpassword: "oldPassword",
        newpassword: "newPassword",
        confirmpassword: "confirmPassword",
      };
      const actualKey = keyMap[passwordKey] || passwordKey;
      setPasswordData((prev) => ({
        ...prev,
        [actualKey]: value,
      }));
    } else {
      setProfileData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      // Validate required fields before sending
      if (profileData.firstName.length < 2) {
        setLocalError("First name must be at least 2 characters long.");
        return;
      }
      if (profileData.lastName.length < 2) {
        setLocalError("Last name must be at least 2 characters long.");
        return;
      }
      if (profileData.phone && profileData.phone.length < 10) {
        setLocalError("Phone number must be at least 10 characters long.");
        return;
      }

      const updateData = {
        first_name: profileData.firstName.trim(),
        last_name: profileData.lastName.trim(),
        email: profileData.email,
        phone: profileData.phone.trim(),
        address: profileData.address,
        bio: profileData.bio,
        timezone: profileData.timezone,
        language: profileData.language,
        email_notifications: profileData.notifications.email,
        sms_notifications: profileData.notifications.sms,
        push_notifications: profileData.notifications.push,
      };

      await profileAPI.updateProfile(updateData);
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");
      setLocalError(null);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Profile update error:", err);

      // If it's a 403 error, fall back to localStorage
      if (err.response?.status === 403) {
        console.log("Using mock authentication - saving to localStorage");
        localStorage.setItem("patientProfile", JSON.stringify(profileData));
        setIsEditing(false);
        setSuccessMessage("Profile updated successfully! (Saved locally)");
        setLocalError(null);
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else if (err.response?.status === 400) {
        // Handle validation errors from backend
        const errorData = err.response.data;
        if (typeof errorData === "object") {
          const errorMessages = Object.values(errorData).flat();
          setLocalError(`Validation error: ${errorMessages.join(", ")}`);
        } else {
          setLocalError("Validation error. Please check your input.");
        }
      } else {
        setLocalError("Failed to update profile. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    // Reload from API to reset changes
    loadProfile();
    setIsEditing(false);
    setShowPasswordForm(false);
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setLocalError(null);
    setSuccessMessage(null);
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setLocalError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setLocalError("New password must be at least 8 characters long");
      return;
    }

    try {
      await profileAPI.changePassword({
        old_password: passwordData.oldPassword,
        new_password: passwordData.newPassword,
      });
      setShowPasswordForm(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setLocalError(null);
      setSuccessMessage("Password changed successfully!");
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      // If it's a 403 error, show a message about mock authentication
      if (err.response?.status === 403) {
        setLocalError(
          "Password change not available with mock authentication. Please log in with real credentials."
        );
      } else {
        setLocalError("Failed to change password");
      }
    }
  };

  const handleProfilePictureUpload = async (file: File) => {
    try {
      setUploadLoading(true);
      setLocalError(null);

      const formData = new FormData();
      formData.append("profile_picture", file);

      const response = await profileAPI.uploadProfilePicture(formData);

      // Update the profile picture state with the new URL
      if (response.data.profile_picture) {
        // Construct full URL for the profile picture
        const fullUrl = response.data.profile_picture.startsWith("http")
          ? response.data.profile_picture
          : `http://127.0.0.1:8000${response.data.profile_picture}`;
        setProfilePicture(fullUrl);

        // Also save to localStorage for persistence
        const updatedProfileData = { ...profileData, profilePicture: fullUrl };
        localStorage.setItem(
          "patientProfile",
          JSON.stringify(updatedProfileData)
        );
      }

      setSuccessMessage("Profile picture uploaded successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Profile picture upload error:", err);
      console.error("Error status:", err.response?.status);
      console.error("Error response:", err.response);

      // If it's a 403 error, show a message about mock authentication
      if (err.response?.status === 403) {
        setLocalError(
          "Profile picture upload not available with mock authentication. Please log in with real credentials."
        );
      } else if (err.response?.status === 500 || err.message?.includes("500")) {
        // For 500 errors, try to save to localStorage as fallback
        try {
          const mockUrl = URL.createObjectURL(file);
          setProfilePicture(mockUrl);
          const updatedProfileData = {
            ...profileData,
            profilePicture: mockUrl,
          };
          localStorage.setItem(
            "patientProfile",
            JSON.stringify(updatedProfileData)
          );
          setLocalError(
            "Server error occurred, but image saved locally. Please try again later."
          );
        } catch (fallbackError) {
          console.error("Fallback save failed:", fallbackError);
          setLocalError("Failed to upload profile picture. Please try again.");
        }
      } else {
        setLocalError("Failed to upload profile picture. Please try again.");
      }
    } finally {
      setUploadLoading(false);
    }
  };

  const handleProfilePictureDelete = async () => {
    try {
      setUploadLoading(true);
      setLocalError(null);

      await profileAPI.deleteProfilePicture();
      setProfilePicture(null);

      // Also save to localStorage for persistence
      const updatedProfileData = { ...profileData, profilePicture: null };
      localStorage.setItem(
        "patientProfile",
        JSON.stringify(updatedProfileData)
      );

      setSuccessMessage("Profile picture deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Profile picture delete error:", err);
      // If it's a 403 error, show a message about mock authentication
      if (err.response?.status === 403) {
        setLocalError(
          "Profile picture deletion not available with mock authentication. Please log in with real credentials."
        );
      } else {
        setLocalError("Failed to delete profile picture. Please try again.");
      }
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {t("profile.title")}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                {t("profile.subtitle")}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>{t("profile.editProfile")}</span>
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>{t("common.cancel")}</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{t("profile.saveChanges")}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="py-6 space-y-6">
        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4">
            <p className="text-green-600 dark:text-green-400 text-sm">
              {successMessage}
            </p>
          </div>
        )}

        {localError && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400 text-sm">
              {localError}
            </p>
          </div>
        )}

        {/* Profile Picture Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Profile Picture
          </h3>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <ProfilePictureUpload
              currentPicture={profilePicture}
              onUpload={handleProfilePictureUpload}
              onDelete={handleProfilePictureDelete}
              loading={uploadLoading}
              disabled={!isEditing}
              error={localError}
            />
            <div className="text-center sm:text-left">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                {profileData.firstName} {profileData.lastName}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {profileData.email}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                Patient
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={profileData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={profileData.dateOfBirth}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={profileData.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-600"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Blood Type
              </label>
              <select
                name="bloodType"
                value={profileData.bloodType}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-600"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={profileData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Medical Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Emergency Contact
              </label>
              <input
                type="text"
                name="emergencyContact"
                value={profileData.emergencyContact}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Emergency Phone
              </label>
              <input
                type="tel"
                name="emergencyPhone"
                value={profileData.emergencyPhone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Insurance Provider
              </label>
              <input
                type="text"
                name="insuranceProvider"
                value={profileData.insuranceProvider}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Insurance Number
              </label>
              <input
                type="text"
                name="insuranceNumber"
                value={profileData.insuranceNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-600"
              />
            </div>
          </div>
          <div className="mt-4 sm:mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Medical History
              </label>
              <textarea
                name="medicalHistory"
                value={profileData.medicalHistory}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-600"
                placeholder="Describe your medical history..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Allergies
              </label>
              <textarea
                name="allergies"
                value={profileData.allergies}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-600"
                placeholder="List any known allergies..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Medications
              </label>
              <textarea
                name="medications"
                value={profileData.medications}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-600"
                placeholder="List current medications..."
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Preferences
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timezone
              </label>
              <select
                name="timezone"
                value={profileData.timezone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-600"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                name="language"
                value={profileData.language}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-600"
              >
                <option value="en">English</option>
                <option value="om">Oromo</option>
                <option value="am">Amharic</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Notification Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Email Notifications
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive notifications via email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="notifications.email"
                  checked={profileData.notifications.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600 disabled:opacity-50"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  SMS Notifications
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive notifications via SMS
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="notifications.sms"
                  checked={profileData.notifications.sms}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600 disabled:opacity-50"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Push Notifications
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive push notifications in browser
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="notifications.push"
                  checked={profileData.notifications.push}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600 disabled:opacity-50"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Password Change Section */}
        {isEditing && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Change Password
              </h3>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 self-start sm:self-auto"
              >
                {showPasswordForm ? "Cancel" : "Change Password"}
              </button>
            </div>

            {showPasswordForm && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.old ? "text" : "password"}
                      name="passwordOldPassword"
                      value={passwordData.oldPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          old: !prev.old,
                        }))
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.old ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="passwordNewPassword"
                      value={passwordData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          new: !prev.new,
                        }))
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="passwordConfirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => setShowPasswordForm(false)}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordChange}
                    className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 order-1 sm:order-2"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
