import app from "./app";
import { connectDB } from "./config/dbConnect";

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`server is listening on ${PORT}`);
});
