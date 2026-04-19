import { initBotId } from "botid/client/core";

initBotId({
  protect: [
    {
      path: "/api/*",
      method: "POST",
    },
  ],
});
