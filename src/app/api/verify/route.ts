import User from "@/app/models/User";
import MongoConnection from "@/app/utils/MongoConnection";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    try {
        await MongoConnection();

        const userData = await request.json();

        const user = await User.findOne({ _id: userData.id });

        if (Number(user.verificationCode) == Number(userData.code)) {

            await User.findOneAndUpdate({ _id: userData.id }, { verify: true, })

            return NextResponse.json({ status: 200 });
        } else {
            return NextResponse.json({ message: "Invalid OTP" }, { status: 500 });
        }
    } catch (error) {
        console.log("error: ", error);
        return NextResponse.json({ status: 500 });
    }
}