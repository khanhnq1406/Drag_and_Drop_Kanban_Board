export function findTaskToUpdate(data: any) {
  const tasksToUpdate: {}[] = [];
  // Iterate over all columns to check each task's current index
  data.columns.forEach((column: any) => {
    column.tasks.forEach((task: any, taskIndex: any) => {
      // Check if the real index (taskIndex) is different from the task.index
      if (task.index !== taskIndex) {
        tasksToUpdate.push({
          columnId: column.id, // Add column ID
          taskId: task.id, // Add task ID
          realIndex: taskIndex, // Add the real index of the task
        });
      }
    });
  });
  return tasksToUpdate;
}
