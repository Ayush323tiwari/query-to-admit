
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { mockCourses } from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Start Your Educational Journey Today
              </h1>
              <p className="text-lg mb-8">
                Join our institution to accelerate your career with quality education,
                experienced faculty, and a supportive learning environment.
              </p>
              <div className="flex gap-4">
                <Link to="/courses">
                  <Button size="lg" variant="secondary">
                    Explore Courses
                  </Button>
                </Link>
                <Link to="/enquiry">
                  <Button size="lg" variant="outline" className="bg-transparent hover:bg-white/10">
                    Make an Enquiry
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop"
                alt="Students studying"
                className="rounded-lg shadow-lg max-w-md w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">Featured Courses</h2>
          <p className="text-center text-muted-foreground mb-10">
            Discover our most popular programs
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockCourses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle>{course.name}</CardTitle>
                  <CardDescription>
                    Duration: {course.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{course.shortDescription}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="font-semibold">${course.fee}</p>
                  <Link to="/enquiry">
                    <Button variant="outline">Enquire</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-10">
            <Link to="/courses">
              <Button>View All Courses</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">Why Choose Us</h2>
          <p className="text-center text-muted-foreground mb-10">
            What makes our institution stand out
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Education</h3>
              <p className="text-muted-foreground">
                Our curriculum is designed by industry experts to ensure you receive relevant and up-to-date knowledge.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Experienced Faculty</h3>
              <p className="text-muted-foreground">
                Learn from professors with extensive academic and industry experience who are dedicated to your success.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Career Support</h3>
              <p className="text-muted-foreground">
                Get placement assistance, career counseling, and networking opportunities with industry leaders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Begin Your Educational Journey?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Take the first step toward your future career by enrolling in one of our programs or making an enquiry today.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {user ? (
              <Link to="/dashboard">
                <Button variant="secondary" size="lg">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="secondary" size="lg">
                    Register Now
                  </Button>
                </Link>
                <Link to="/enquiry">
                  <Button variant="outline" size="lg" className="bg-transparent hover:bg-white/10">
                    Make an Enquiry
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
