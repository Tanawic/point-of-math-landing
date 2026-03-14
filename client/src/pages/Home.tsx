import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { ChevronRight, Download, Play, Award, BookOpen, Mail } from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663436609142/CgvjRURmXSSK8LMnheshHL/pasted_file_eNVjMG_image_2ab1baf5.png";

const COURSE_CATEGORIES = [
  { id: "all", label: "ทั้งหมด" },
  { id: "junior-high", label: "มัธยมต้น (ม.1-3)" },
  { id: "senior-high", label: "มัธยมปลาย (ม.4-6)" },
  { id: "entrance-exam", label: "ตะลุยโจทย์สอบเข้า" },
  { id: "international", label: "International Mathematics" },
  { id: "olympiad", label: "โอลิมปิก" },
];

const COURSES = [
  { level: "ม.1-3", description: "ตะลุยโจทย์คณิตศาสตร์มัธยมต้น", price: "1,990", category: "junior-high" },
  { level: "ม.4-6", description: "ตะลุยโจทย์คณิตศาสตร์มัธยมปลาย", price: "2,490", category: "senior-high" },
  { level: "สอบเข้า", description: "ตะลุยโจทย์สอบเข้ามหาวิทยาลัย", price: "2,990", category: "entrance-exam" },
  { level: "IGCSE", description: "International General Certificate of Secondary Education", price: "3,990", category: "international" },
  { level: "SAT Math", description: "SAT Mathe", price: "1,490", category: "international" },
  { level: "AP Precalculus", description: "AP Precalculus", price: "1,990", category: "international" },
  { level: "AP Calculus AB", description: "AP Calculus AB", price: "1,490", category: "international" },
  { level: "AP Calculus BC", description: "AP Calculus BC", price: "1,990", category: "international" },
  { level: "AP Statistics", description: "AP Statistics", price: "1,990", category: "international" },
  { level: "สอวน.คณิต ค่าย 1", description: "เตรียมสอบสอวน.คณิตค่าย 1", price: "2,990", category: "olympiad" },
];

