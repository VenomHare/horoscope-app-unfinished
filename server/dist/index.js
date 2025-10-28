import express from 'express';
import cors from "cors";
import { getCurrentHora } from './workers/hora_detector.js';
const app = express();
app.use(cors());
app.use(express.json());
app.use((req, _, next) => {
    console.log([req.method, req.url, JSON.stringify(req.body)].join(" "));
    next();
});
app.post("/getHora", async (req, res) => {
    try {
        const { time } = req.body;
        const dateInstance = new Date(time);
        console.log(time, dateInstance);
        if (time == undefined || isNaN(dateInstance.getTime())) {
            res.status(400).json({
                message: "Invalid Input"
            });
            return;
        }
        const horaDetails = await getCurrentHora(dateInstance);
        console.log(horaDetails);
        res.json(horaDetails);
        return;
    }
    catch (err) {
        console.log("Error while processing getHora request", err);
        res.status(500).json({
            message: "Something went Wrong!"
        });
        return;
    }
});
app.listen(3000, () => {
    console.log("Server is running at 3000");
});
//# sourceMappingURL=index.js.map