import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserAndLoadJobs();
  }, []);

  const checkUserAndLoadJobs = async () => {
    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setUser(user);

    // Load user's jobs
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading jobs:', error);
    } else {
      setJobs(data);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const copyJobLink = (username, slug) => {
    const link = `${window.location.origin}/apply/${username}/${slug}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  const getUsername = (email) => {
    return email.split('@')[0];
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1>Dashboard</h1>
          <p style={styles.subtitle}>{user.email}</p>
        </div>
        <div style={styles.headerActions}>
          <button 
            onClick={() => navigate('/jobs/create')}
            style={styles.createBtn}
          >
            + Create New Job
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <h2 style={styles.sectionTitle}>Your Job Postings ({jobs.length})</h2>

        {jobs.length === 0 ? (
          <div style={styles.emptyState}>
            <p>You haven't created any job postings yet.</p>
            <button 
              onClick={() => navigate('/jobs/create')}
              style={styles.createBtn}
            >
              Create Your First Job
            </button>
          </div>
        ) : (
          <div style={styles.jobsList}>
            {jobs.map(job => (
              <div key={job.id} style={styles.jobCard}>
                <div style={styles.jobHeader}>
                  <div>
                    <h3 style={styles.jobTitle}>{job.title}</h3>
                    <p style={styles.jobMeta}>
                      {job.company_name} • {job.location} • {job.job_type}
                    </p>
                    <p style={styles.jobDate}>
                      Created {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={styles.statusBadge}>
                    {job.status === 'active' ? '🟢 Active' : '🔴 Closed'}
                  </div>
                </div>

                <div style={styles.jobActions}>
                  <button
                    onClick={() => copyJobLink(getUsername(user.email), job.slug)}
                    style={styles.actionBtn}
                  >
                    📋 Copy Link
                  </button>
                  <button
                    onClick={() => navigate(`/jobs/${job.id}/applications`)}
                    style={styles.actionBtn}
                  >
                    👥 View Applications
                  </button>
                  <button
                    onClick={() => navigate(`/jobs/${job.id}/edit`)}
                    style={styles.actionBtn}
                  >
                    ✏️ Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    marginBottom: '24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    flexWrap: 'wrap',
    gap: '16px',
  },
  subtitle: {
    color: '#666',
    fontSize: '14px',
    marginTop: '4px',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  createBtn: {
    padding: '12px 24px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  logoutBtn: {
    padding: '12px 24px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  content: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    marginBottom: '20px',
    color: '#333',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666',
  },
  jobsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  jobCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#fafafa',
  },
  jobHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '16px',
  },
  jobTitle: {
    margin: '0 0 8px 0',
    color: '#333',
    fontSize: '20px',
  },
  jobMeta: {
    color: '#666',
    fontSize: '14px',
    margin: '4px 0',
  },
  jobDate: {
    color: '#999',
    fontSize: '13px',
    margin: '4px 0',
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
  },
  jobActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  actionBtn: {
    padding: '8px 16px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  }
};

export default Dashboard;