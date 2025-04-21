import React from 'react';
import config from '@/config';

export const metadata = {
  title: 'Terms of Service | ' + config.appName,
  description: 'Terms of Service for ' + config.appName,
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <p className="mb-4">
        We are currently updating our terms of service. Please check back later.
      </p>
      
      <p className="mb-4">
        If you have any questions regarding our terms, please contact us.
      </p>
    </div>
  );
} 