// src/app/app.routes.ts or src/app/routes.ts

export function getPrerenderParams() {
  const courseIds = ['1', '2', '3']; // Replace with actual IDs or API fetch

  const courseDetailRoutes = courseIds.map(id => ({
    route: `courses/${id}`,
    params: { id }
  }));

  const courseLessonsRoutes = courseIds.map(courseId => ({
    route: `courses/${courseId}/lessons`,
    params: { courseId }
  }));

  return [...courseDetailRoutes, ...courseLessonsRoutes];
}

