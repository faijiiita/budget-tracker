"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Currencies, Currency } from "@/lib/currencies";
import { useCallback, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import timezones, { TimeZone } from "timezones-list";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserSetting } from "@prisma/client";
import {
  UpdateUserCurrency,
  UpdateUserTimezone,
} from "@/app/wizard/_actions/userSettings";
import { toast } from "sonner";
import SkeletonWrapper from "./SkeletonWrapper";

const CurrencyComboBox = () => {
  const [openCurrency, setOpenCurrency] = useState(false);
  const [openTimezone, setOpenTimezone] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    null
  );
  const [selectedTimezone, setSelectedTimezone] = useState<TimeZone | null>(
    null
  );

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const userSettings = useQuery<UserSetting>({
    queryKey: ["userSettings"],
    queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
  });

  useEffect(() => {
    if (!userSettings.data) return;

    const userCurrency = Currencies.find(
      (currency) => currency.value === userSettings.data.currency
    );
    const userTimezone = timezones.find(
      (timezone) => timezone.label === userSettings.data.timezone
    );

    if (userCurrency) setSelectedCurrency(userCurrency);
    if (userTimezone) setSelectedTimezone(userTimezone);
  }, [userSettings.data]);

  const currencyMutation = useMutation({
    mutationFn: UpdateUserCurrency,
    onSuccess: (data: UserSetting) => {
      toast.success("Currency Updated Successfully 🎉", {
        id: "update-currency",
      });

      setSelectedCurrency(
        Currencies.find((c) => c.value === data.currency) || null
      );
    },

    onError: (e) => {
      toast.error(`Something went wrong => ${e.message}`, {
        id: "update-currency",
      });
    },
  });

  const timezoneMutation = useMutation({
    mutationFn: UpdateUserTimezone,
    onSuccess: (data: UserSetting) => {
      toast.success("Timezone updated Successfully 🎉", {
        id: "update-timezone",
      });

      setSelectedTimezone(
        timezones.find((t) => t.label === data.timezone) || null
      );
    },

    onError: (e) => {
      toast.error(`Something went wrong ${e.message}`, {
        id: "update-timezone",
      });
    },
  });

  const selectCurrency = useCallback(
    (value: Currency | null) => {
      if (!value) {
        toast.error("Please select a Currency");
        return;
      }

      toast.loading("Updating Currency...", {
        id: "update-currency",
      });

      currencyMutation.mutate(value.value);
    },
    [currencyMutation]
  );

  const selectTimezone = useCallback(
    (value: TimeZone | null) => {
      if (!value) {
        toast.error("Please select a Timezone");
        return;
      }

      toast.loading("Updating Timezone...", {
        id: "update-timezone",
      });

      timezoneMutation.mutate(value.label);
    },
    [timezoneMutation]
  );

  if (isDesktop) {
    return (
      <div className="flex flex-col items-center">
        <SkeletonWrapper isLoading={userSettings.isFetching}>
          <Popover open={openCurrency} onOpenChange={setOpenCurrency}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full justify-start"
                disabled={currencyMutation.isPending}
              >
                {selectedCurrency ? (
                  <>{selectedCurrency.label}</>
                ) : (
                  <>Set Currency</>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <StatusList
                setOpen={setOpenCurrency}
                setSelectedCurrency={selectCurrency}
              />
            </PopoverContent>
          </Popover>
        </SkeletonWrapper>

        <SkeletonWrapper isLoading={userSettings.isFetching}>
          <div className="w-full mt-2">
            <Popover open={openTimezone} onOpenChange={setOpenTimezone}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start"
                  disabled={timezoneMutation.isPending}
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
                  setOpen={setOpenTimezone}
                  setSelectedTimezone={selectTimezone}
                />
              </PopoverContent>
            </Popover>
          </div>
        </SkeletonWrapper>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <SkeletonWrapper isLoading={userSettings.isFetching}>
        <Drawer open={openCurrency} onOpenChange={setOpenCurrency}>
          <DrawerTrigger asChild>
            <Button
              variant={"outline"}
              className="w-full justify-start"
              disabled={currencyMutation.isPending}
            >
              {selectedCurrency ? (
                <>{selectedCurrency.label}</>
              ) : (
                <>Set Currency</>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle />
              <DrawerDescription />
            </DrawerHeader>
            <div className="mt-4 border-t">
              <StatusList
                setOpen={setOpenCurrency}
                setSelectedCurrency={selectCurrency}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={userSettings.isFetching}>
        <div className="w-full mt-2">
          <Drawer open={openTimezone} onOpenChange={setOpenTimezone}>
            <DrawerTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full justify-start"
                disabled={timezoneMutation.isPending}
              >
                {selectedTimezone ? (
                  <>{selectedTimezone.label}</>
                ) : (
                  <>Set Timezone</>
                )}
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle />
                <DrawerDescription />
              </DrawerHeader>
              <div className="mt-4 border-t">
                <TimezoneList
                  setOpen={setOpenTimezone}
                  setSelectedTimezone={selectTimezone}
                />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </SkeletonWrapper>
    </div>
  );
};

const StatusList = ({
  setOpen,
  setSelectedCurrency,
}: {
  setOpen: (open: boolean) => void;
  setSelectedCurrency: (currency: Currency | null) => void;
}) => {
  return (
    <Command>
      <CommandInput placeholder="Filter Currency..." />
      <CommandList>
        <CommandEmpty>No Results Found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currency: Currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setSelectedCurrency(
                  Currencies.find((priority) => priority.value === value) ||
                    null
                );
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

const TimezoneList = ({
  setOpen,
  setSelectedTimezone,
}: {
  setOpen: (open: boolean) => void;
  setSelectedTimezone: (timezone: TimeZone | null) => void;
}) => {
  return (
    <Command>
      <CommandInput placeholder="Filter Timezone..." />
      <CommandList>
        <CommandEmpty>No Result Found.</CommandEmpty>
        <CommandGroup>
          {timezones.map((timezone: TimeZone) => (
            <CommandItem
              key={timezone.tzCode}
              value={timezone.tzCode}
              onSelect={(value) => {
                setSelectedTimezone(
                  timezones.find((priority) => priority.tzCode === value) ||
                    null
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

export default CurrencyComboBox;
