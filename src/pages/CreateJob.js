import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

function CreateJob() {
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    location: '',
    jobType: 'Full-time',
    description: '',
    requirements: '',
    salaryRange: '',
    contactEmail: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Generate slug from title
  const generateSlug = (title) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    const randomId = Math.random().toString(36).substr(2, 6);
    return `${slug}-${randomId}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setError('You must be logged in');
      setLoading(false);
      return;
    }

    // Generate slug
    const slug = generateSlug(formData.title);

    // Insert job into database
    const { data, error } = await supabase
      .from('jobs')
      .insert([
        {
          user_id: user.id,
          title: formData.title,
          company_name: formData.companyName,
          location: formData.location,
          job_type: formData.jobType,
          description: formData.description,
          requirements: formData.requirements,
          salary_range: formData.salaryRange,
          contact_email: formData.contactEmail || user.email,
          slug: slug,
          status: 'active'
        }
      ])
      .select();

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Success! Redirect to dashboard
      navigate('/dashboard');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <div style={styles.header}>
          <h2>Create Job Posting</h2>
          <button 
            onClick={() => navigate('/dashboard')}
            style={styles.backBtn}
          >
            ← Back to Dashboard
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Job Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="e.g. Senior React Developer"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Company Name *</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="e.g. Tech Company Inc."
            />
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="e.g. Remote, New York, etc."
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Job Type *</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Job Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              style={styles.textarea}
              placeholder="Describe the role, responsibilities, team, etc."
              rows="6"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Requirements *</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              required
              style={styles.textarea}
              placeholder="List required skills, experience, qualifications, etc."
              rows="5"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Salary Range (optional)</label>
            <input
              type="text"
              name="salaryRange"
              value={formData.salaryRange}
              onChange={handleChange}
              style={styles.input}
              placeholder="e.g. $80,000 - $120,000"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Contact Email (optional)</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              style={styles.input}
              placeholder="Leave blank to use your account email"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={styles.submitBtn}
          >
            {loading ? 'Creating...' : 'Create Job Posting'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  formBox: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  backBtn: {
    padding: '8px 16px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  inputGroup: {
    marginBottom: '20px',
    flex: 1,
  },
  row: {
    display: 'flex',
    gap: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#555',
    fontSize: '14px',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c00',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px',
    fontSize: '14px',
  }
};

export default CreateJob;