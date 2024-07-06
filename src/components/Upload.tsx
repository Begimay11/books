import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";

interface TodoType {
  name: string;
  format: string;
  url: string;
}
interface ImageType {
  images: [];
}
const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL;

const Upload = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const { register, handleSubmit } = useForm<ImageType>();

  const onSubmit: SubmitHandler<ImageType> = async (data) => {
    const files = data.images;
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    const { data: ResponseImages } = await axios.post(
      `${UPLOAD_URL}/upload/files`,
      formData
    );
    console.log(ResponseImages);

    setTodos(ResponseImages);
  };
  return (
    <div>
      <h1>MultiUpload</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="file"
          multiple
          {...register("images", { required: true })}
        />
        <button type="submit">Send</button>
      </form>
      {todos.map((el) => (
        <div>
          <h3>{el.name}</h3>
          <h5>{el.format}</h5>
          <img src={el.url} alt={el.name} />
        </div>
      ))}
    </div>
  );
};

export default Upload;

// multiple => type file bolgondorgo koldonulat, userge bir kancha znachenie tandai alysh uchun
// neskolko file juktoi alysh uchun
