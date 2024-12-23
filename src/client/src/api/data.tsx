import { TaskBoardType } from "../types/DragDrop.type";

const initialData: TaskBoardType = {
  columns: [
    {
      id: 1,
      index: 0,
      title: "To-do",
      tasks: [
        {
          id: 1,
          index: 0,
          content: {
            summary: "This is summary",
            description: "This is description",
            assignee: "Assignee Name",
          },
        },
        {
          id: 4,
          index: 2,
          content: {
            summary: "This is summary",
            description: "This is description",
            assignee: "Assignee Name",
          },
        },
      ],
    },
    {
      id: 2,
      index: 1,
      title: "In progress",
      tasks: [
        {
          id: 2,
          index: 0,
          content: {
            summary: "This is summary",
            description: "This is description",
            assignee: "Assignee Name",
          },
        },
        {
          id: 3,
          index: 1,
          content: {
            summary: "This is summary",
            description: "This is description",
            assignee: "Assignee Name",
          },
        },
      ],
    },
    {
      id: 3,
      index: 2,
      title: "Done",
      tasks: [],
    },
  ],
};

export default initialData;
