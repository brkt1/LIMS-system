import {
  Camera,
  Edit,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  Calendar,
  Shield,
} from "lucide-react";
import React, { useState } from "react";

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    personalInfo: {
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1985-06-15",
      gender: "Male",
      bloodType: "O+",
      phone: "+1 (555) 123-4567",
      email: "john.doe@email.com",
      address: "123 Main Street, City, State 12345",
      emergencyContact: "Jane Doe (Spouse) - +1 (555) 987-6543",
    },
    medicalInfo: {
      allergies: "Penicillin, Shellfish",
      medications: "Metformin 500mg daily, Lisinopril 10mg daily",
      medicalConditions: "Type 2 Diabetes, Hypertension",
      insuranceProvider: "Blue Cross Blue Shield",
      insuranceNumber: "BC123456789",
      primaryPhysician: "Dr. Sarah Johnson",
    },
    preferences: {
      language: "English",
      timezone: "EST (UTC-5)",
      notifications: {
        email: true,
        sms: true,
        push: false,
      },
      privacy: {
        shareData: false,
        marketing: false,
      },
    },
  });

  const handleInputChange = (section: string, field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleNestedInputChange = (
    section: string,
    subsection: string,
    field: string,
    value: string | boolean
  ) => {
    setProfileData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [subsection]: {
          ...(prev[section as keyof typeof prev] as any)[subsection],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = () => {
    // Here you would typically save the profile data to the backend
    console.log("Saving profile:", profileData);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your personal information and preferences
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Profile Picture and Basic Info */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-primary-600" />
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {profileData.personalInfo.firstName}{" "}
                {profileData.personalInfo.lastName}
              </h3>
              <p className="text-sm text-gray-600">Patient ID: PAT001</p>
              <p className="text-sm text-gray-600">Member since 2023</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Personal Information
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.personalInfo.firstName}
                      onChange={(e) =>
                        handleInputChange(
                          "personalInfo",
                          "firstName",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">
                      {profileData.personalInfo.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.personalInfo.lastName}
                      onChange={(e) =>
                        handleInputChange(
                          "personalInfo",
                          "lastName",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">
                      {profileData.personalInfo.lastName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={profileData.personalInfo.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange(
                          "personalInfo",
                          "dateOfBirth",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">
                      {profileData.personalInfo.dateOfBirth}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  {isEditing ? (
                    <select
                      value={profileData.personalInfo.gender}
                      onChange={(e) =>
                        handleInputChange(
                          "personalInfo",
                          "gender",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-sm text-gray-900">
                      {profileData.personalInfo.gender}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Type
                  </label>
                  {isEditing ? (
                    <select
                      value={profileData.personalInfo.bloodType}
                      onChange={(e) =>
                        handleInputChange(
                          "personalInfo",
                          "bloodType",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                  ) : (
                    <p className="text-sm text-gray-900">
                      {profileData.personalInfo.bloodType}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.personalInfo.phone}
                      onChange={(e) =>
                        handleInputChange(
                          "personalInfo",
                          "phone",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">
                      {profileData.personalInfo.phone}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.personalInfo.email}
                    onChange={(e) =>
                      handleInputChange("personalInfo", "email", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-sm text-gray-900">
                    {profileData.personalInfo.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    value={profileData.personalInfo.address}
                    onChange={(e) =>
                      handleInputChange(
                        "personalInfo",
                        "address",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-sm text-gray-900">
                    {profileData.personalInfo.address}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.personalInfo.emergencyContact}
                    onChange={(e) =>
                      handleInputChange(
                        "personalInfo",
                        "emergencyContact",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-sm text-gray-900">
                    {profileData.personalInfo.emergencyContact}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Medical Information
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allergies
                </label>
                {isEditing ? (
                  <textarea
                    value={profileData.medicalInfo.allergies}
                    onChange={(e) =>
                      handleInputChange(
                        "medicalInfo",
                        "allergies",
                        e.target.value
                      )
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-sm text-gray-900">
                    {profileData.medicalInfo.allergies}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Medications
                </label>
                {isEditing ? (
                  <textarea
                    value={profileData.medicalInfo.medications}
                    onChange={(e) =>
                      handleInputChange(
                        "medicalInfo",
                        "medications",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-sm text-gray-900">
                    {profileData.medicalInfo.medications}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Conditions
                </label>
                {isEditing ? (
                  <textarea
                    value={profileData.medicalInfo.medicalConditions}
                    onChange={(e) =>
                      handleInputChange(
                        "medicalInfo",
                        "medicalConditions",
                        e.target.value
                      )
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-sm text-gray-900">
                    {profileData.medicalInfo.medicalConditions}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Insurance Provider
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.medicalInfo.insuranceProvider}
                      onChange={(e) =>
                        handleInputChange(
                          "medicalInfo",
                          "insuranceProvider",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">
                      {profileData.medicalInfo.insuranceProvider}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Insurance Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.medicalInfo.insuranceNumber}
                      onChange={(e) =>
                        handleInputChange(
                          "medicalInfo",
                          "insuranceNumber",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">
                      {profileData.medicalInfo.insuranceNumber}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Physician
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.medicalInfo.primaryPhysician}
                    onChange={(e) =>
                      handleInputChange(
                        "medicalInfo",
                        "primaryPhysician",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-sm text-gray-900">
                    {profileData.medicalInfo.primaryPhysician}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Preferences
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  {isEditing ? (
                    <select
                      value={profileData.preferences.language}
                      onChange={(e) =>
                        handleInputChange(
                          "preferences",
                          "language",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                    </select>
                  ) : (
                    <p className="text-sm text-gray-900">
                      {profileData.preferences.language}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone
                  </label>
                  {isEditing ? (
                    <select
                      value={profileData.preferences.timezone}
                      onChange={(e) =>
                        handleInputChange(
                          "preferences",
                          "timezone",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="EST (UTC-5)">EST (UTC-5)</option>
                      <option value="PST (UTC-8)">PST (UTC-8)</option>
                      <option value="CST (UTC-6)">CST (UTC-6)</option>
                    </select>
                  ) : (
                    <p className="text-sm text-gray-900">
                      {profileData.preferences.timezone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Notification Preferences
                </h4>
                <div className="space-y-2">
                  {Object.entries(profileData.preferences.notifications).map(
                    ([key, value]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "preferences",
                              "notifications",
                              key,
                              e.target.checked
                            )
                          }
                          disabled={!isEditing}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                          notifications
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Privacy Settings
                </h4>
                <div className="space-y-2">
                  {Object.entries(profileData.preferences.privacy).map(
                    ([key, value]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "preferences",
                              "privacy",
                              key,
                              e.target.checked
                            )
                          }
                          disabled={!isEditing}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {key === "shareData"
                            ? "Share data for research"
                            : "Receive marketing communications"}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
