import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '../components/ui/Common';
import { CheckCircle2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      {/* Left Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-600 text-white text-2xl font-bold mb-6 shadow-lg shadow-brand-500/40">
              L
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              {isRegister ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-slate-500">
              {isRegister ? 'Start your learning journey today.' : 'Please enter your details to sign in.'}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {isRegister && (
                 <Input label="Full Name" type="text" placeholder="John Doe" required />
              )}
              <Input label="Email address" type="email" placeholder="john@example.com" required />
              <Input label="Password" type="password" placeholder="••••••••" required />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                  Remember me
                </label>
              </div>
              {!isRegister && (
                <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-500">
                  Forgot password?
                </a>
              )}
            </div>

            <Button type="submit" variant="primary" className="w-full py-3" isLoading={isLoading}>
              {isRegister ? 'Sign up' : 'Sign in'}
            </Button>
            
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-slate-50 text-slate-500">Or continue with</span></div>
            </div>

             <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="outline" className="w-full">Google</Button>
                <Button type="button" variant="outline" className="w-full">GitHub</Button>
             </div>
          </form>

          <p className="text-center text-sm text-slate-600">
            {isRegister ? 'Already have an account?' : 'Don\'t have an account?'}
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="ml-1 font-semibold text-brand-600 hover:text-brand-500 focus:outline-none focus:underline"
            >
              {isRegister ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Brand Visual */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-indigo-900 opacity-90 z-10"></div>
        <img 
            src="https://picsum.photos/1000/1000?grayscale" 
            alt="Learning Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
        <div className="relative z-20 max-w-lg px-8 text-center text-white">
            <h1 className="text-4xl font-bold mb-6 leading-tight">Master New Skills with AI-Powered Roadmaps</h1>
            <p className="text-lg text-indigo-100 mb-8 leading-relaxed">
                Join thousands of developers and designers accelerating their careers with Lumina's adaptive learning paths.
            </p>
            <div className="space-y-4">
                 {[
                    "Interactive coding environments",
                    "Real-time AI interview practice",
                    "Personalized career roadmaps"
                 ].map((item, idx) => (
                    <div key={idx} className="flex items-center text-indigo-200">
                        <CheckCircle2 className="w-5 h-5 mr-3 text-emerald-400" />
                        <span>{item}</span>
                    </div>
                 ))}
            </div>
        </div>
        {/* Decorative Circles */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>
    </div>
  );
};

export default Login;
