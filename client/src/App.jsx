// client/src/App.jsx
import React from 'react';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';

export default function App() {
  return (
    <div className="container py-4">
      <h1 className="mb-4">NADSOFT — Student Management</h1>
      <div className="row">
        <div className="col-md-5">
          <StudentForm />
        </div>
        <div className="col-md-7">
          <StudentList />
        </div>
      </div>
    </div>
  )
}