const INSTRUCTOR = {
  name: "Tanawich Junpoom",
  experience: "ประสบการณ์สอนมากกว่า 3 ปี และได้รับรางวัลระดับชาติและนานาชาติในคณิตศาสตร์",
  achievements: [
    "สอบติดตัวจริงกำเนิดวิทย์",
    "รางวัลที่ 3 - International Tournament of Young Mathematicians",
    "เหรียญทองแดง - คณิตศาสตร์โอลิมปิกระดับชาติ ครั้งที่ 20",
    "เหรียญทอง - AMC (American Mathematics Competition) ",
    "ชนะเลิศอันดับ 1 - ESAN Math Top Ten ระดับชั้นม.ปลาย 2ปีซ้อน",
    "และรางวัลอื่นๆ อีกมากมายในระดับประเทศและนานาชาติ"
  ],
};

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
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitEnrollment.mutateAsync(formData);
      toast.success("ส่งใบสมัครเรียบร้อย! เราจะติดต่อคุณผ่าน LINE ในเร็วๆ นี้");
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
      toast.error("ส่งใบสมัครไม่สำเร็จ กรุณาลองใหม่");
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
            <img src={LOGO_URL} alt="Point of Math Logo" className="w-10 h-10 object-contain" />
            <div className="text-xl font-bold text-gray-900">Point of Math</div>
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#courses" className="text-gray-700 hover:text-blue-600 text-sm font-medium">คอร์ส</a>
            <a href="#instructor" className="text-gray-700 hover:text-blue-600 text-sm font-medium">ผู้สอน</a>
            <a href="#resources" className="text-gray-700 hover:text-blue-600 text-sm font-medium">ทรัพยากร</a>
            <a href="#enroll" className="text-gray-700 hover:text-blue-600 text-sm font-medium">สมัครเรียน</a>
          </div>
          <Button 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleLineContact}
          >
            ติดต่อ
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
                เรียนคณิตศาสตร์กับรุ่นพี่ที่มีประสบการณ์การแข่งขันระดับชาติและนานาชาติ
              </p>
              <div className="flex gap-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                  onClick={() => document.getElementById("enroll")?.scrollIntoView({ behavior: "smooth" })}
                >
                  สมัครเรียนเลย
                </Button>
                <Button 
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3"
                  onClick={handleLineContact}
                >
                  ติดต่อผ่าน LINE
                </Button>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
              <img src={LOGO_URL} alt="Point of Math Logo" className="w-3/4 h-3/4 object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section with Filter */}
      <section id="courses" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">คอร์สของเรา</h2>
          <p className="text-gray-600 mb-8 text-lg">
            เจาะลึกคณิตศาสตร์ให้ตรงจุด ตอบโจทย์การเรียนในทุกระดับ
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
            แสดง {filteredCourses.length} จาก {COURSES.length} คอร์ส
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
                    ดูรายละเอียด
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">ไม่พบคอร์สในหมวดหมู่นี้</p>
            </div>
          )}
        </div>
      </section>

      {/* Instructor Section */}
      <section id="instructor" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">ผู้สอน</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-gray-400 mb-4">ธ</div>
                  <p className="text-gray-500 text-sm">รูปภาพผู้สอน</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{INSTRUCTOR.name}</h3>
              <p className="text-gray-600">{INSTRUCTOR.experience}</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">ผลงานและรางวัล</h3>
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

      {/* YouTube Section - Coming Soon */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">บทเรียนฟรี</h2>
          <p className="text-gray-600 mb-12 text-lg">
            ชมบทเรียนคณิตศาสตร์ฟรีบน YouTube
          </p>
          
          <div className="aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Coming Soon</h3>
              <p className="text-gray-600">บทเรียนวิดีโอจะเพิ่มเร็วๆ นี้</p>
              <p className="text-gray-500 text-sm mt-4">ติดตามข้อมูลล่าสุดผ่าน LINE @210krawo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">แหล่งข้อสอบและชีทเรียนฟรี</h2>
          <p className="text-gray-600 mb-12 text-lg">
            ดาวน์โหลดชีทเรียนและคลังข้อสอบ
          </p>
          
          {resources && resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource) => (
                <Card key={resource.id} className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription>
                      {resource.resourceType === "sheet" && "ชีทเรียน"}
                      {resource.resourceType === "exam" && "คลังข้อสอบ"}
                      {resource.resourceType === "other" && "ทรัพยากร"}
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
                        ดาวน์โหลด
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-600 mb-2">ทรัพยากรจะเพิ่มเร็วๆ นี้</p>
              <p className="text-gray-500 text-sm">ติดต่อเราผ่าน LINE เพื่อสอบถามข้อมูลเพิ่มเติม</p>
            </div>
          )}
        </div>
      </section>

      {/* Enrollment Form Section */}
      <section id="enroll" className="py-20 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">สมัครเรียนเลย</h2>
          <p className="text-gray-600 mb-12 text-lg">
            กรอกแบบฟอร์มเพื่อเริ่มต้นการเรียนคณิตศาสตร์กับเรา
          </p>

          <Card className="border border-gray-200">
            <CardContent className="pt-8">
              <form onSubmit={handleSubmitEnrollment} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ชื่อ *
                    </label>
                    <Input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleFormChange}
                      placeholder="ชื่อ"
                      className="border border-gray-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      นามสกุล *
                    </label>
                    <Input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleFormChange}
                      placeholder="นามสกุล"
                      className="border border-gray-300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    อีเมล *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="your@email.com"
                    className="border border-gray-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เบอร์โทรศัพท์ *
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="08XXXX-XXXX"
                    className="border border-gray-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เลือกระดับคอร์ส *
                  </label>
                  <Select value={selectedCourse} onValueChange={handleCourseSelect}>
                    <SelectTrigger className="border border-gray-300">
                      <SelectValue placeholder="เลือกระดับคอร์ส" />
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
                    ข้อความ (ไม่บังคับ)
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    placeholder="บอกเราเกี่ยวกับพื้นฐานคณิตศาสตร์หรือเป้าหมายของคุณ..."
                    className="border border-gray-300 resize-none"
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                >
                  {isSubmitting ? "กำลังส่ง..." : "ส่งใบสมัคร"}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-800">
                  <span className="font-medium">ขั้นตอนถัดไป:</span> หลังจากส่งใบสมัคร เราจะติดต่อคุณผ่าน LINE เพื่อยืนยันการสมัครเรียน
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
              <p className="text-sm">การศึกษาคณิตศาสตร์ที่มีคุณภาพสำหรับทุกระดับ</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">ติดต่อ</h3>
              <p className="text-sm">อีเมล: pointofmathcontacts@gmail.com</p>
              <p className="text-sm">LINE: @210krawo</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">ลิงก์ด่วน</h3>
              <ul className="text-sm space-y-2">
                <li><a href="#courses" className="hover:text-white transition">คอร์ส</a></li>
                <li><a href="#instructor" className="hover:text-white transition">ผู้สอน</a></li>
                <li><a href="#resources" className="hover:text-white transition">ทรัพยากร</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm">
            <p>&copy; 2026 Point of Math. สงวนลิขสิทธิ์ทั้งหมด</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
