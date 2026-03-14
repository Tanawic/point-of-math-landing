import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { ChevronRight, Download, Play, Award, BookOpen, Mail } from "lucide-react";

const COURSE_CATEGORIES = [
  { id: "all", label: "All Courses" },
  { id: "junior-high", label: "Junior High (ม.1-3)" },
  { id: "senior-high", label: "Senior High (ม.4-6)" },
  { id: "entrance-exam", label: "Entrance Exams" },
  { id: "international", label: "International" },
  { id: "olympiad", label: "Olympiad" },
];

const COURSES = [
  { level: "ม.1-3", description: "Foundation mathematics for junior high school", price: "2,990", category: "junior-high" },
  { level: "ม.4-6", description: "Advanced mathematics for senior high school", price: "3,490", category: "senior-high" },
  { level: "สอบเข้า", description: "University entrance exam preparation", price: "4,990", category: "entrance-exam" },
  { level: "A-level", description: "International A-level mathematics", price: "3,990", category: "international" },
  { level: "IGCSE", description: "International General Certificate of Secondary Education", price: "3,990", category: "international" },
  { level: "SAT Math", description: "SAT mathematics preparation", price: "4,490", category: "international" },
  { level: "AP Precalculus", description: "AP Precalculus course", price: "3,990", category: "international" },
  { level: "AP Calculus AB", description: "AP Calculus AB course", price: "4,490", category: "international" },
  { level: "AP Calculus BC", description: "AP Calculus BC course", price: "4,990", category: "international" },
  { level: "AP Statistics", description: "AP Statistics course", price: "3,990", category: "international" },
  { level: "สอวน.คณิต ค่าย 1", description: "Math Olympiad preparation - Camp 1", price: "5,990", category: "olympiad" },
];

const INSTRUCTOR = {
  name: "Tanawich Junpoom",
  title: "Mathematics Instructor & Olympiad Coach",
  experience: "Teaching mathematics from Grade 7-12 and Olympiad preparation",
  achievements: [
    "Third Prize - International Tournament of Young Mathematicians",
    "Bronze Medal - National Mathematics Olympiad (20th edition)",
    "Gold Medal - AMC (American Mathematics Competition) KVIS | Chula",
    "Passed entrance exam to Chulalongkorn University - Science Program",
  ],
};

const YOUTUBE_VIDEO_ID = "7nvjrgqKjJE";

