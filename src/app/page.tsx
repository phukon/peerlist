'use client';

import FormBuilder from './components/FormBuilder';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Form Builder</h1>
        <FormBuilder />
      </div>
    </main>
  );
}
