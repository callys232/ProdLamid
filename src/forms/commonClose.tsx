// forms/common.ts
import { User } from "@/types/user";

export interface BaseFormProps {
  closeModal: () => void;
  user: User | null;
}