export default function Home() {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    courseLevel: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitEnrollment = trpc.enrollments.submit.useMutation();
  const { data: resources } = trpc.resources.list.useQuery({});

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCourseSelect = (value: string) => {
    setFormData(prev => ({ ...prev, courseLevel: value }));
    setSelectedCourse(value);
  };

  const handleSubmitEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.courseLevel) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitEnrollment.mutateAsync(formData);
      toast.success("Enrollment submitted! We'll contact you via LINE soon.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        courseLevel: "",
        message: "",
      });
      setSelectedCourse("");
    } catch (error) {
      toast.error("Failed to submit enrollment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLineContact = () => {
    window.open("https://line.me/R/ti/p/@210krawo", "_blank");
  };

  const filteredCourses = selectedCategory === "all" 
    ? COURSES 
    : COURSES.filter(course => course.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
              M
            </div>
            <div className="text-xl font-bold text-gray-900">Point of Math</div>
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#courses" className="text-gray-700 hover:text-blue-600 text-sm font-medium">Courses</a>
            <a href="#instructor" className="text-gray-700 hover:text-blue-600 text-sm font-medium">Instructor</a>
            <a href="#resources" className="text-gray-700 hover:text-blue-600 text-sm font-medium">Resources</a>
            <a href="#enroll" className="text-gray-700 hover:text-blue-600 text-sm font-medium">Enroll</a>
          </div>
          <Button 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleLineContact}
          >
            Contact
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Point of Math
              </h1>
              <p className="text-xl text-gray-600 mb-4 leading-relaxed">
                Master mathematics with expert guidance from an award-winning instructor. Comprehensive courses from junior high through advanced international curricula.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Learn from Tanawich Junpoom, a proven educator with international olympiad medals and strong track record in entrance exam preparation.
              </p>
              <div className="flex gap-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                  onClick={() => document.getElementById("enroll")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Enroll Now
                </Button>
                <Button 
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3"
                  onClick={handleLineContact}
                >
                  Contact via LINE
                </Button>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-gray-400 mb-4">M</div>
                <p className="text-gray-500 text-sm">Logo/Image placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section with Filter */}
      <section id="courses" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Courses</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Comprehensive mathematics courses tailored to different educational levels and goals
          </p>
          
          {/* Filter Tabs */}
          <div className="mb-12 flex flex-wrap gap-2">
            {COURSE_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:border-blue-400"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Course Count */}
          <p className="text-gray-600 mb-6 text-sm">
            Showing {filteredCourses.length} of {COURSES.length} courses
          </p>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.level} className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-900">{course.level}</CardTitle>
                  <CardDescription className="text-gray-600">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between mb-6">
                    <span className="text-2xl font-bold text-gray-900">฿{course.price}</span>
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, courseLevel: course.level }));
                      document.getElementById("enroll")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No courses found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Instructor Section */}
      <section id="instructor" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Instructor</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-gray-400 mb-4">T</div>
                  <p className="text-gray-500 text-sm">Photo placeholder</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{INSTRUCTOR.name}</h3>
              <p className="text-blue-600 font-medium mb-4">{INSTRUCTOR.title}</p>
              <p className="text-gray-600">{INSTRUCTOR.experience}</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Achievements & Awards</h3>
              <ul className="space-y-4">
                {INSTRUCTOR.achievements.map((achievement, idx) => (
                  <li key={idx} className="flex gap-4 text-gray-700">
                    <span className="text-blue-600 font-bold flex-shrink-0">•</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Free Lessons</h2>
          <p className="text-gray-600 mb-12 text-lg">
            Watch our free mathematics lessons on YouTube
          </p>
          
          <div className="aspect-video rounded-lg overflow-hidden border border-gray-200">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
              title="Point of Math - Free Lesson"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p className="text-gray-600 mt-6 text-sm">
            Check the video description for accompanying study sheets and materials
          </p>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Free Resources</h2>
          <p className="text-gray-600 mb-12 text-lg">
            Download study sheets and exam archives
          </p>
          
          {resources && resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource) => (
                <Card key={resource.id} className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription>
                      {resource.resourceType === "sheet" && "Study Sheet"}
                      {resource.resourceType === "exam" && "Exam Archive"}
                      {resource.resourceType === "other" && "Resource"}
                      {resource.courseLevel && ` • ${resource.courseLevel}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {resource.description && (
                      <p className="text-gray-600 mb-4 text-sm">{resource.description}</p>
                    )}
                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full"
                    >
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-600 mb-2">Resources coming soon</p>
              <p className="text-gray-500 text-sm">Contact us via LINE for study materials</p>
            </div>
          )}
        </div>
      </section>

      {/* Enrollment Form Section */}
      <section id="enroll" className="py-20 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Enroll Now</h2>
          <p className="text-gray-600 mb-12 text-lg">
            Fill out the form to start your mathematics journey with us
          </p>

          <Card className="border border-gray-200">
            <CardContent className="pt-8">
              <form onSubmit={handleSubmitEnrollment} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <Input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleFormChange}
                      placeholder="John"
                      className="border border-gray-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <Input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleFormChange}
                      placeholder="Doe"
                      className="border border-gray-300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="john@example.com"
                    className="border border-gray-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="+66 8XXXX-XXXX"
                    className="border border-gray-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Course Level *
                  </label>
                  <Select value={selectedCourse} onValueChange={handleCourseSelect}>
                    <SelectTrigger className="border border-gray-300">
                      <SelectValue placeholder="Choose a course level" />
                    </SelectTrigger>
                    <SelectContent>
                      {COURSES.map((course) => (
                        <SelectItem key={course.level} value={course.level}>
                          {course.level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    placeholder="Tell us about your mathematics background or goals..."
                    className="border border-gray-300 resize-none"
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                >
                  {isSubmitting ? "Submitting..." : "Submit Enrollment"}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-800">
                  <span className="font-medium">Next Step:</span> After submitting, we'll contact you via LINE to confirm your enrollment.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-gray-800">
            <div>
              <h3 className="text-white font-bold mb-4">Point of Math</h3>
              <p className="text-sm">Expert mathematics education for all levels</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Contact</h3>
              <p className="text-sm">Email: pointofmathcontacts@gmail.com</p>
              <p className="text-sm">LINE: @210krawo</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Quick Links</h3>
              <ul className="text-sm space-y-2">
                <li><a href="#courses" className="hover:text-white transition">Courses</a></li>
                <li><a href="#instructor" className="hover:text-white transition">Instructor</a></li>
                <li><a href="#resources" className="hover:text-white transition">Resources</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm">
            <p>&copy; 2026 Point of Math. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
