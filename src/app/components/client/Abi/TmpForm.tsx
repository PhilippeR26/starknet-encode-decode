"use client";
import { useForm } from "react-hook-form";
//import "./App.css";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface UserInput {
  fullName: string;
  food: string;
  approvesTutorial: boolean;
}

const defaultValues: UserInput = {
  fullName: "John Doe",
  food: "",
  approvesTutorial: true,
};

const validationSchema = yup.object({
  fullName: yup
    .string()
    .required("Full Name is required")
    .max(10, "Name is too long"),
  food: yup.string().required("Food is required"),
  approvesTutorial: yup
    .boolean()
    .isTrue("You must approve of this tutorial")
    .required("Approves tutorial is required"),
});

export default function TmpForm(){
  const {
    register,
    handleSubmit,
    formState: { errors }, // get errors of the form
  } = useForm<UserInput>({
    defaultValues,
    
    mode: "onTouched", // default is "onSubmit"
  });

  const onSubmitHandler = (values: UserInput) => {
    console.log(`Submitted`);
    console.table(values);
  };

  return (
    <main className="main prose">
      <h1>Forms</h1>

      <form onSubmit={handleSubmit(onSubmitHandler)} className="form">
        <div>
          <label htmlFor="fullName">Full Name</label>
          <input {...register("fullName")} id="fullName" type="text" />
          {errors.fullName && (
            <p className="error-message">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="food">Select Your Favorite Food!</label>
          <select {...register("food")} id="food">
            <option value="" disabled>
              Please Select...
            </option>
            <option value="pizza">Pizza</option>
            <option value="burger">Burger</option>
            <option value="ice-cream">Ice Cream</option>
          </select>
          {errors.food && (
            <p className="error-message">{errors.food.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("approvesTutorial")}
            id="approves-tutorial"
            type="checkbox"
          />
          <label htmlFor="approves-tutorial">
            Do you approve this tutorial?
          </label>
          {errors.approvesTutorial && (
            <p className="error-message">{errors.approvesTutorial.message}</p>
          )}
        </div>

        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
