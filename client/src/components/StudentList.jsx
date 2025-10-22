// client/src/components/StudentList.jsx
import React, { useEffect, useState } from 'react';
import API from '../api';
import Swal from 'sweetalert2';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [meta, setMeta] = useState({page:1, limit:10, total:0, totalPages:1});
  const [loading, setLoading] = useState(false);

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

  useEffect(()=> { fetchStudents(1); }, []);

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
          Swal.fire('Error', err.message, 'error');
        }
      }
    });
  };

  const viewStudent = async (id) => {
    try {
      const res = await API.get(`/students/${id}`);
      const st = res.data.student;
      let html = `<strong>${st.first_name} ${st.last_name}</strong><br/>Email: ${st.email}<br/>DOB: ${st.dob || 'N/A'}<hr/>`;
      if (st.marks && st.marks.length) {
        html += '<ul>';
        st.marks.forEach(m => html += `<li>${m.subject}: ${m.marks} (${m.term || '-'})</li>`);
        html += '</ul>';
      } else html += 'No marks.';
      Swal.fire({title:'Student details', html});
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const goToPage = (p) => fetchStudents(p);

  return (
    <div>
      <div className="card p-3 mb-3">
        <h5>Students</h5>
        {loading ? <div>Loading...</div> : (
          <table className="table table-sm">
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Email</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.first_name} {s.last_name}</td>
                  <td>{s.email}</td>
                  <td>
                    <button className="btn btn-sm btn-info me-1" onClick={()=>viewStudent(s.id)}>View</button>
                    <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(s.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <nav>
        <ul className="pagination">
          <li className={`page-item ${meta.page === 1 ? 'disabled':''}`}>
            <button className="page-link" onClick={()=>goToPage(meta.page-1)}>Previous</button>
          </li>
          {Array.from({length: meta.totalPages}).map((_, idx) => {
            const p = idx + 1;
            return (
              <li className={`page-item ${meta.page === p ? 'active':''}`} key={p}>
                <button className="page-link" onClick={()=>goToPage(p)}>{p}</button>
              </li>
            );
          })}
          <li className={`page-item ${meta.page === meta.totalPages ? 'disabled':''}`}>
            <button className="page-link" onClick={()=>goToPage(meta.page+1)}>Next</button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
