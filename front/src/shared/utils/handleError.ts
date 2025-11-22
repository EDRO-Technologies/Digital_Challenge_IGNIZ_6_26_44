import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";

export const handleError = (error: unknown) => {
  if (error instanceof AxiosError) {
    notifications.show({
      title: "Произошла ошибка",
      message: error.response?.data.message
    });
  }
};
