import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { createEnrollment, getAllEnrollments, getResources, createResource, deleteResource, upsertCourseImage, getCourseImage, getAllCourseImages, deleteCourseImage, getAllCourses, getCourseByLevel, upsertCourse, deleteCourse } from "./db";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  /**
   * Enrollment procedures
   */
  enrollments: router({
    /**
     * Submit a new enrollment application
     */
    submit: publicProcedure
      .input(
        z.object({
          firstName: z.string().min(1, "First name is required"),
          lastName: z.string().min(1, "Last name is required"),
          email: z.string().email("Invalid email address"),
          phone: z.string().min(1, "Phone number is required"),
          courseLevel: z.string().min(1, "Please select a course level"),
          lineId: z.string().optional(),
          paymentSlipUrl: z.string().optional(),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Create enrollment record
          const result = await createEnrollment({
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            phone: input.phone,
            courseLevel: input.courseLevel,
            lineId: input.lineId,
            paymentSlipUrl: input.paymentSlipUrl,
            message: input.message,
          });

          // Send notification to owner
          const studentName = `${input.firstName} ${input.lastName}`;
          const notificationContent = `
New student enrollment:
- Name: ${studentName}
- Email: ${input.email}
- Phone: ${input.phone}
- Course Level: ${input.courseLevel}
- LINE ID: ${input.lineId || "N/A"}
- Payment Slip: ${input.paymentSlipUrl ? "Attached" : "Not provided"}
- Message: ${input.message || "N/A"}
          `.trim();

          await notifyOwner({
            title: "New Student Enrollment - Point of Math",
            content: notificationContent,
          });

          return {
            success: true,
            message: "Enrollment submitted successfully! We will contact you soon via LINE.",
          };
        } catch (error) {
          console.error("Enrollment submission error:", error);
          throw new Error("Failed to submit enrollment. Please try again.");
        }
      }),

    /**
     * Get all enrollments (admin only)
     */
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return await getAllEnrollments();
    }),
  }),

  /**
   * Resources procedures (sheets, exam archives)
   */
  resources: router({
    /**
     * Get all resources, optionally filtered
     */
    list: publicProcedure
      .input(
        z.object({
          resourceType: z.enum(["sheet", "exam", "other"]).optional(),
          courseLevel: z.string().optional(),
        }).optional()
      )
      .query(async ({ input }) => {
        const resources = await getResources(input?.resourceType, input?.courseLevel);
        return resources;
      }),

    /**
     * Create a new resource (admin only)
     */
    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1, "Title is required"),
          description: z.string().optional(),
          resourceType: z.enum(["sheet", "exam", "other"]),
          courseLevel: z.string().optional(),
          fileKey: z.string().min(1, "File key is required"),
          fileUrl: z.string().url("Invalid file URL"),
          fileName: z.string().min(1, "File name is required"),
          fileSize: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const result = await createResource({
          title: input.title,
          description: input.description,
          resourceType: input.resourceType,
          courseLevel: input.courseLevel,
          fileKey: input.fileKey,
          fileUrl: input.fileUrl,
          fileName: input.fileName,
          fileSize: input.fileSize,
        });

        return {
          success: true,
          message: "Resource created successfully",
        };
      }),

    /**
     * Delete a resource (admin only)
     */
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        await deleteResource(input.id);

        return {
          success: true,
          message: "Resource deleted successfully",
        };
      }),
  }),

  courseImages: router({
    list: publicProcedure.query(async () => {
      return await getAllCourseImages();
    }),

    get: publicProcedure
      .input(z.object({ courseLevel: z.string() }))
      .query(async ({ input }) => {
        return await getCourseImage(input.courseLevel);
      }),

    upsert: protectedProcedure
      .input(
        z.object({
          courseLevel: z.string().min(1),
          imageKey: z.string().min(1),
          imageUrl: z.string().url(),
          fileName: z.string().min(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        await upsertCourseImage({
          courseLevel: input.courseLevel,
          imageKey: input.imageKey,
          imageUrl: input.imageUrl,
          fileName: input.fileName,
        });

        return { success: true, message: "Course image updated" };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        await deleteCourseImage(input.id);

        return { success: true, message: "Course image deleted" };
      }),
  }),

  courses: router({
    list: publicProcedure.query(async () => {
      return await getAllCourses();
    }),

    getByLevel: publicProcedure
      .input(z.object({ level: z.string() }))
      .query(async ({ input }) => {
        return await getCourseByLevel(input.level);
      }),

    create: protectedProcedure
      .input(
        z.object({
          level: z.string().min(1),
          description: z.string().min(1),
          price: z.string().min(1),
          category: z.string().min(1),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        await upsertCourse({
          level: input.level,
          description: input.description,
          price: input.price,
          category: input.category,
          displayOrder: input.displayOrder || 0,
          isActive: 1,
        });

        return { success: true, message: "Course created/updated" };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        await deleteCourse(input.id);

        return { success: true, message: "Course deleted" };
      }),
  }),
});

export type AppRouter = typeof appRouter;
