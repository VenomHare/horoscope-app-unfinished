import { getCurrentHora } from "@/lib/hora-detector";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const { time, lng, lat } = await req.json();
        console.log({ time, lat: parseFloat(lat) });
        const dateInstance = new Date(time);
        console.log(time, dateInstance);
        if (time == undefined || isNaN(dateInstance.getTime())) {
            return NextResponse.json({
                message: "Invalid Input"
            }, { status: 400 });
        }
        const horaDetails = await getCurrentHora(parseFloat(lat), parseFloat(lng), dateInstance);
        console.log(horaDetails)
        return NextResponse.json(horaDetails);
    }
    catch (err) {
        console.log("Error while processing getHora request", err);
        return NextResponse.json({
            message: "Something went Wrong!"
        }, { status: 500 });
    }
}