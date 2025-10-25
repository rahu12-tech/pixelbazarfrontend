import axios from 'axios'
import React, { useEffect, useState } from 'react'

function AdminContact() {
  const [contactapi, setContactApi] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/contacts/");
        setContactApi(res.data.contacts || res.data || []);
      } catch (err) {
        console.error('Failed to fetch contacts:', err);
        setContactApi([]);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Contact Users</h1>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-blue-600">Loading contacts…</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && contactapi.length === 0 && (
        <div className="flex flex-col items-center justify-center h-60">
          <img
            src="https://img.freepik.com/free-vector/hand-drawn-no-data-illustration_23-2150696458.jpg?t=st=1757565089~exp=1757568689~hmac=eb2c06f1cb05bd294343df0a0745bc9fc9a646244ca0d3b85b3f840d9f1d1eef&w=2000"
            alt="No data"
            className="w-48 mb-4"
          />
          <p className="text-gray-500">No contacts found</p>
        </div>
      )}

      {/* Contacts list */}
      {!loading && contactapi.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contactapi.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow p-5 hover:shadow-lg transition"
            >
              <h2 className="text-sm text-gray-600"><strong>Name:</strong>{item.name}</h2>
              <p className="text-sm text-gray-600"><strong>Email:</strong> {item.email}</p>
              <p className="text-sm text-gray-600"><strong>Number:</strong> {item.number}</p>
              <p className="text-sm text-gray-600 mt-2">{item.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminContact
