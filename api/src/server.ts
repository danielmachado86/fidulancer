import app from "./app";
import env from "./util/validateEnv";

const port = env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening: http://localhost:${port}`);
});
