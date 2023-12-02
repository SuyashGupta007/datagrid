// src/components/AdminDashboard.js

import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
      .then((response) => response.json())
      .then((data) => setUsers(data.map((user) => ({ ...user, isEditing: false }))));
  }, []);

  useEffect(() => {
    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filteredUsers);
  }, [searchTerm, users]);

  const rowsPerPage = 10;

  const handleEdit = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isEditing: true } : user
      )
    );
  };

  const handleSave = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isEditing: false } : user
      )
    );
  };

  const handleDelete = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  const handleDeleteSelected = () => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => !selectedRows.includes(user.id))
    );
    setSelectedRows([]);
  };

  const handleSelectAll = () => {
    const allRowIds = users
      .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
      .map((user) => user.id);
  
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.length === allRowIds.length) {
        // Deselect all rows
        return [];
      } else {
        // Select all rows on the current page
        return [...prevSelectedRows, ...allRowIds];
      }
    });
  };
  const handleCellValueChange = (userId, field, value) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, [field]: value } : user
      )
    );
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchIconClick = () => {
    alert(`Searching for: ${searchTerm}`);
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      alert(`Searching for: ${searchTerm}`);
    }
  };

  const createRow = (user) => (
    <tr key={user.id} className={`bg-white border-b hover:bg-gray-50 transition duration-300 ${selectedRows.includes(user.id) ? 'selected-row' : ''} ${user.isEditing ? 'editing-row' : ''}`}>
      <td>
        <input
          type="checkbox"
          checked={selectedRows.includes(user.id)}
          onChange={() => handleSelectRow(user.id)}
        />
      </td>
      <td>{user.id}</td>
      <td>{user.isEditing ? <input type="text" value={user.name} onChange={(e) => handleCellValueChange(user.id, 'name', e.target.value)} /> : user.name}</td>
      <td>{user.isEditing ? <input type="text" value={user.email} onChange={(e) => handleCellValueChange(user.id, 'email', e.target.value)} /> : user.email}</td>
      <td>{user.isEditing ? <input type="text" value={user.role} onChange={(e) => handleCellValueChange(user.id, 'role', e.target.value)} /> : user.role}</td>
      <td>
        {user.isEditing ? (
          <div>
            <button onClick={() => handleSave(user.id)}>Save</button>
            <button onClick={() => handleEdit(user.id)}>Cancel</button>
          </div>
        ) : (
          <div>
            <button onClick={() => handleEdit(user.id)}>Edit</button>
            <button className='delete-button' onClick={() => handleDelete(user.id)}>Delete</button>
          </div>
        )}
      </td>
    </tr>
  );

  const handleSelectRow = (userId) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(userId)) {
        return prevSelectedRows.filter((id) => id !== userId);
      } else {
        return [...prevSelectedRows, userId];
      }
    });
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredUsers.length / rowsPerPage)));
  };

  const goToLastPage = () => {
    setCurrentPage(Math.ceil(filteredUsers.length / rowsPerPage));
  };

  return (
    <div>
      <div>
        <div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            onKeyPress={handleEnterKeyPress}
          />
          <button className="search-icon" onClick={handleSearchIconClick}>
            Search
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                />
              </th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {searchTerm === '' ? (
              users
                .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                .map((user) => createRow(user))
            ) : (
              filteredUsers
                .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                .map((user) => createRow(user))
            )}
          </tbody>
        </table>

        <div className="pagination-container">
          <div className="pagination-buttons">
            <button onClick={() => goToPage(1)}>First</button>
            <button onClick={goToPreviousPage}>Previous</button>
            <span>{currentPage}</span>
            <button onClick={goToNextPage}>Next</button>
            <button onClick={goToLastPage}>Last</button>
          </div>
          <button className='delete-button' onClick={handleDeleteSelected}>Delete Selected</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
