
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCourses } from "@/lib/mockData";

const CoursesPage = () => {
  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Our Programs</h1>
        <p className="text-center text-muted-foreground mb-12">
          Discover the perfect program to advance your career and achieve your goals
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCourses.map((course) => (
            <Card key={course.id} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{course.name}</CardTitle>
                    <CardDescription>
                      Duration: {course.duration}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">Popular</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="mb-6">{course.shortDescription}</p>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Tuition Fee</span>
                    <span className="font-bold">${course.fee}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Application Fee</span>
                    <span className="font-medium">$50</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-3">
                <Link to="/enquiry" className="flex-1">
                  <Button variant="outline" className="w-full">Enquire</Button>
                </Link>
                <Link to="/enrollment" className="flex-1">
                  <Button className="w-full">Apply Now</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center space-y-4">
          <h2 className="text-2xl font-bold">Need Help Choosing?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Our education counselors are here to help you select the right program based on your career goals and interests.
          </p>
          <Link to="/enquiry">
            <Button size="lg">Get Personalized Guidance</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
