import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { X, Upload, Trash2 } from "lucide-react";

const COURSES = [
  "ม.1-3", "ม.4-6", "สอบเข้า", "A-level", "IGCSE", "SAT Math",
  "AP Precalculus", "AP Calculus AB", "AP Calculus BC", "AP Statistics", "สอวน.คณิต ค่าย 1"
];

export default function Admin() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<"courses" | "resources">("courses");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceType, setResourceType] = useState<string>("sheet");
  const [resourceCourse, setResourceCourse] = useState("");
  const [resourceFile, setResourceFile] = useState<File | null>(null);
  const [isUploadingResource, setIsUploadingResource] = useState(false);

  // Queries
  const { data: courseImages, refetch: refetchImages } = trpc.courseImages.list.useQuery();
  const { data: resources, refetch: refetchResources } = trpc.resources.list.useQuery();

  // Mutations
  const uploadCourseImage = trpc.courseImages.upsert.useMutation();
  const deleteCourseImage = trpc.courseImages.delete.useMutation();
  const uploadResource = trpc.resources.create.useMutation();
  const deleteResource = trpc.resources.delete.useMutation();

  // Redirect if not admin
  if (!loading && (!user || user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ไม่มีสิทธิ์เข้าถึง</h1>
          <p className="text-gray-600">เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถเข้าถึงหน้านี้ได้</p>
        </div>
      </div>
    );
  }

  const handleUploadCourseImage = async () => {
    if (!selectedCourse || !imageFile) {
      toast.error("กรุณาเลือกคอร์สและรูปภาพ");
      return;
    }

    setIsUploadingImage(true);
    try {
      // In production, you would upload to S3 first and get the URL
      // For now, we'll use a placeholder approach
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUrl = e.target?.result as string;
        
        await uploadCourseImage.mutateAsync({
          courseLevel: selectedCourse,
          imageKey: `course-images/${selectedCourse}-${Date.now()}`,
          imageUrl: imageUrl,
          fileName: imageFile.name,
        });

        toast.success("อัพโหลดรูปภาพสำเร็จ");
        setSelectedCourse("");
        setImageFile(null);
        refetchImages();
      };
      reader.readAsDataURL(imageFile);
    } catch (error) {
      toast.error("อัพโหลดรูปภาพไม่สำเร็จ");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteCourseImage = async (id: number) => {
    if (!confirm("คุณแน่ใจหรือว่าต้องการลบรูปภาพนี้?")) return;

    try {
      await deleteCourseImage.mutateAsync({ id });
      toast.success("ลบรูปภาพสำเร็จ");
      refetchImages();
    } catch (error) {
      toast.error("ลบรูปภาพไม่สำเร็จ");
    }
  };

  const handleUploadResource = async () => {
    if (!resourceTitle || !resourceFile) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setIsUploadingResource(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileUrl = e.target?.result as string;
        
        await uploadResource.mutateAsync({
          title: resourceTitle,
          resourceType: resourceType as "sheet" | "exam" | "other",
          courseLevel: resourceCourse || undefined,
          fileKey: `resources/${resourceFile.name}-${Date.now()}`,
          fileUrl: fileUrl,
          fileName: resourceFile.name,
          fileSize: resourceFile.size,
        });

        toast.success("อัพโหลดไฟล์สำเร็จ");
        setResourceTitle("");
        setResourceType("sheet");
        setResourceCourse("");
        setResourceFile(null);
        refetchResources();
      };
      reader.readAsDataURL(resourceFile);
    } catch (error) {
      toast.error("อัพโหลดไฟล์ไม่สำเร็จ");
    } finally {
      setIsUploadingResource(false);
    }
  };

  const handleDeleteResource = async (id: number) => {
    if (!confirm("คุณแน่ใจหรือว่าต้องการลบไฟล์นี้?")) return;

    try {
      await deleteResource.mutateAsync({ id });
      toast.success("ลบไฟล์สำเร็จ");
      refetchResources();
    } catch (error) {
      toast.error("ลบไฟล์ไม่สำเร็จ");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">แผงควบคุมผู้ดูแล</h1>
          <p className="text-gray-600 mt-1">จัดการรูปภาพคอร์สและไฟล์แจกฟรี</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("courses")}
            className={`pb-3 px-4 font-medium transition ${
              activeTab === "courses"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            รูปภาพคอร์ส
          </button>
          <button
            onClick={() => setActiveTab("resources")}
            className={`pb-3 px-4 font-medium transition ${
              activeTab === "resources"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            ไฟล์แจกฟรี
          </button>
        </div>

        {/* Course Images Tab */}
        {activeTab === "courses" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>อัพโหลดรูปภาพคอร์ส</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">เลือกคอร์ส</label>
                  <Select value={selectedCourse} onValueChange={(v: string) => setSelectedCourse(v)}>
                    <SelectTrigger className="border border-gray-300">
                      <SelectValue placeholder="เลือกคอร์ส" />
                    </SelectTrigger>
                    <SelectContent>
                      {COURSES.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">เลือกรูปภาพ</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <Button
                  onClick={handleUploadCourseImage}
                  disabled={isUploadingImage || !selectedCourse || !imageFile}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploadingImage ? "กำลังอัพโหลด..." : "อัพโหลดรูปภาพ"}
                </Button>
              </CardContent>
            </Card>

            {/* Course Images List */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">รูปภาพคอร์สที่อัพโหลดแล้ว</h3>
              {courseImages && courseImages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courseImages.map((img) => (
                    <Card key={img.id} className="overflow-hidden">
                      <div className="aspect-video bg-gray-100 overflow-hidden">
                        <img
                          src={img.imageUrl}
                          alt={img.courseLevel}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <p className="font-bold text-gray-900 mb-2">{img.courseLevel}</p>
                        <p className="text-sm text-gray-600 mb-4">{img.fileName}</p>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCourseImage(img.id)}
                          className="w-full"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          ลบ
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">ยังไม่มีรูปภาพคอร์ส</p>
              )}
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === "resources" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>อัพโหลดไฟล์แจกฟรี</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อไฟล์</label>
                  <Input
                    value={resourceTitle}
                    onChange={(e) => setResourceTitle(e.target.value)}
                    placeholder="เช่น ชีทเรียน ม.1-3"
                    className="border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ประเภท</label>
                  <Select value={resourceType} onValueChange={(v: string) => setResourceType(v)}>
                    <SelectTrigger className="border border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sheet">ชีทเรียน</SelectItem>
                      <SelectItem value="exam">คลังข้อสอบ</SelectItem>
                      <SelectItem value="other">อื่นๆ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">คอร์ส (ไม่บังคับ)</label>
                  <Select value={resourceCourse} onValueChange={(v: string) => setResourceCourse(v)}>
                    <SelectTrigger className="border border-gray-300">
                      <SelectValue placeholder="เลือกคอร์ส" />
                    </SelectTrigger>
                    <SelectContent>
                      {COURSES.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">เลือกไฟล์</label>
                  <input
                    type="file"
                    onChange={(e) => setResourceFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <Button
                  onClick={handleUploadResource}
                  disabled={isUploadingResource || !resourceTitle || !resourceFile}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploadingResource ? "กำลังอัพโหลด..." : "อัพโหลดไฟล์"}
                </Button>
              </CardContent>
            </Card>

            {/* Resources List */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">ไฟล์ที่อัพโหลดแล้ว</h3>
              {resources && resources.length > 0 ? (
                <div className="space-y-2">
                  {resources.map((res) => (
                    <Card key={res.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">{res.title}</p>
                          <p className="text-sm text-gray-600">
                            {res.resourceType === "sheet" && "ชีทเรียน"}
                            {res.resourceType === "exam" && "คลังข้อสอบ"}
                            {res.resourceType === "other" && "อื่นๆ"}
                            {res.courseLevel && ` • ${res.courseLevel}`}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteResource(res.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">ยังไม่มีไฟล์แจกฟรี</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
