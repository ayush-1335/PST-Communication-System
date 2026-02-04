import React from 'react'
import { useAuth } from "../../context/AuthContext" 

function StudentDashboard() {

  const { user } = useAuth()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <h2 className="text-xl font-bold mb-4"> {user.firstName} , {user.lastName} , {user.role} </h2>
    </div>
  )
}

export default StudentDashboard