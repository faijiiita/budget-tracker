import timezones from "timezones-list";
import { Currencies } from "@/lib/currencies";
import { z } from "zod";

export const UpdateUserCurrencySchema = z.object({
  currency: z.custom((value) => {
    const found = Currencies.some((c) => c.value === value);

    if (!found) {
      throw new Error(`Invalid Currency: ${value}`);
    }

    return value;
  }),
});

export const UpdateUserTimezoneSchema = z.object({
  timezone: z.custom((value) => {
    const found = timezones.some((t) => t.label === value);

    if (!found) {
      throw new Error(`Invalid Timezone: ${value}`);
    }

    return value;
  }),
});
