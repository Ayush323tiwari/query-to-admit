
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">About EduAdmit</h1>
            <p className="text-lg mb-6">
              Empowering students to achieve their academic and career goals through 
              quality education and personalized guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center">
                  To provide accessible, quality education that empowers individuals to reach their 
                  full potential and make meaningful contributions to society through innovative 
                  teaching methods and supportive learning environments.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center">
                  To be recognized as a leading educational institution that inspires lifelong 
                  learning, fosters critical thinking, and prepares students for success in a 
                  rapidly evolving global landscape.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Our History</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                  2005
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Foundation</h3>
                  <p className="text-muted-foreground">
                    EduAdmit was founded with a vision to revolutionize education access and 
                    quality for students from all backgrounds.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                  2010
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Expansion</h3>
                  <p className="text-muted-foreground">
                    The institution expanded its programs and facilities, introducing new 
                    courses in technology, business, and creative arts.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                  2015
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Digital Transformation</h3>
                  <p className="text-muted-foreground">
                    Integrated technology into all aspects of education and administration, 
                    launching online learning platforms and advanced student services.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                  2023
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Global Recognition</h3>
                  <p className="text-muted-foreground">
                    Achieved accreditation and recognition for academic excellence and 
                    innovative education methodologies, establishing global partnerships.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Our Leadership Team</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Dr. Sarah Johnson",
                role: "President",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&h=500&fit=crop&q=80"
              },
              {
                name: "Prof. Michael Chen",
                role: "Academic Director",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop&q=80"
              },
              {
                name: "Dr. Emily Williams",
                role: "Research Head",
                image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&h=500&fit=crop&q=80"
              },
              {
                name: "James Rodriguez",
                role: "Student Affairs",
                image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&h=500&fit=crop&q=80"
              }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Begin Your Journey With Us</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Take the first step toward a brighter future by exploring our programs or reaching out with your questions.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/courses">
              <Button variant="secondary" size="lg">
                Explore Programs
              </Button>
            </Link>
            <Link to="/enquiry">
              <Button variant="outline" size="lg" className="bg-transparent hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
