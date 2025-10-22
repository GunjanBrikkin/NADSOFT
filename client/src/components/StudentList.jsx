// client/src/components/StudentList.jsx
import React, { useEffect, useState } from 'react';
import API from '../api';
import Swal from 'sweetalert2';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [meta, setMeta] = useState({page:1, limit:10, total:0, totalPages:1});
  const [loading, setLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    dob: ''
  });
  const [showModal, setShowModal] = useState(false);

  const fetchStudents = async (page = 1, limit = meta.limit) => {
    setLoading(true);
    try {
      const res = await API.get(`/students?page=${page}&limit=${limit}`);
      setStudents(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.message, 'error');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchStudents(1); }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete?',
      text: 'This will delete the student and marks.',
      icon: 'warning',
      showCancelButton: true
    }).then(async (r) => {
      if (r.isConfirmed) {
        try {
          await API.delete(`/students/${id}`);
          Swal.fire('Deleted', '', 'success');
          fetchStudents(meta.page);
        } catch (err) {
          Swal.fire('Error', err.response?.data?.error || err.message, 'error');
        }
      }
    });
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setEditForm({
      first_name: student.first_name || '',
      last_name: student.last_name || '',
      email: student.email || '',
      dob: student.dob ? student.dob.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put(`/students/${editingStudent.id}`, editForm);
      if (data.success) {
        Swal.fire('Success', 'Student updated successfully', 'success');
        setShowModal(false);
        setEditingStudent(null);
        fetchStudents(meta.page);
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.error || err.message, 'error');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const viewStudent = async (id) => {
    try {
      const res = await API.get(`/students/${id}`);
      const st = res.data.student;
      let html = `
        <div class="text-start">
          <p><strong>Name:</strong> ${st.first_name} ${st.last_name || ''}</p>
          <p><strong>Email:</strong> ${st.email || 'N/A'}</p>
          <p><strong>Date of Birth:</strong> ${st.dob ? new Date(st.dob).toLocaleDateString() : 'N/A'}</p>
          <hr/>
          <h6>Marks:</h6>
      `;
      
      if (st.marks && st.marks.length) {
        html += '<ul class="list-group">';
        st.marks.forEach((m, i) => html += 
          `<li class="list-group-item d-flex justify-content-between align-items-center">
            <span>${m.subject}: ${m.marks} (${m.term || '-'})</span>
            <span class="badge bg-primary rounded-pill">${m.term}</span>
          </li>`
        );
        html += '</ul>';
      } else {
        html += '<p>No marks available.</p>';
      }
      
      html += '</div>';
      
      Swal.fire({
        title: 'Student Details',
        html,
        showCloseButton: true,
        showConfirmButton: false,
        width: '600px',
        customClass: {
          popup: 'text-start'
        }
      });
    } catch (err) {
      Swal.fire('Error', err.response?.data?.error || err.message, 'error');
    }
  };

  const goToPage = (p) => fetchStudents(p);

  return (
    <div>
      <div className="card p-3 mb-3">
        <h5>Students</h5>
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map(s => (
                    <tr key={s.id} className="align-middle">
                      <td>{s.id}</td>
                      <td>{s.first_name} {s.last_name}</td>
                      <td>{s.email}</td>
                      <td>
                        <div className="btn-group btn-group-sm" role="group">
                          <button 
                            className="btn btn-outline-primary" 
                            onClick={() => viewStudent(s.id)}
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button 
                            className="btn btn-outline-secondary" 
                            onClick={() => handleEdit(s)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-outline-danger" 
                            onClick={() => handleDelete(s.id)}
                            title="Delete"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Student Modal */}
      {editingStudent && (
        <div 
          className={`modal fade ${showModal ? 'show d-block' : ''}`} 
          style={{ backgroundColor: showModal ? 'rgba(0,0,0,0.5)' : 'transparent' }}
          tabIndex="-1" 
          aria-labelledby="editStudentModalLabel" 
          aria-hidden={!showModal}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editStudentModalLabel">Edit Student</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleUpdate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="first_name" className="form-label">First Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="first_name"
                      name="first_name"
                      value={editForm.first_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="last_name" className="form-label">Last Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="last_name"
                      name="last_name"
                      value={editForm.last_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="dob" className="form-label">Date of Birth</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      id="dob"
                      name="dob"
                      value={editForm.dob}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${meta.page === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => goToPage(meta.page - 1)}
                disabled={meta.page === 1}
              >
                Previous
              </button>
            </li>
            
            {Array.from({length: Math.min(5, meta.totalPages)}, (_, i) => {
              // Show first page, last page, and pages around current page
              let pageNum;
              if (meta.totalPages <= 5) {
                pageNum = i + 1;
              } else if (meta.page <= 3) {
                pageNum = i + 1;
              } else if (meta.page >= meta.totalPages - 2) {
                pageNum = meta.totalPages - 4 + i;
              } else {
                pageNum = meta.page - 2 + i;
              }
              
              return (
                <li 
                  className={`page-item ${meta.page === pageNum ? 'active' : ''}`} 
                  key={pageNum}
                >
                  <button 
                    className="page-link" 
                    onClick={() => goToPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                </li>
              );
            })}
            
            <li className={`page-item ${meta.page === meta.totalPages ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => goToPage(meta.page + 1)}
                disabled={meta.page === meta.totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
