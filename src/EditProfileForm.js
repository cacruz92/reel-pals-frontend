import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Button, Container, Card, CardBody, Alert } from 'reactstrap';
import OmdbApi from './api';
import './EditProfileForm.css';

const EditProfileForm = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        profilePictureUrl: ''
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await OmdbApi.getUserProfile(username);
                setFormData(prevData => ({
                    ...prevData,
                    firstName: res.user.firstName,
                    lastName: res.user.lastName,
                    profilePictureUrl: res.user.picture || ''
                }));
            } catch (e) {
                console.error("Error fetching user info:", e);
                setError("Failed to load user information. Please try again.");
            }
        };
        fetchUserInfo();
    }, [username]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(data => ({
            ...data,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        const hasChanges = formData.firstName !== formData.originalFirstName ||
                           formData.lastName !== formData.originalLastName ||
                           formData.profilePictureUrl !== formData.originalProfilePictureUrl ||
                           formData.newPassword;

        if (!hasChanges) {
            setError("No changes were made to update.");
            return;
        }

        const updateData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            picture: formData.profilePictureUrl
        };

        if (formData.newPassword) {
            if (!formData.oldPassword) {
                setError("Please enter your current password to make changes.");
                return;
            }

            if (formData.newPassword !== formData.confirmNewPassword) {
                setError("New passwords do not match.");
                return;
            }
            
            try {
                const isPasswordValid = await OmdbApi.verifyPassword(username, formData.oldPassword);
                if (!isPasswordValid) {
                    setError("Current password is incorrect.");
                    return;
                }
            } catch (e) {
                console.error("Error verifying password:", e);
                setError("Failed to verify password. Please try again.");
                return;
            }
        }

        if (formData.newPassword !== formData.confirmNewPassword) {
            setError("New passwords do not match.");
            return;
        }

        try {
            const updateData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                picture: formData.profilePictureUrl
            };

            if (formData.newPassword) {
                updateData.currentPassword = formData.oldPassword;
                updateData.newPassword = formData.newPassword;
            }

            const updatedUser = await OmdbApi.updateUserProfile(username, updateData);
            setSuccessMessage("Profile updated successfully!");
            navigate(`/users/${username}`)
        } catch (e) {
            console.error("Error updating profile:", e);
            setError("Failed to update profile. Please try again.");
        }
    };

    if (error) return <Alert color="danger">{error}</Alert>;

    return (
        <Container className="EditProfileForm">
            <Card className="form-card">
                <CardBody>
                    <h2 className="text-center mb-4">Edit Profile</h2>
                    {successMessage && <Alert color="success">{successMessage}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="firstName">First Name</Label>
                            <Input
                                type="text"
                                name="firstName"
                                id="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="lastName">Last Name</Label>
                            <Input
                                type="text"
                                name="lastName"
                                id="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="oldPassword">Current Password</Label>
                            <Input
                                type="password"
                                name="oldPassword"
                                id="oldPassword"
                                value={formData.oldPassword}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="newPassword">New Password</Label>
                            <Input
                                type="password"
                                name="newPassword"
                                id="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="confirmNewPassword">Confirm New Password</Label>
                            <Input
                                type="password"
                                name="confirmNewPassword"
                                id="confirmNewPassword"
                                value={formData.confirmNewPassword}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="profilePictureUrl">Profile Picture URL</Label>
                            <Input
                                type="url"
                                name="profilePictureUrl"
                                id="profilePictureUrl"
                                value={formData.profilePictureUrl}
                                onChange={handleChange}
                                placeholder="Enter URL for profile picture"
                            />
                        </FormGroup>
                        {formData.profilePictureUrl && (
                            <div className="profile-preview-container">
                                <img src={formData.profilePictureUrl} alt="Profile Preview" className="profile-preview" />
                            </div>
                        )}
                        <Button color="primary" type="submit" className="submit-btn">Update Profile</Button>
                    </Form>
                </CardBody>
            </Card>
        </Container>
    );
};

export default EditProfileForm;