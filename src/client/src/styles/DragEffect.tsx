export const AddLastElementEffect = (event: React.DragEvent) => {
  (event.target as HTMLLIElement).classList.replace(
    "bg-[#e0e0e0]",
    "bg-[#fff]"
  );
};

export const RemoveLastElementEffect = (event: React.DragEvent) => {
  (event.target as HTMLLIElement).classList.replace(
    "bg-[#fff]",
    "bg-[#e0e0e0]"
  );
};

export const AddDragEffect = (event: React.DragEvent) => {
  (event.target as HTMLLIElement).classList.replace("border-t-0", "border-t-4");
};

export const RemoveDragEffect = (event: React.DragEvent) => {
  (event.target as HTMLLIElement).classList.replace("border-t-4", "border-t-0");
};
