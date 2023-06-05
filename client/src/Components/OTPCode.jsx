import React from "react";
import { useState, useRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Col from "react-bootstrap/Col";
import OTPInput, { ResendOTP } from "otp-input-react";

const OTPCode = () => {
  const [otp, setOtp] = useState("");
  const renderButton = (buttonProps) => {
    return (
      <button {...buttonProps}>
        {buttonProps.remainingTime !== 0
          ? `Please wait for ${buttonProps.remainingTime} sec`
          : "Resend"}
      </button>
    );
  };
  const renderTime = () => React.Fragment;
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <OTPInput
          value={otp}
          onChange={setOtp}
          autoFocus
          OTPLength={6}
          otpType="number"
          disabled={false}
          secure
        />
        <div className="box m-3 p-3">
            {}
          <ResendOTP renderButton={renderButton} renderTime={renderTime} />
        </div>
      </div>
    </>
  );
};

export default OTPCode;
