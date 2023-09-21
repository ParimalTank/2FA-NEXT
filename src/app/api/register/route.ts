import User from "@/app/models/User";
import MongoConnection from "@/app/utils/MongoConnection";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { sendMail } from "@/app/utils/MailSender";

export async function POST(request: Request) {

    // Random 6 digit OTP Generator
    let otp = Math.random();
    otp = otp * 1000000;
    otp = parseInt(otp);

    try {
        await MongoConnection();
        const userData = await request.json();

        const email = await User.exists({ email: userData.email });

        if (email) {
            return NextResponse.json({ message: "User is Already Exist" }, { status: 409 })
        } else {

            const generateHash = await bcrypt.hash(userData.password, 10);

            const user = {
                username: userData.username,
                email: userData.email,
                password: generateHash,
                verificationCode: otp
            }

            const result = await User.create(user);

            await sendMail(
                "Mail Verification",
                JSON.stringify(userData.email),
                `Verify Code :  ${otp}`
            );

            return NextResponse.json({ result }, { status: 200 })
        }
    } catch (err) {
        console.log("err: ", err);
        return NextResponse.json({ status: 500 })
    }
}