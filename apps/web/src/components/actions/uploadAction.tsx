"use server";

const uploadAction = (formData: FormData) => {
  formData.get("uploaded-file");
};

export default uploadAction;
