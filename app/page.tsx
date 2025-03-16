"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import Link from "next/link";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  youtubeUrl?: string;
  amount: number | string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [amount, setAmount] = useState<number | string>(0);

  useEffect(() => {
    const savedTasks: Task[] = JSON.parse(
      localStorage.getItem("tasks") || "[]"
    );
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (): void => {
    if (!newTask.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now(), text: newTask, completed: false, youtubeUrl, amount },
    ]);
    setNewTask("");
    setYoutubeUrl("");
    setAmount(0);
  };

  const toggleComplete = (id: number): void => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number): void => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <main>
      <div className="max-w-2xl mx-auto mt-10 p-4">
        <h1 className="italics flex text-center w-full items-center text-black font-bold">
          Ustacky Take home
        </h1>
        <div className="flex flex-col gap-2">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
          />
          <Input
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="Add YouTube video URL (optional)"
          />
          <Input
            type="number"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value ? parseFloat(e.target.value) : "")
            }
            placeholder="Enter amount"
          />
          <Button onClick={addTask}>Create to-do</Button>
        </div>
        <div className="w-full mt-6 space-y-2">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className="flex flex-col gap-2 w-full items-start justify-between px-5"
            >
              <CardTitle>
                <span
                  className={`cursor-pointer ${
                    task.completed ? "line-through text-gray-400" : ""
                  }`}
                  onClick={() => toggleComplete(task.id)}
                >
                  {task.text}
                </span>
              </CardTitle>
              <div className="flex items-center w-full justify-between gap-4">
                {task.youtubeUrl && (
                  <CardContent className="flex-1 px-0 rounded-md border-gray-100 cursor-pointer">
                    <Card className="mt-2 p-0 px-0 border w-[300px] bg-gray-100">
                      <iframe
                        width="100%"
                        height="200"
                        src={task.youtubeUrl.replace("watch?v=", "embed/")}
                        title="YouTube Video"
                        allowFullScreen
                      ></iframe>
                    </Card>
                  </CardContent>
                )}
                <div className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="w-max p-2"
                  >
                    Delete
                    <Trash2 className="w-4 h-4 ml-2" />
                  </Button>
                  <Link href={`/task-payment/${task.id}`}>
                    <Button className="bg-blue-500 text-white">
                      Pay ${task.amount}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
        }}
      ></Elements> */}
    </main>
  );
}
