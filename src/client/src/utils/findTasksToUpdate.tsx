import { API_URL } from "../constants";

export function findTaskToUpdate(data: any) {
  const tasksToUpdate: {}[] = [];
  console.log(data);
  data.columns.forEach((column: any) => {
    column.tasks.forEach((task: any, taskIndex: any) => {
      if (task.index !== taskIndex || task.status !== column.id) {
        tasksToUpdate.push({
          columnId: column.id,
          taskId: task.id,
          realIndex: taskIndex,
        });
      }
    });
  });
  console.log(tasksToUpdate);
  fetch(`${API_URL}/updateTasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tasks: tasksToUpdate }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Tasks updated successfully:", data);
    })
    .catch((error) => {
      console.error("Error updating tasks:", error);
    });
  return tasksToUpdate;
}
