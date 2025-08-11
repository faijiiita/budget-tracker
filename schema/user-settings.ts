import timezones from "timezones-list";
import { currencies } from "@/lib/constants";
import { z } from "zod";

export const UpdateCurrencySchema = z.object({
  currency: z.custom((value) => {
    const found = currencies.some((c) => c.value === value);
    if (!found) {
      throw new Error(`Invalid Currency: ${value}`);
    }

    return value;
  }),
});

export const UpdateTimezoneSchema = z.object({
  timezone: z.custom((value) => {
    const found = timezones.some((c) => c.tzCode === value);
    if (!found) {
      throw new Error(`Invalid Timezone: ${value}`);
    }

    return value;
  }),
});
