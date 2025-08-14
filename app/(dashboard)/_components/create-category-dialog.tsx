"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from "@/schema/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusSquare } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { EmojiPicker } from "@ferrucc-io/emoji-picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCategory } from "../_actions/categories";
import { Category } from "@prisma/client";
import { toast } from "sonner";

const CreateCategoryDialog = ({
  type,
  successCallback,
}: {
  type: TransactionType;
  successCallback: (category: Category) => void;
}) => {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: "",
      icon: "",
      type,
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCategory,
    onSuccess: async (data: Category) => {
      form.reset({
        name: "",
        icon: "",
        type,
      });

      toast.success(`Category ${data.name} created Successfully 🎉`, {
        id: "create-category",
      });

      successCallback(data);

      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      setOpen((prev) => !prev);
    },
    onError: () => {
      toast.error("Something went wrong", {
        id: "create-category",
      });
    },
  });

  const onSubmit = useCallback(
    (values: CreateCategorySchemaType) => {
      toast.loading("Creating Category...", {
        id: "create-category",
      });

      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="flex border-separate items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground"
        >
          <PlusSquare className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create{" "}
            <span
              className={cn(
                "m-1",
                type === "income" ? "text-emerald-500" : "text-red-500"
              )}
            >
              {type.toUpperCase()}
            </span>{" "}
            Category
          </DialogTitle>
          <DialogDescription>
            Categories are used to group your Transactions
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Category Name</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="h-[100px] w-full"
                        >
                          {form.watch("icon") ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-5xl" role="img">
                                {field.value}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Click to Change
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-5xl" role="img">
                                ⍉
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Click to Select
                              </p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full">
                        <EmojiPicker
                          onEmojiSelect={(emoji) => field.onChange(emoji)}
                        >
                          <EmojiPicker.Header>
                            <EmojiPicker.Input placeholder="Search emoji" />
                          </EmojiPicker.Header>
                          <EmojiPicker.Group>
                            <EmojiPicker.List />
                          </EmojiPicker.Group>
                        </EmojiPicker>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    This is how your category will appear in the app
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant={"secondary"}
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryDialog;
