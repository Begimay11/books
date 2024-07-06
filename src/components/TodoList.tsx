import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import scss from "./TodoList.module.scss";

interface IFormInput {
  _id?: number;
  title: string;
  price: number;
  image: string;
  isLoading: boolean;
}
const VITE_PROD_BACK = import.meta.env.VITE_UPLOAD_URL;
const VITE_CRUD = import.meta.env.VITE_CRUD_URL;

const TodoList = () => {
  const [todos, setTodos] = useState<IFormInput[]>([]);
  const [isEdit, setIsEdit] = useState<number | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<IFormInput>();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { isSubmitting: isSubmittingEdit },
    setValue,
  } = useForm<IFormInput>();

  const onSubmitEdit: SubmitHandler<IFormInput> = async (data) => {
    const editFile = data.image[0];
    const newEdit = new FormData();
    newEdit.append("file", editFile);

    const { data: EditData } = await axios.post(
      `${VITE_PROD_BACK}/upload/file`,
      newEdit
    );

    const newEditTitle = {
      title: data.title,
      image: EditData.url,
    };

    const { data: Edit } = await axios.patch(
      `${VITE_CRUD}/${isEdit}`,
      newEditTitle
    );

    setTodos(Edit);
    setIsEdit(null);
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const file = data.image[0];
    const formData = new FormData();
    formData.append("file", file);
    reset();

    const { data: ResponseData } = await axios.post(
      `${VITE_PROD_BACK}/upload/file`,
      formData
    );

    const newProduct = {
      title: data.title,
      image: ResponseData.url,
      isLoading: false,
    };
    const { data: ResponseImage } = await axios.post(VITE_CRUD, newProduct);
    setTodos(ResponseImage);
  };

  const getImage = async () => {
    const { data } = await axios.get(VITE_CRUD);
    setTodos(data);
  };

  const deleteHandler = async (id: number) => {
    const { data } = await axios.delete(`${VITE_CRUD}/${id}`);
    setTodos(data);
  };

  const completeHandler = async (id: number, isLoading: boolean) => {
    const updateProduct = {
      isLoading: !isLoading,
    };

    const { data } = await axios.patch(`${VITE_CRUD}/${id}`, updateProduct);
    setTodos(data);
  };
  useEffect(() => {
    getImage();
  }, []);

  return (
    <div className={scss.TodoList}>
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register("title", { required: true })} />
        <input type="file" {...register("image", { required: true })} />
        <input type="number" {...register("price")} />
        {isSubmitting ? (
          <button type="button">Loading...</button>
        ) : (
          <button type="submit">Add</button>
        )}
      </form>
      <div className={scss.todos}>
        {todos.map((item) => (
          <div
            key={item._id}
            className={
              item.isLoading
                ? `${scss.content} ${scss.completed}`
                : `${scss.content}`
            }
          >
            {isEdit === item._id ? (
              <form onSubmit={handleSubmitEdit(onSubmitEdit)}>
                <input {...registerEdit("title", { required: true })} />
                <input type="file" {...registerEdit("image")} />
                {isSubmittingEdit ? (
                  <button type="button">Loading...</button>
                ) : (
                  <button type="submit">Save</button>
                )}
                <button type="button" onClick={() => setIsEdit(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <div>
                <h1>{item.title}</h1>
                <h2>{item.price}</h2>
                <img src={item.image} alt={item.title} />
                <button
                  onClick={() => completeHandler(item._id!, item.isLoading)}
                >
                  {item.isLoading ? `Ne Zaversheno` : `Complete`}
                </button>
                <button
                  onClick={() => {
                    setIsEdit(item._id!);
                    setValue("title", item.title);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => deleteHandler(item._id!)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;

// JSON formatta bolgondor obezatelno "" kavychka menen jazylat.
// JSON faildyn ichine object achylat, massiv emes

// post zapros jonotup atkanda, faildar jok, object ele bolso headers jazbaybyz dele, al emi faildar menen ishtep atsak, headers obezatelno jazylysh kerek
// al backendge aytat chto,fail kelet, kut depchi. birinchi backendge headers ketet, anan al korot, ozhudaet ot nas fail
// kartinkanyn ssylkasy ElchoCrudga berilet

// id emnege `${id}` dep berilip atat?
// file -> post -> ssylka?

// put zapros-> objectti polnosti, a patch objecttin ichindegi keylerge kayrylyp ozgortup beret

// birinchi ssylka, zaprostorgo
// ekinchi ssylka zagruzka faila

// setValue => useFormdan kelet, eki argument kabyl alat, key and value, izmenit bolgon knopkaga ele with callback function  writing
