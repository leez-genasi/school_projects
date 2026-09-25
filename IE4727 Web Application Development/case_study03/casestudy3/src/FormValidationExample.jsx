import { useState } from 'react';
import './App.css';

const FormValidationExample = () => {
    const [formData, setFormData] = useState({
        Name: '',
        Course:'',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = {};

        if (!formData.username.trim()) {
            validationErrors.username = 'Username is required';
        }

        if (!formData.email.trim()) {
            validationErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            validationErrors.email = 'Email is invalid';
        }

        if (!formData.password.trim()) {
            validationErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            validationErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.confirmPassword !== formData.password) {
            validationErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            alert('Form submitted');
            console.log(formData);
        }
    };

    console.log("Running");
    return (
        <body>
        <form class="form" onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input 
                    type="text"
                    name="Name"
                    placeholder='Name'
                    pattern="[A-Za-z\s]+"
                    autoComplete='off'
                    required
                    onChange={handleChange} // Corrected here
                />
            </div>
            <div>
                <label>Course:</label>
                <select name="course">
                    <option value="EEE">EEE</option>
                    <option value="IEM">IEM</option>
                </select>
            </div>
            <div>
                <label>Username:</label>
                <input 
                    type="text"
                    name="username"
                    placeholder='username'
                    pattern="[A-Za-z\s]+"
                    autoComplete='off'
                    required
                    onChange={handleChange} // Corrected here
                />
                {errors.username && <span>{errors.username}</span>}
            </div>
            <div>
                <label>Email:</label>
                <input 
                    type="email"
                    name="email"
                    placeholder='example@email.com'
                    pattern="^[A-Za-z0-9.-]+@[A-Za-z].[A-za-z]{2,3}" 
                    required
                    autoComplete='off'
                    onChange={handleChange} // Corrected here
                />
                {errors.email && <span>{errors.email}</span>}
            </div>
            <div>
                <label>Password:</label>
                <input 
                    type="password"
                    name="password"
                    placeholder='***********'
                    pattern="(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}" 
                    required
                    autoComplete='off'
                    onChange={handleChange} // Corrected here
                />
                {errors.password && <span>{errors.password}</span>} {/* Corrected here */}
            </div>
            <div>
                <label>Confirm Password:</label>
                <input 
                    type="password"
                    name="confirmPassword"
                    placeholder='***********'
                    pattern="(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}" 
                    required
                    autoComplete='off'
                    onChange={handleChange} // Corrected here
                />
                {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
            </div>
            <button id="tada" type='submit'>Submit</button>
        </form></body>
    );
};

export default FormValidationExample;