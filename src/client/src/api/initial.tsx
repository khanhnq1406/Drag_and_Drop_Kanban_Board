import { API_URL } from "../constants";
import { ColumnType, TaskType } from "../types/DragDrop.type";

export const Initial = async () => {
  const fetchResult = await fetch(`${API_URL}/initial`);
  const json = await fetchResult.json();
  const data = json.data.data;
  const initial = data.status
    .map((status: any) => {
      return {
        id: status.id,
        index: status.status_index,
        title: status.title,
        tasks: data.tasks
          .map((task: any) => {
            if (status.id === task.status_id) {
              return {
                id: task.id,
                index: task.task_index,
                content: {
                  summary: task.summary,
                  description: task.description,
                  assignee: task.assignee,
                },
              };
            }
            return;
          })
          .filter(Boolean),
      };
    })
    .filter(Boolean);
  return { columns: initial };
};
