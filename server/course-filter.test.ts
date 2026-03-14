import { describe, expect, it } from "vitest";

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

function filterCourses(courses: typeof COURSES, category: string) {
  if (category === "all") {
    return courses;
  }
  return courses.filter(course => course.category === category);
}

describe("Course Filter", () => {
  it("should return all courses when 'all' category is selected", () => {
    const result = filterCourses(COURSES, "all");
    expect(result).toHaveLength(11);
    expect(result).toEqual(COURSES);
  });

  it("should filter courses by junior-high category", () => {
    const result = filterCourses(COURSES, "junior-high");
    expect(result).toHaveLength(1);
    expect(result[0]?.level).toBe("ม.1-3");
    expect(result[0]?.category).toBe("junior-high");
  });

  it("should filter courses by senior-high category", () => {
    const result = filterCourses(COURSES, "senior-high");
    expect(result).toHaveLength(1);
    expect(result[0]?.level).toBe("ม.4-6");
    expect(result[0]?.category).toBe("senior-high");
  });

  it("should filter courses by entrance-exam category", () => {
    const result = filterCourses(COURSES, "entrance-exam");
    expect(result).toHaveLength(1);
    expect(result[0]?.level).toBe("สอบเข้า");
    expect(result[0]?.category).toBe("entrance-exam");
  });

  it("should filter courses by international category", () => {
    const result = filterCourses(COURSES, "international");
    expect(result).toHaveLength(7);
    expect(result.every(course => course.category === "international")).toBe(true);
  });

  it("should filter courses by olympiad category", () => {
    const result = filterCourses(COURSES, "olympiad");
    expect(result).toHaveLength(1);
    expect(result[0]?.level).toBe("สอวน.คณิต ค่าย 1");
    expect(result[0]?.category).toBe("olympiad");
  });

  it("should return empty array for non-existent category", () => {
    const result = filterCourses(COURSES, "non-existent");
    expect(result).toHaveLength(0);
  });

  it("should have all course categories defined", () => {
    const categoryIds = COURSE_CATEGORIES.map(cat => cat.id);
    expect(categoryIds).toContain("all");
    expect(categoryIds).toContain("junior-high");
    expect(categoryIds).toContain("senior-high");
    expect(categoryIds).toContain("entrance-exam");
    expect(categoryIds).toContain("international");
    expect(categoryIds).toContain("olympiad");
  });

  it("should have all courses assigned to a valid category", () => {
    const validCategories = COURSE_CATEGORIES.filter(cat => cat.id !== "all").map(cat => cat.id);
    COURSES.forEach(course => {
      expect(validCategories).toContain(course.category);
    });
  });
});
