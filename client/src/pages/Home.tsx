import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { ChevronDown, Download, Play, Award, BookOpen, Users, Mail, Star, TrendingUp, Zap } from "lucide-react";
import { Streamdown } from "streamdown";

const COURSES = [
  { level: "ม.1-3", description: "Foundation mathematics for junior high school", price: "2,990", originalPrice: "3,990" },
  { level: "ม.4-6", description: "Advanced mathematics for senior high school", price: "3,490", originalPrice: "4,990" },
  { level: "สอบเข้า", description: "University entrance exam preparation", price: "4,990", originalPrice: "6,990" },
  { level: "A-level", description: "International A-level mathematics", price: "3,990", originalPrice: "5,490" },
  { level: "IGCSE", description: "International General Certificate of Secondary Education", price: "3,990", originalPrice: "5,490" },
  { level: "SAT Math", description: "SAT mathematics preparation", price: "4,490", originalPrice: "6,490" },
  { level: "AP Precalculus", description: "AP Precalculus course", price: "3,990", originalPrice: "5,490" },
  { level: "AP Calculus AB", description: "AP Calculus AB course", price: "4,490", originalPrice: "6,490" },
  { level: "AP Calculus BC", description: "AP Calculus BC course", price: "4,990", originalPrice: "6,990" },
  { level: "AP Statistics", description: "AP Statistics course", price: "3,990", originalPrice: "5,490" },
  { level: "สอวน.คณิต ค่าย 1", description: "Math Olympiad preparation - Camp 1", price: "5,990", originalPrice: "8,490" },
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

const TESTIMONIALS = [
  { name: "นักเรียน ม.4", feedback: "เข้าใจเนื้อหาได้ดีขึ้นมาก สอนอย่างละเอียด", rating: 5 },
  { name: "นักเรียน ม.5", feedback: "ได้เกรด 4 ครั้งแรก ขอบคุณครูมากค่ะ", rating: 5 },
  { name: "นักเรียน ม.6", feedback: "ติดสอบเข้ามหาวิทยาลัยสำเร็จ", rating: 5 },
];

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

  const getDiscountPercentage = (level: string) => {
    const course = COURSES.find(c => c.level === level);
    if (!course) return 0;
    const original = parseFloat(course.originalPrice.replace(/,/g, ""));
    const current = parseFloat(course.price.replace(/,/g, ""));
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
              M
            </div>
            <div className="text-2xl font-bold text-blue-600">Point of Math</div>
          </div>
          <div className="hidden md:flex gap-6">
            <a href="#courses" className="text-gray-700 hover:text-blue-600 transition font-medium">Courses</a>
            <a href="#instructor" className="text-gray-700 hover:text-blue-600 transition font-medium">Instructor</a>
            <a href="#resources" className="text-gray-700 hover:text-blue-600 transition font-medium">Resources</a>
            <a href="#enroll" className="text-gray-700 hover:text-blue-600 transition font-medium">Enroll</a>
          </div>
        </div>
      </nav>

      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 text-center">
        <p className="font-bold text-lg">🎉 ลดราคา 20-25% สำหรับคอร์สเรียน | สมัครครบ 2 คอร์สขึ้นไป ลด 10% / 3 คอร์ส ลด 20%</p>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20 px-4 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full opacity-20 -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full opacity-20 -ml-48 -mb-48"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition duration-300">
              <div className="text-7xl font-bold text-blue-600">M</div>
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-4 drop-shadow-lg">Point of Math</h1>
          <p className="text-2xl md:text-3xl text-blue-100 mb-4 font-semibold">Master Mathematics with Expert Guidance</p>
          <p className="text-lg md:text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Comprehensive mathematics education from junior high through advanced international curricula. 
            Learn from an award-winning instructor with proven track record in olympiad and entrance exams.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-lg px-8 py-6 shadow-lg transform hover:scale-105 transition"
              onClick={() => document.getElementById("enroll")?.scrollIntoView({ behavior: "smooth" })}
            >
              ✨ Enroll Now
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 font-bold text-lg px-8 py-6 shadow-lg transform hover:scale-105 transition"
              onClick={handleLineContact}
            >
              💬 Contact via LINE
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">11+</div>
            <p className="text-lg">Course Levels</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">500+</div>
            <p className="text-lg">Students Taught</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">4</div>
            <p className="text-lg">International Awards</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">100%</div>
            <p className="text-lg">Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold mb-4 text-center text-gray-900">📚 Our Courses</h2>
          <p className="text-center text-gray-600 mb-16 text-lg">
            Comprehensive courses tailored to different educational levels and goals
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.map((course) => {
              const discount = getDiscountPercentage(course.level);
              return (
                <Card key={course.level} className="border-2 border-gray-200 hover:shadow-2xl hover:border-blue-400 transition transform hover:-translate-y-2 duration-300 overflow-hidden group">
                  {discount > 0 && (
                    <div className="bg-red-500 text-white py-2 px-4 text-center font-bold text-lg">
                      🔥 ลด {discount}%
                    </div>
                  )}
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                    <CardTitle className="text-2xl text-blue-600">{course.level}</CardTitle>
                    <CardDescription className="text-gray-700">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-bold text-blue-600">฿{course.price}</span>
                        <span className="text-lg text-gray-400 line-through">฿{course.originalPrice}</span>
                      </div>
                      <p className="text-sm text-gray-500">ราคาพิเศษ สมัครเรียนวันนี้</p>
                    </div>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 transform group-hover:scale-105 transition"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, courseLevel: course.level }));
                        document.getElementById("enroll")?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      Learn More →
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Instructor Section */}
      <section id="instructor" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold mb-16 text-center text-gray-900">👨‍🏫 Meet Your Instructor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl transform rotate-3 opacity-20"></div>
              <div className="relative bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-12 text-center shadow-xl">
                <div className="w-40 h-40 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full mx-auto mb-8 flex items-center justify-center shadow-lg">
                  <span className="text-7xl font-bold text-white">T</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{INSTRUCTOR.name}</h3>
                <p className="text-blue-600 font-bold text-lg mb-2">{INSTRUCTOR.title}</p>
                <p className="text-gray-600">{INSTRUCTOR.experience}</p>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <Award className="w-8 h-8 text-yellow-500" />
                Achievements & Awards
              </h3>
              <ul className="space-y-4">
                {INSTRUCTOR.achievements.map((achievement, idx) => (
                  <li key={idx} className="flex gap-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600 hover:bg-blue-100 transition">
                    <span className="text-2xl">🏆</span>
                    <span className="text-gray-700 font-medium">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold mb-16 text-center text-gray-900">⭐ Student Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, idx) => (
              <Card key={idx} className="border-2 border-yellow-300 bg-white shadow-lg hover:shadow-2xl transition">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.feedback}"</p>
                  <p className="font-bold text-gray-900">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold mb-4 text-center text-gray-900 flex items-center justify-center gap-3">
            <Play className="w-10 h-10 text-red-600" />
            Free Lessons on YouTube
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg">
            Watch our free mathematics lessons and tutorials
          </p>
          <div className="aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-blue-600">
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
          <p className="text-center text-gray-600 mt-8 text-lg">
            📝 Check the video description for accompanying study sheets and materials
          </p>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold mb-4 text-center text-gray-900 flex items-center justify-center gap-3">
            <Download className="w-10 h-10 text-green-600" />
            Free Resources
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg">
            Download free study sheets and exam archives
          </p>
          
          {resources && resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource) => (
                <Card key={resource.id} className="border-2 border-green-300 hover:shadow-lg transition transform hover:-translate-y-1">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{resource.title}</CardTitle>
                        <CardDescription>
                          {resource.resourceType === "sheet" && "📄 Study Sheet"}
                          {resource.resourceType === "exam" && "📝 Exam Archive"}
                          {resource.resourceType === "other" && "📚 Resource"}
                          {resource.courseLevel && ` • ${resource.courseLevel}`}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
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
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Now
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-blue-50 rounded-2xl border-2 border-dashed border-blue-300">
              <p className="text-gray-600 mb-4 text-lg">📦 Resources coming soon! Check back later.</p>
              <p className="text-gray-500">Contact us via LINE for study materials in the meantime.</p>
            </div>
          )}
        </div>
      </section>

      {/* Enrollment Form Section */}
      <section id="enroll" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-5xl font-bold mb-4 text-center text-gray-900">🚀 Enroll Now</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Fill out the form below to start your mathematics journey with us
          </p>

          <Card className="border-4 border-blue-600 shadow-2xl">
            <CardContent className="pt-8">
              <form onSubmit={handleSubmitEnrollment} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <Input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleFormChange}
                      placeholder="John"
                      className="border-2 border-gray-300 focus:border-blue-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <Input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleFormChange}
                      placeholder="Doe"
                      className="border-2 border-gray-300 focus:border-blue-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="john@example.com"
                    className="border-2 border-gray-300 focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="+66 8XXXX-XXXX"
                    className="border-2 border-gray-300 focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Select Course Level *
                  </label>
                  <Select value={selectedCourse} onValueChange={handleCourseSelect}>
                    <SelectTrigger className="border-2 border-gray-300 focus:border-blue-600">
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    placeholder="Tell us about your mathematics background or goals..."
                    className="border-2 border-gray-300 focus:border-blue-600 resize-none"
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 text-lg shadow-lg transform hover:scale-105 transition"
                >
                  {isSubmitting ? "Submitting..." : "✨ Submit Enrollment"}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-green-100 rounded-lg border-2 border-green-500">
                <p className="text-sm text-gray-800">
                  <span className="font-bold">✅ Next Step:</span> After submitting, we'll contact you via LINE to confirm your enrollment and discuss course details.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* LINE Contact CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-500 via-blue-500 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">💬 Have Questions?</h2>
          <p className="text-xl mb-8 text-blue-50">
            Connect with us directly on LINE for instant support and course inquiries
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg px-8 py-6 shadow-lg transform hover:scale-110 transition"
            onClick={handleLineContact}
          >
            📱 Contact us on LINE @210krawo
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4 text-lg">Point of Math</h3>
              <p className="text-sm">Expert mathematics education for all levels</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4 text-lg">Contact</h3>
              <p className="text-sm">Email: pointofmathcontacts@gmail.com</p>
              <p className="text-sm">LINE: @210krawo</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4 text-lg">Quick Links</h3>
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
