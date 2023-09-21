import User from "@/app/models/User";
import MongoConnection from "@/app/utils/MongoConnection";
import { NextResponse } from "next/server";
import speakeasy from "speakeasy";

export async function POST(request: Request) {

    await MongoConnection();

    try {
        const userData = await request.json();
        console.log("userData: ", userData);

        const email = userData.email;
        const otp = userData.otp;
        console.log("otp: ", otp);

        const user = await User.findOne({ email: email })
        console.log("user seceret: ", user.secret);

        if (user) {
            const verified = speakeasy.totp.verify({
                secret: user.secret,
                token: otp,
                encoding: 'base32'
            })
            console.log("Check verification", verified);
            if (verified) {
                await User.findOneAndUpdate({ email: email }, {
                    verify: true,
                    $unset: {
                        secret: user.secret
                    }
                })
                return NextResponse.json({ status: 200 })
            }
            return NextResponse.json({ message: "Invalid OTP" }, { status: 401 })
        } else {
            return NextResponse.json({ message: "User Not Found", status: 405 })
        }
    }
    catch (error) {
        console.log("error: ", error);
        return NextResponse.json({ status: 500 })
    }
}