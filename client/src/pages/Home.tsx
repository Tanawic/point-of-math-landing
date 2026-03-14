import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { ChevronDown, Download, Play, Award, BookOpen, Users, Mail } from "lucide-react";
import { Streamdown } from "streamdown";

const COURSES = [
  { level: "ม.1-3", description: "Foundation mathematics for junior high school", price: "Contact for pricing" },
  { level: "ม.4-6", description: "Advanced mathematics for senior high school", price: "Contact for pricing" },
  { level: "สอบเข้า", description: "University entrance exam preparation", price: "Contact for pricing" },
  { level: "A-level", description: "International A-level mathematics", price: "Contact for pricing" },
  { level: "IGCSE", description: "International General Certificate of Secondary Education", price: "Contact for pricing" },
  { level: "SAT Math", description: "SAT mathematics preparation", price: "Contact for pricing" },
  { level: "AP Precalculus", description: "AP Precalculus course", price: "Contact for pricing" },
  { level: "AP Calculus AB", description: "AP Calculus AB course", price: "Contact for pricing" },
  { level: "AP Calculus BC", description: "AP Calculus BC course", price: "Contact for pricing" },
  { level: "AP Statistics", description: "AP Statistics course", price: "Contact for pricing" },
  { level: "สอวน.คณิต ค่าย 1", description: "Math Olympiad preparation - Camp 1", price: "Contact for pricing" },
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

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">Point of Math</div>
          <div className="flex gap-6">
            <a href="#courses" className="text-gray-700 hover:text-blue-600 transition">Courses</a>
            <a href="#instructor" className="text-gray-700 hover:text-blue-600 transition">Instructor</a>
            <a href="#resources" className="text-gray-700 hover:text-blue-600 transition">Resources</a>
            <a href="#enroll" className="text-gray-700 hover:text-blue-600 transition">Enroll</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="text-5xl font-bold text-blue-600">M</div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Point of Math</h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">Master Mathematics with Expert Guidance</p>
          <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
            Comprehensive mathematics education from junior high through advanced international curricula. 
            Learn from an award-winning instructor with proven track record in olympiad and entrance exams.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => document.getElementById("enroll")?.scrollIntoView({ behavior: "smooth" })}
            >
              Enroll Now
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900"
              onClick={handleLineContact}
            >
              Contact via LINE
            </Button>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center text-gray-900">Our Courses</h2>
          <p className="text-center text-gray-600 mb-12">
            We offer comprehensive courses tailored to different educational levels and goals
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.map((course) => (
              <Card key={course.level} className="border border-gray-200 hover:shadow-lg transition">
                <CardHeader>
                  <CardTitle className="text-blue-600">{course.level}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{course.price}</p>
                  <Button 
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
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
        </div>
      </section>

      {/* Instructor Section */}
      <section id="instructor" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">Meet Your Instructor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-12 text-center">
                <div className="w-32 h-32 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-5xl font-bold text-white">T</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{INSTRUCTOR.name}</h3>
                <p className="text-blue-600 font-semibold">{INSTRUCTOR.title}</p>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Experience</h3>
              <p className="text-gray-600 mb-6">{INSTRUCTOR.experience}</p>
              
              <h3 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                <Award className="w-6 h-6 text-blue-600" />
                Achievements
              </h3>
              <ul className="space-y-3">
                {INSTRUCTOR.achievements.map((achievement, idx) => (
                  <li key={idx} className="flex gap-3 text-gray-700">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center text-gray-900 flex items-center justify-center gap-2">
            <Play className="w-8 h-8 text-blue-600" />
            Free Lessons on YouTube
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Watch our free mathematics lessons and tutorials
          </p>
          <div className="aspect-video max-w-3xl mx-auto rounded-lg overflow-hidden shadow-lg">
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
          <p className="text-center text-gray-600 mt-6 text-sm">
            Check the video description for accompanying study sheets and materials
          </p>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center text-gray-900 flex items-center justify-center gap-2">
            <Download className="w-8 h-8 text-blue-600" />
            Free Resources
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Download free study sheets and exam archives
          </p>
          
          {resources && resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource) => (
                <Card key={resource.id} className="border border-gray-200 hover:shadow-lg transition">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <CardDescription>
                          {resource.resourceType === "sheet" && "📄 Study Sheet"}
                          {resource.resourceType === "exam" && "📝 Exam Archive"}
                          {resource.resourceType === "other" && "📚 Resource"}
                          {resource.courseLevel && ` • ${resource.courseLevel}`}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {resource.description && (
                      <p className="text-gray-600 mb-4 text-sm">{resource.description}</p>
                    )}
                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button 
                        variant="outline"
                        className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
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
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Resources coming soon! Check back later.</p>
              <p className="text-gray-400 text-sm">Contact us via LINE for study materials in the meantime.</p>
            </div>
          )}
        </div>
      </section>

      {/* Enrollment Form Section */}
      <section id="enroll" className="py-16 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center text-gray-900">Enroll Now</h2>
          <p className="text-center text-gray-600 mb-12">
            Fill out the form below to start your mathematics journey with us
          </p>

          <Card className="border border-gray-200">
            <CardContent className="pt-6">
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
                      className="border-gray-300"
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
                      className="border-gray-300"
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
                    className="border-gray-300"
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
                    className="border-gray-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Course Level *
                  </label>
                  <Select value={selectedCourse} onValueChange={handleCourseSelect}>
                    <SelectTrigger className="border-gray-300">
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
                    className="border-gray-300 resize-none"
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
                >
                  {isSubmitting ? "Submitting..." : "Submit Enrollment"}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Next Step:</span> After submitting, we'll contact you via LINE to confirm your enrollment and discuss course details.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* LINE Contact CTA */}
      <section className="py-12 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
          <p className="text-lg mb-8 text-blue-100">
            Connect with us directly on LINE for instant support and course inquiries
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
            onClick={handleLineContact}
          >
            Contact us on LINE @210krawo
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
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
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 Point of Math. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
