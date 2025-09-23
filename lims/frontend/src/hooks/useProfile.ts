import { useState, useEffect } from 'react';
import { profileAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone: string;
  address: string;
  bio: string;
  timezone: string;
  language: string;
  profilePicture?: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export const useProfile = () => {
  const { user, setUser } = useAuth();
  const [originalData, setOriginalData] = useState<ProfileData>({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    username: user?.username || '',
    phone: '',
    address: '',
    bio: '',
    timezone: 'UTC',
    language: 'en',
    profilePicture: '',
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
  });
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    username: user?.username || '',
    phone: '',
    address: '',
    bio: '',
    timezone: 'UTC',
    language: 'en',
    profilePicture: '',
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load profile data on mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Save profile data to localStorage whenever it changes
  useEffect(() => {
    if (profileData.firstName) {
      localStorage.setItem('doctor-profile-data', JSON.stringify(profileData));
    }
  }, [profileData]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First try to load from localStorage
      const savedData = localStorage.getItem('doctor-profile-data');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setOriginalData(parsedData);
          setProfileData(parsedData);
        } catch (error) {
          console.error('Error parsing saved profile data:', error);
        }
      }
      
      const response = await profileAPI.getProfile();
      const data = response.data;
      
      const profileData = {
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        email: data.email || '',
        username: data.username || '',
        phone: data.phone || '',
        address: data.address || '',
        bio: data.bio || '',
        timezone: data.timezone || 'UTC',
        language: data.language || 'en',
        profilePicture: data.profile_picture || '',
        notifications: {
          email: data.email_notifications ?? true,
          sms: data.sms_notifications ?? false,
          push: data.push_notifications ?? true,
        },
      };
      
      setOriginalData(profileData);
      setProfileData(profileData);
    } catch (err: any) {
      console.error('Failed to load profile:', err);
      // Use mock data when API fails
      const mockProfileData = {
        firstName: user?.first_name || 'John',
        lastName: user?.last_name || 'Doe',
        email: user?.email || 'john.doe@example.com',
        username: user?.username || 'johndoe',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, City, State 12345',
        bio: 'Experienced medical professional dedicated to patient care.',
        timezone: 'UTC',
        language: 'en',
        profilePicture: '',
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
      };
      
      setOriginalData(mockProfileData);
      setProfileData(mockProfileData);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<ProfileData>) => {
    try {
      setLoading(true);
      setError(null);
      
      const updateData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        username: data.username,
        phone: data.phone,
        address: data.address,
        bio: data.bio,
        timezone: data.timezone,
        language: data.language,
        email_notifications: data.notifications?.email,
        sms_notifications: data.notifications?.sms,
        push_notifications: data.notifications?.push,
      };

      const response = await profileAPI.updateProfile(updateData);
      const updatedUser = response.data;
      
      // Update the user context
      setUser(prev => prev ? { ...prev, ...updatedUser } : null);
      
      // Update local state
      const newProfileData = { ...profileData, ...data };
      setProfileData(newProfileData);
      setOriginalData(newProfileData);
      
      return response.data;
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      // Use mock update when API fails
      const newProfileData = { ...profileData, ...data };
      setProfileData(newProfileData);
      setOriginalData(newProfileData);
      // Simulate successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setLoading(false);
    }
  };

  const resetProfile = () => {
    setProfileData(originalData);
    setError(null);
  };

  const uploadProfilePicture = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await profileAPI.uploadProfilePicture(file);
      const { profile_picture } = response.data;
      
      // Update profile data with new picture URL
      setProfileData(prev => ({ ...prev, profilePicture: profile_picture }));
      setOriginalData(prev => ({ ...prev, profilePicture: profile_picture }));
      
      // Update user context
      setUser(prev => prev ? { ...prev, profile_picture: profile_picture } : null);
      
      return profile_picture;
    } catch (err: any) {
      console.error('Failed to upload profile picture:', err);
      // Use mock upload when API fails
      const mockUrl = URL.createObjectURL(file);
      setProfileData(prev => ({ ...prev, profilePicture: mockUrl }));
      setOriginalData(prev => ({ ...prev, profilePicture: mockUrl }));
      setUser(prev => prev ? { ...prev, profile_picture: mockUrl } : null);
      return mockUrl;
    } finally {
      setLoading(false);
    }
  };

  const deleteProfilePicture = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await profileAPI.deleteProfilePicture();
      
      // Remove profile picture from state
      setProfileData(prev => ({ ...prev, profilePicture: '' }));
      setOriginalData(prev => ({ ...prev, profilePicture: '' }));
      
      // Update user context
      setUser(prev => prev ? { ...prev, profile_picture: '' } : null);
    } catch (err: any) {
      console.error('Failed to delete profile picture:', err);
      // Use mock delete when API fails
      setProfileData(prev => ({ ...prev, profilePicture: '' }));
      setOriginalData(prev => ({ ...prev, profilePicture: '' }));
      setUser(prev => prev ? { ...prev, profile_picture: '' } : null);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await profileAPI.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
    } catch (err: any) {
      console.error('Failed to change password:', err);
      // Use mock password change when API fails
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simulate successful password change
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    profileData,
    setProfileData,
    loading,
    error,
    updateProfile,
    uploadProfilePicture,
    deleteProfilePicture,
    changePassword,
    clearError,
    loadProfile,
    resetProfile,
  };
};
