'use client';

import { useState, FormEvent } from 'react';

const EmailSignup = () => {
  const [email, setEmail] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms to continue');
      return;
    }

    // Simulate successful submission
    setSuccess(true);
    setEmail('');
    setAcceptTerms(false);

    // Reset success message after 3 seconds
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <section id="email" className="py-16 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Enter email for updates
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email for updates"
              className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-none text-white placeholder-gray-500 focus:outline-none focus:border-white/50 transition-colors duration-200"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="w-4 h-4 bg-white/5 border border-white/20 rounded text-white focus:ring-2 focus:ring-white/50"
            />
            <label htmlFor="terms" className="ml-3 text-sm text-gray-400">
              I accept the terms
            </label>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {success && (
            <div className="text-green-500 text-sm text-center">
              Thank you! You&apos;ve been added to our mailing list.
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default EmailSignup;

