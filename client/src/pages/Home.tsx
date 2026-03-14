import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Download, X } from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663436609142/CgvjRURmXSSK8LMnheshHL/pasted_file_eNVjMG_image_2ab1baf5.png";

const COURSE_CATEGORIES = [
  { id: "all", label: "ทั้งหมด" },
  { id: "junior-high", label: "ม.1-3" },
  { id: "senior-high", label: "ม.4-6" },
  { id: "entrance-exam", label: "สอบเข้า" },
  { id: "international", label: "ระดับนานาชาติ" },
  { id: "olympiad", label: "โอลิมปิก" },
];

const COURSES = [
  { level: "ม.1-3", description: "คณิตศาสตร์พื้นฐานสำหรับมัธยมต้น", price: "2,990", category: "junior-high" },
  { level: "ม.4-6", description: "คณิตศาสตร์ขั้นสูงสำหรับมัธยมปลาย", price: "3,490", category: "senior-high" },
  { level: "สอบเข้า", description: "เตรียมสอบเข้ามหาวิทยาลัย", price: "4,990", category: "entrance-exam" },
  { level: "A-level", description: "คณิตศาสตร์ A-level ระดับนานาชาติ", price: "3,990", category: "international" },
  { level: "IGCSE", description: "International General Certificate of Secondary Education", price: "3,990", category: "international" },
  { level: "SAT Math", description: "เตรียมสอบ SAT Mathematics", price: "4,490", category: "international" },
  { level: "AP Precalculus", description: "คอร์ส AP Precalculus", price: "3,990", category: "international" },
  { level: "AP Calculus AB", description: "คอร์ส AP Calculus AB", price: "4,490", category: "international" },
  { level: "AP Calculus BC", description: "คอร์ส AP Calculus BC", price: "4,990", category: "international" },
  { level: "AP Statistics", description: "คอร์ส AP Statistics", price: "3,990", category: "international" },
  { level: "สอวน.คณิต ค่าย 1", description: "เตรียมสอบคณิตศาสตร์โอลิมปิก - ค่าย 1", price: "5,990", category: "olympiad" },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCourseSelect = (value: string) => {
    setFormData(prev => ({ ...prev, courseLevel: value }));
    setSelectedCourse(value);
  };

  const handleOpenEnrollModal = (courseLevel?: string) => {
    if (courseLevel) {
      setFormData(prev => ({ ...prev, courseLevel }));
      setSelectedCourse(courseLevel);
    }
    setIsEnrollModalOpen(true);
  };

  const handleCloseEnrollModal = () => {
    setIsEnrollModalOpen(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      courseLevel: "",
      message: "",
    });
    setSelectedCourse("");
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
      handleCloseEnrollModal();
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
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={LOGO_URL} alt="Point of Math" className="w-8 h-8 object-contain" />
            <span className="font-bold text-lg text-gray-900">Point of Math</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#courses" className="text-gray-700 hover:text-blue-600 text-sm font-medium">คอร์ส</a>
            <a href="#instructor" className="text-gray-700 hover:text-blue-600 text-sm font-medium">ผู้สอน</a>
            <a href="#resources" className="text-gray-700 hover:text-blue-600 text-sm font-medium">ทรัพยากร</a>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              onClick={() => handleOpenEnrollModal()}
            >
              สมัครเรียน
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gray-500 text-sm mb-4 font-medium">POINT OF MATH</p>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                คณิตศาสตร์ไม่ยาก<br />
                <span className="text-blue-600">แค่ต้องเรียนอย่างถูกวิธี</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                สอนให้เข้าใจตั้งแต่พื้นฐาน ไม่ใช่ท่องจำสูตรลัด ผลลัพธ์จะตามมาเอง เรียนรู้จากอาจารย์ที่มีประสบการณ์ระดับชาติและนานาชาติ
              </p>
              <div className="flex gap-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base"
                  onClick={() => handleOpenEnrollModal()}
                >
                  สมัครเรียน
                </Button>
                <Button 
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-base"
                  onClick={handleLineContact}
                >
                  ติดต่อผ่าน LINE
                </Button>
              </div>
              <div className="mt-12 flex gap-12">
                <div>
                  <p className="text-3xl font-bold text-gray-900">11+</p>
                  <p className="text-gray-600 text-sm">คอร์สเรียน</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">4</p>
                  <p className="text-gray-600 text-sm">รางวัลระดับชาติ</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-xl aspect-square flex items-center justify-center overflow-hidden">
              <img src={LOGO_URL} alt="Point of Math Logo" className="w-2/3 h-2/3 object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Instructor Section */}
      <section id="instructor" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">ผู้สอน</h2>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">ธนวิชญ์ จันทร์ภูมิ</h3>
              <p className="text-blue-600 font-medium mb-6">อาจารย์สอนคณิตศาสตร์ & โค้ชโอลิมปิก</p>
              
              <div className="mb-8">
                <p className="text-gray-600 mb-4">สอนคณิตศาสตร์ตั้งแต่ชั้น ม.1-6 และเตรียมสอบโอลิมปิก</p>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>รางวัลที่ 3 - International Tournament of Young Mathematicians</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>เหรียญทองแดง - คณิตศาสตร์โอลิมปิกระดับชาติ ครั้งที่ 20</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>เหรียญทอง - AMC (American Mathematics Competition)</span>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>สอบติดจุฬาลงกรณ์มหาวิทยาลัย - สายวิทยาศาสตร์</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center h-96">
              <div className="text-center">
                <div className="text-6xl mb-2">ธ</div>
                <p className="text-gray-500 text-sm">รูปภาพผู้สอน</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">คอร์สเรียน</h2>
          <p className="text-lg text-gray-600 mb-12">เลือกคอร์สที่ตรงกับเป้าหมายของคุณ</p>
          
          {/* Filter */}
          <div className="mb-12 flex flex-wrap gap-3">
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

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.level} className="border border-gray-200 hover:border-blue-300 transition">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{course.level}</h3>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">{course.description}</p>
                  <div className="flex items-baseline justify-between mb-6">
                    <span className="text-3xl font-bold text-gray-900">฿{course.price}</span>
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleOpenEnrollModal(course.level)}
                  >
                    สมัครเรียน
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">ทรัพยากรฟรี</h2>
          <p className="text-lg text-gray-600 mb-12">ดาวน์โหลดชีทเรียนและคลังข้อสอบ</p>
          
          {resources && resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource) => (
                <Card key={resource.id} className="border border-gray-200">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {resource.resourceType === "sheet" && "ชีทเรียน"}
                      {resource.resourceType === "exam" && "คลังข้อสอบ"}
                      {resource.resourceType === "other" && "ทรัพยากร"}
                      {resource.courseLevel && ` • ${resource.courseLevel}`}
                    </p>
                    {resource.description && (
                      <p className="text-gray-600 mb-4 text-sm">{resource.description}</p>
                    )}
                    <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <Download className="w-4 h-4 mr-2" />
                        ดาวน์โหลด
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-600 mb-2">ทรัพยากรจะเพิ่มเร็วๆ นี้</p>
              <p className="text-gray-500 text-sm">ติดต่อเราผ่าน LINE เพื่อขอเอกสารเรียน</p>
            </div>
          )}
        </div>
      </section>

      {/* Enrollment Modal */}
      <Dialog open={isEnrollModalOpen} onOpenChange={setIsEnrollModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>สมัครเรียน</DialogTitle>
            <DialogClose className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </DialogClose>
          </DialogHeader>

          <form onSubmit={handleSubmitEnrollment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">นามสกุล *</label>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์ *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">เลือกระดับคอร์ส *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">ข้อความ (ไม่บังคับ)</label>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                placeholder="บอกเราเกี่ยวกับพื้นฐานคณิตศาสตร์หรือเป้าหมายของคุณ..."
                className="border border-gray-300 resize-none"
                rows={3}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 text-base"
            >
              {isSubmitting ? "กำลังส่ง..." : "ยืนยันสมัครเรียน"}
            </Button>
          </form>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-gray-800">
            <p><span className="font-medium">ขั้นตอนถัดไป:</span> หลังจากส่งใบสมัคร เราจะติดต่อคุณผ่าน LINE เพื่อยืนยันการสมัครเรียน</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8 pb-8 border-b border-gray-800">
            <div>
              <h3 className="text-white font-bold mb-4">Point of Math</h3>
              <p className="text-sm leading-relaxed">การศึกษาคณิตศาสตร์ที่มีคุณภาพสำหรับทุกระดับ</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">ติดต่อ</h3>
              <p className="text-sm mb-2">อีเมล: pointofmathcontacts@gmail.com</p>
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
