"use client";

import CheckoutPage from "@/components/checkout-page";
import convertToSubCurrency from "@/lib/convertToSubCurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is undefined");
}
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface Task {
  id: number;
  text: string;
  completed: boolean;
  youtubeUrl?: string;
  amount: number;
}

export default function TaskPayment() {
  const { id } = useParams(); // Get task ID from URL

  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!id) return;

    const savedTasks: Task[] = JSON.parse(
      localStorage.getItem("tasks") || "[]"
    );
    // const foundTask = savedTasks.find((task) => task.id === Number(id));

    const taskId = id ? Number(id) : null;
    if (!taskId) return;
    const foundTask = savedTasks.find((task) => task.id === taskId);

    console.log("here is the task damn", foundTask);
    if (foundTask) {
      setTask(foundTask);
    }
  }, [id]);

  if (!task) {
    return <p>Task not found, yet.</p>;
  }

  return (
    <div className="flex w-full h-screen border mx-auto justify-center items-center">
      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubCurrency(+task?.amount), // in cents
          currency: "usd",
        }}
      >
        <CheckoutPage amount={task.amount} />
      </Elements>
    </div>
  );
}
