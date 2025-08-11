"use client";

import { useCallback, useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import timezones from "timezones-list";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserSettings } from "@prisma/client";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { UpdateUserTimezone } from "@/app/wizard/_actions/user-settings";
import { toast } from "sonner";

type Timezone = {
  label: string;
  name: string;
  tzCode: string;
  utc: string;
};

const TimezoneList = ({
  setOpen,
  setSelectedTimezone,
}: {
  setOpen: (open: boolean) => void;
  setSelectedTimezone: (timezone: Timezone | null) => void;
}) => {
  return (
    <Command>
      <CommandInput placeholder="Filter Timezone..." />
      <CommandList>
        <CommandEmpty>No Result Found.</CommandEmpty>
        <CommandGroup>
          {timezones.map((timezone) => (
            <CommandItem
              key={timezone.name}
              value={timezone.name}
              onSelect={(value) => {
                setSelectedTimezone(
                  timezones.find((tmz) => tmz.name === value) || null
                );
                setOpen(false);
              }}
            >
              {timezone.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

const TimezoneComboBox = () => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedTimezone, setSelectedTimezone] = useState<Timezone | null>(
    null
  );

  const userSettings = useQuery<UserSettings>({
    queryKey: ["userSettingsTimezone"],
    queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
  });

  useEffect(() => {
    if (!userSettings.data) return;

    const userTimezone = timezones.find(
      (tmz) => tmz.tzCode === userSettings.data.timezone
    );

    if (userTimezone) setSelectedTimezone(userTimezone);
  }, [userSettings.data]);

  const mutation = useMutation({
    mutationFn: UpdateUserTimezone,
    onSuccess: (data: UserSettings) => {
      toast.success(`Timezone updated successfully 🎉`, {
        id: "update-timezone",
      });

      setSelectedTimezone(
        timezones.find((c) => c.tzCode === data.timezone) || null
      );
    },
    onError: () => {
      toast.error("Something went wrong", {
        id: "update-timezone",
      });
    },
  });

  const selectOption = useCallback(
    (timezone: Timezone | null) => {
      if (!timezone) {
        toast.error("Please select a Timezone");
        return;
      }

      toast.loading("Updating timezone...", {
        id: "update-timezone",
      });

      mutation.mutate(timezone.tzCode);
    },
    [mutation]
  );

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userSettings.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled={mutation.isPending}
            >
              {selectedTimezone ? (
                <>{selectedTimezone.label}</>
              ) : (
                <>Set Timezone</>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <TimezoneList
              setOpen={setOpen}
              setSelectedTimezone={selectOption}
            />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isLoading={userSettings.isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled={mutation.isPending}
          >
            {selectedTimezone ? (
              <>{selectedTimezone.label}</>
            ) : (
              <>Set Timezone</>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerTitle />
          <DrawerDescription />
          <div className="mt-4 border-t">
            <TimezoneList
              setOpen={setOpen}
              setSelectedTimezone={selectOption}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
};

export default TimezoneComboBox;
