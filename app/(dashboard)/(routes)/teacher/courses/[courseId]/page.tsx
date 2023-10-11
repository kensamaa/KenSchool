import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import CategoryForm from "./_components/categroy-form";
import AttachmentForm from "./_components/attachment-form";
import PriceForm from "./_components/price-form";
import ChaptersForm from "./_components/chapter-form";
const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth(); //extract the user id
  if (!userId) {
    //check if we have a user id
    return redirect("/");
  }
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId, //check if the user is the creatore of the course
    } /*,
        include: {
          chapters: {
            orderBy: {
              position: "asc",
            },
          },
          attachments: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },*/,
  });
  if (!course) {
    // check if theres is no courses
    return redirect("/");
  }
  //to ask for the missing  reauiered fields
  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    //course.chapters.some(chapter => chapter.isPublished),
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
