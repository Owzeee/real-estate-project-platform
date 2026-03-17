export type DeveloperProfileActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

export const developerProfileInitialState: DeveloperProfileActionState = {
  status: "idle",
  message: null,
};
