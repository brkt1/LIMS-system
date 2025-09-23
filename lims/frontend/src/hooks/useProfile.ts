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

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
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
      // Don't set error for initial load, just use defaults
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
      const errorMessage = err.response?.data?.detail || 'Failed to update profile';
      setError(errorMessage);
      throw new Error(errorMessage);
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
      const errorMessage = err.response?.data?.detail || 'Failed to upload profile picture';
      setError(errorMessage);
      throw new Error(errorMessage);
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
      const errorMessage = err.response?.data?.detail || 'Failed to delete profile picture';
      setError(errorMessage);
      throw new Error(errorMessage);
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
      const errorMessage = err.response?.data?.detail || 'Failed to change password';
      setError(errorMessage);
      throw new Error(errorMessage);
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
