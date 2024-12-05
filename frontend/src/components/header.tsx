import React from 'react';

export const Header: React.FC = () => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">Q&A Management</h1>
      <p className="mt-2 text-sm text-gray-500">
        Manage and track your GDPR compliance questions and answers
      </p>
    </div>
  );
};