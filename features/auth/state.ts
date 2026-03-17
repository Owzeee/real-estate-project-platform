export type AuthActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

export const authInitialState: AuthActionState = {
  status: "idle",
  message: null,
};
