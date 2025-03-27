// src/components/EmailVerificationNotice.jsx
import React from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MailCheck, AlertCircle } from 'lucide-react';
import { Button } from '@mui/material';

export default function EmailVerificationNotice({ email }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto text-center p-8"
    >
      <div className="inline-block p-4 bg-blue-50 rounded-full mb-6">
        <MailCheck className="w-12 h-12 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Verify Your Email Address</h2>
      <p className="text-gray-600 mb-6">
        We've sent a verification link to <span className="font-semibold">{email}</span>.
        Please check your inbox and click the link to activate your account.
      </p>
      <div className="space-y-4">
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          className="!rounded-xl !px-6"
        >
          I've Verified My Email
        </Button>
        <p className="text-sm text-gray-500">
          Didn't receive the email?{' '}
          <button className="text-blue-600 font-medium">Resend Verification</button>
        </p>
      </div>
    </motion.div>
  );
}