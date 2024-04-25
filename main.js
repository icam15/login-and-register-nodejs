import { logger } from "./src/app/logging.js";
import { web } from "./src/app/web.js";

web.listen(4000, () => {
    logger.info("server running")
});



