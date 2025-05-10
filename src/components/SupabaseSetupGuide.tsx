
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";

const SupabaseSetupGuide: React.FC = () => {
  return (
    <Card className="w-full max-w-4xl mx-auto my-8">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Supabase Setup Guide</CardTitle>
        <CardDescription>
          Follow these steps to configure Supabase for your application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Step 1: Create a Supabase Account</h3>
          <p>If you don't have a Supabase account, create one at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">supabase.com</a></p>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Step 2: Create a New Project</h3>
          <p>After signing in, create a new project from your Supabase dashboard.</p>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Step 3: Get Your API Keys</h3>
          <p>Go to Settings &gt; API in your Supabase project dashboard to find your:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><span className="font-mono bg-gray-100 px-1">URL</span> (Project URL)</li>
            <li><span className="font-mono bg-gray-100 px-1">anon</span> key (public API key)</li>
          </ul>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Step 4: Set Up Environment Variables</h3>
          <p>Create a <span className="font-mono bg-gray-100 px-1">.env</span> file in the root of your project with the following variables:</p>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
{`VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key`}
          </pre>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Step 5: Create Database Tables</h3>
          <p>Create the following tables in your Supabase database:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>users (id, name, email, role, avatar_url, phone, address)</li>
            <li>enquiries (id, studentId, studentName, email, contact, course, message, status, createdAt)</li>
            <li>enrollments (for enrollment data)</li>
            <li>payments (for payment data)</li>
            <li>courses (for course information)</li>
          </ul>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Step 6: Enable Authentication</h3>
          <p>Go to Authentication &gt; Providers in your Supabase dashboard and make sure Email provider is enabled.</p>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Step 7: Set Up Storage</h3>
          <p>Create a 'documents' bucket in Storage to store user files and documents.</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="outline" asChild>
          <a 
            href="https://supabase.com/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center"
          >
            Supabase Documentation
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SupabaseSetupGuide;
