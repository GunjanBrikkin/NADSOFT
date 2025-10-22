// client/src/components/StudentForm.jsx
import React, { useState } from 'react';
import API from '../api';
import Swal from 'sweetalert2';

const initialMark = { subject: '', marks: '', term: 'Midterm' };

export default function StudentForm({ onCreated }) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    dob: '',
    marks: [{ ...initialMark }]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMarkChange = (index, e) => {
    const { name, value } = e.target;
    const newMarks = [...form.marks];
    newMarks[index] = {
      ...newMarks[index],
      [name]: name === 'marks' ? parseInt(value) || '' : value
    };
    setForm(prev => ({
      ...prev,
      marks: newMarks
    }));
  };

  const addMark = () => {
    setForm(prev => ({
      ...prev,
      marks: [...prev.marks, { ...initialMark }]
    }));
  };

  const removeMark = (index) => {
    if (form.marks.length > 1) {
      const newMarks = form.marks.filter((_, i) => i !== index);
      setForm(prev => ({
        ...prev,
        marks: newMarks
      }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      // Filter out any empty mark entries
      const payload = {
        ...form,
        marks: form.marks.filter(mark => mark.subject && mark.marks && mark.term)
      };
      
      await API.post('/students', payload);
      Swal.fire('Success', 'Student created successfully', 'success');
      
      // Reset form
      setForm({
        first_name: '',
        last_name: '',
        email: '',
        dob: '',
        marks: [{ ...initialMark }]
      });
      
      if (onCreated) onCreated();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.error || err.message, 'error');
    }
  };

  return (
    <div className="card p-3 mb-4">
      <h4 className="mb-4 text-primary">Add New Student</h4>
      <form onSubmit={submit}>
        <div className="row mb-3">
          <div className="col-md-6 mb-3">
            <label className="form-label">First Name</label>
            <input 
              className="form-control" 
              name="first_name" 
              value={form.first_name} 
              onChange={handleChange} 
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Last Name</label>
            <input 
              className="form-control" 
              name="last_name" 
              value={form.last_name} 
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="row mb-3">
          <div className="col-md-6 mb-3">
            <label className="form-label">Email</label>
            <input 
              className="form-control" 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Date of Birth</label>
            <input 
              className="form-control" 
              type="date" 
              name="dob" 
              value={form.dob} 
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Marks Section */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Marks</h5>
            <button 
              type="button" 
              className="btn btn-sm btn-outline-primary"
              onClick={addMark}
            >
              + Add Subject
            </button>
          </div>
          
          {form.marks.map((mark, index) => (
            <div key={index} className="row g-2 mb-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label small">Subject</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Math, Science"
                  name="subject"
                  value={mark.subject}
                  onChange={(e) => handleMarkChange(index, e)}
                  required={index === 0}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small">Marks</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0-100"
                  name="marks"
                  min="0"
                  max="100"
                  value={mark.marks}
                  onChange={(e) => handleMarkChange(index, e)}
                  required={index === 0}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small">Term</label>
                <select
                  className="form-select"
                  name="term"
                  value={mark.term}
                  onChange={(e) => handleMarkChange(index, e)}
                  required
                >
                  <option value="Midterm">Midterm</option>
                  <option value="Final">Final</option>
                  <option value="Unit Test">Unit Test</option>
                </select>
              </div>
              <div className="col-md-2">
                {form.marks.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger w-100"
                    onClick={() => removeMark(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <button 
            type="submit" 
            className="btn btn-primary px-4"
          >
            Create Student
          </button>
        </div>
      </form>
    </div>
  );
}
