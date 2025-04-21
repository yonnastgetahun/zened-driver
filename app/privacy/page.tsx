import React from 'react';
import config from '@/config';

export const metadata = {
  title: 'Privacy Policy | ' + config.appName,
  description: 'Privacy Policy for ' + config.appName,
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <p className="mb-4">
        We are currently updating our privacy policy. Please check back later.
      </p>
      
      <p className="mb-4">
        If you have any questions regarding our data practices, please contact us.
      </p>
    </div>
  );
} 