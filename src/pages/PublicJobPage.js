import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function PublicJobPage() {
  const { username, slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
    linkedinUrl: '',
    portfolioUrl: ''
  });
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    loadJob();
  }, [slug]);

  const loadJob = async () => {
    // Find job by slug
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .single();

    if (error || !data) {
      setError('Job not found or no longer active');
      setLoading(false);
      return;
    }

    setJob(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload PDF or DOC file only');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setResumeFile(file);
    }
  };

  const uploadResume = async () => {
    if (!resumeFile) return null;

    const fileExt = resumeFile.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `resumes/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('applications')
      .upload(filePath, resumeFile);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    // Get public URL
    const { data } = supabase.storage
      .from('applications')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApplying(true);
    setError('');

    // Validate resume file
    if (!resumeFile) {
      setError('Please upload your resume');
      setApplying(false);
      return;
    }

    // Upload resume
    const resumeUrl = await uploadResume();
    if (!resumeUrl) {
      setError('Failed to upload resume. Please try again.');
      setApplying(false);
      return;
    }

    // Submit application
    const { error: insertError } = await supabase
      .from('applications')
      .insert([
        {
          job_id: job.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          resume_url: resumeUrl,
          cover_letter: formData.coverLetter,
          linkedin_url: formData.linkedinUrl,
          portfolio_url: formData.portfolioUrl,
          status: 'new'
        }
      ]);

    if (insertError) {
      setError('Failed to submit application. Please try again.');
      console.error('Insert error:', insertError);
      setApplying(false);
      return;
    }

    // Success!
    setSubmitted(true);
    setApplying(false);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading job...</div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <h2>😕 {error}</h2>
          <p>The job posting you're looking for doesn't exist or is no longer available.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={styles.container}>
        <div style={styles.successBox}>
          <h2>✅ Application Submitted!</h2>
          <p>Thank you for applying to <strong>{job.title}</strong> at {job.company_name}.</p>
          <p>We'll review your application and get back to you soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.jobSection}>
        <div style={styles.jobHeader}>
          <h1 style={styles.jobTitle}>{job.title}</h1>
          <div style={styles.jobMeta}>
            <span>{job.company_name}</span>
            <span>•</span>
            <span>{job.location}</span>
            <span>•</span>
            <span>{job.job_type}</span>
          </div>
          {job.salary_range && (
            <div style={styles.salary}>💰 {job.salary_range}</div>
          )}
        </div>

        <div style={styles.jobContent}>
          <div style={styles.section}>
            <h3>About the Role</h3>
            <p style={styles.text}>{job.description}</p>
          </div>

          <div style={styles.section}>
            <h3>Requirements</h3>
            <p style={styles.text}>{job.requirements}</p>
          </div>
        </div>
      </div>

      <div style={styles.applicationSection}>
        <h2 style={styles.formTitle}>Apply for this position</h2>
        
        {error && <div style={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="John Doe"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="john@example.com"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="+1 234 567 8900"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Resume (PDF or DOC) *</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              required
              style={styles.fileInput}
            />
            {resumeFile && (
              <div style={styles.fileName}>
                Selected: {resumeFile.name}
              </div>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Cover Letter (optional)</label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Tell us why you're a great fit for this role..."
              rows="6"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>LinkedIn URL (optional)</label>
            <input
              type="url"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleChange}
              style={styles.input}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Portfolio URL (optional)</label>
            <input
              type="url"
              name="portfolioUrl"
              value={formData.portfolioUrl}
              onChange={handleChange}
              style={styles.input}
              placeholder="https://yourportfolio.com"
            />
          </div>

          <button 
            type="submit" 
            disabled={applying}
            style={styles.submitBtn}
          >
            {applying ? 'Submitting...' : 'Submit Application'}
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
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
  },
  errorBox: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '40px auto',
  },
  successBox: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '40px auto',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  jobSection: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    marginBottom: '24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    maxWidth: '900px',
    margin: '0 auto 24px auto',
  },
  jobHeader: {
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '20px',
    marginBottom: '24px',
  },
  jobTitle: {
    fontSize: '32px',
    margin: '0 0 12px 0',
    color: '#333',
  },
  jobMeta: {
    fontSize: '16px',
    color: '#666',
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  salary: {
    fontSize: '18px',
    color: '#1976d2',
    marginTop: '8px',
    fontWeight: '500',
  },
  jobContent: {
    lineHeight: '1.6',
  },
  section: {
    marginBottom: '24px',
  },
  text: {
    whiteSpace: 'pre-wrap',
    color: '#555',
    fontSize: '15px',
  },
  applicationSection: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    maxWidth: '900px',
    margin: '0 auto',
  },
  formTitle: {
    marginBottom: '24px',
    color: '#333',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
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
  fileInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  fileName: {
    marginTop: '8px',
    fontSize: '13px',
    color: '#666',
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
    fontWeight: '500',
  },
  errorMessage: {
    backgroundColor: '#fee',
    color: '#c00',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
    fontSize: '14px',
  }
};

export default PublicJobPage;