export const AddLastColumnEffect = (event: React.DragEvent) => {
  (event.target as HTMLLIElement).classList.replace(
    "bg-[#e0e0e0]",
    "bg-column"
  );
};

export const RemoveLastColumnEffect = (event: React.DragEvent) => {
  (event.target as HTMLLIElement).classList.replace(
    "bg-column",
    "bg-[#e0e0e0]"
  );
};

export const AddDragColumnEffect = (event: React.DragEvent) => {
  (event.target as HTMLLIElement).classList.replace("border-r-0", "border-r-4");
};

export const RemoveDragColumnEffect = (event: React.DragEvent) => {
  (event.target as HTMLLIElement).classList.replace("border-r-4", "border-r-0");
};
