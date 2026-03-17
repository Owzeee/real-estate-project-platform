export type ProjectActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

export const createProjectInitialState: ProjectActionState = {
  status: "idle",
  message: null,
};
