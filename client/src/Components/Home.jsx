import React from "react";
import NavbarHeader from "./NavbarHeader";
import Banner from "../Assets/pictures/banner.png";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useState, useRef } from "react";
import DataTable from "react-data-table-component";
import Alert from "react-bootstrap/Alert";

import OTPInput, { ResendOTP } from "otp-input-react";

const Home = () => {
  /*All states and ref */
  const [studentTable, setStudentTable] = useState({});
  const dataTable = useRef(null);
  const [isGettingOTP, setGettingOTP] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [otp, setOtp] = useState("");
  const refFirstQuestion = useRef(null);
  const refSecondQuestion = useRef(null);
  const refLogin = useRef('');
  const [checkedFirstQuestion, setCheckedFirstQuestion] = useState(false);
  const [checkedSecondQuestion, setCheckedSecondQuestion] = useState(false);
  const [readyToConfirm, setReadyToConfirm] = useState(false);
  const [showAlert, setShowAlert] = useState("");
  const [validateLogin, setValidateLogin] = useState(true);

  /*------*/
  const handleValidateLogin = () => {
    if (refLogin.current.value.includes("@")) {
      setValidateLogin(false)
    } else {
      setValidateLogin(true)
    }
  }

  const Handbook = "https://vietuc.sharepoint.com/:b:/s/VASContentSharing/ESYNnnOMCpBMuMqW03-gyk0BXV_SeUFuUUe25hzJj9MiiQ?e=m8Wf9M"
  
  /*Button control */
  const renderButton = (buttonProps) => {
    return (
      <Button {...buttonProps} onClick={handleResendOtp}>
        {buttonProps.remainingTime !== 0
          ? `Please wait for ${buttonProps.remainingTime} sec to resend`
          : "Resend"}
      </Button>
    );
  };
  const renderTime = () => React.Fragment;

  const handleGetOtp = async () => {
    const params = refLogin.current.value;
    await fetch("/getParent?email=" + params, { method: "GET" })
      .then((res) => res.json())
      .then((result) => {
        if (result.message === "Success") {
          sessionStorage.setItem("OTP", result.data);
          setGettingOTP(true);
        } else {
          setShowAlert("fail");
        }
      });
  };

  const handleResendOtp = async () => {
    const params = sessionStorage.getItem("OTP");
    await fetch("/ResendOTP?oldOtpCode=" + params, { method: "GET" })
      .then((res) => res.json())
      .then((result) => {
        if (result.message === "Success") {
          sessionStorage.setItem("OTP", result.data);
          setGettingOTP(true);
        } else {
          setShowAlert("fail");
        }
      });
  };

  const handleLogin = async () => {
    const params = sessionStorage.getItem("OTP");
    await fetch("/ValidOTP?OtpCode=" + params, { method: "GET" })
      .then((res) => res.json())
      .then((result) => {
        if (result.message === "Success") {
          console.log(result);
          setGettingOTP(false);
          setIsLogin(true);
          sessionStorage.setItem("isLogin", true);
          sessionStorage.setItem("loginTime", Date.now());
          sessionStorage.setItem("student", JSON.stringify(result.data));
          setStudentTable(result.data);
        } else {
          setShowAlert("fail");
        }
      });
  };

  const handleSubmit = async (e) => {
    console.log(refFirstQuestion.current);
    console.log(refSecondQuestion.current);
    const studentSessionStorage = sessionStorage.getItem("student");
    const student = JSON.parse(studentSessionStorage);

    if (refFirstQuestion.current != null) {
      student[0].firstHealthQuestion = refFirstQuestion.current.value;
    }
    if (refSecondQuestion.current != null) {
      student[0].secondHealthQuestion = refSecondQuestion.current.value;
    }

    await fetch("/Confirm", {
      method: "POST",
      headers: {
        Accept: "application.json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student[0]),
      cache: "default",
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.message === "Success") {
          console.log(result);
          setShowAlert("success");
          sessionStorage.clear();
          window.location.reload(true);
        } else {
          setShowAlert("fail");
        }
      })
      .catch((err) => console.log(err));
  };

  /*------*/

  /*Data table */
  /*   const handleSelectRow = (selectedRows) => {
    if (Object.entries(selectedRows)[0][1] === true) {
      setReadyToConfirm(true);
    } else {
      setReadyToConfirm(false);
    }

    console.log("Selected Rows: ", Object.entries(selectedRows)[0]);
  }; */

  const columns = [
    {
      name: "Student Code",
      selector: (row) => row.studentCode,
    },
    {
      name: "Student Name",
      selector: (row) => row.studentName,
    },
    {
      name: "Gender",
      selector: (row) => (row.gender === "M" ? "Male" : "Female"),
      maxWidth: "0px",
    },
    {
      name: "DOB",
      selector: (row) => row.dob,
      center: true,
    },
    {
      name: "Grade",
      selector: (row) => row.grade,
      center: true,
    },
    {
      name: "Campus",
      selector: (row) => row.campus,
      center: true,
      grow: 2,
    },
    {
      name: "Parent Name",
      selector: (row) => row.parentGuardianName,
      center: true,
      grow: 2,
    },
  ];

  const expandableRowsComponent = () => {
    return (
      <>
        <section className="m-3 p-3">
          <h5 className="text-center">
            Thông Tin Về Sức Khỏe Để Tham Gia Chương Trình Trại Hè VAS 2023 /{" "}
            <i style={{ color: "blue" }}>
              Health Information for VAS Summer Camp 2023 Participation
            </i>
          </h5>
          <hr />
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput">
            <p>
              Học sinh có tiền sửa bệnh tật/ dị ứng nào mà có thể nguy hiểm tới
              sức khỏe không ? (Ví dụ: dị ứng nghiêm trọng với thuốc, nọc của
              ong hoặc thức ăn, động kinh, tiểu đường, bệnh tim) /{" "}
              <i style={{ color: "blue" }}>
                Does the student have any potentially life-threatening*
                conditions/allergies? (examples: severe allergy to a medication,
                bee sting or food, seizures, diabetes, heart condition)
              </i>
            </p>
            <p>
              Nếu có, vui lòng ghi rõ tình trạng và phương pháp điều trị: /{" "}
              <i style={{ color: "blue" }}>
                If yes, please clearly explain condition and treatment:
              </i>
            </p>
            <InputGroup className="mb-3">
              <InputGroup.Checkbox
                checked={checkedFirstQuestion}
                onChange={() => {
                  setCheckedFirstQuestion(!checkedFirstQuestion);
                }}
              />
              <Form.Control
                name="firstHealthQuestion"
                disabled={!checkedFirstQuestion}
                ref={refFirstQuestion}
              />
            </InputGroup>
            <hr />
            <Form.Text>
              <i>
                * Trong trường hợp học sinh có bệnh tật có thể gây nguy hiểm đến
                sức khỏe, GIA ĐÌNH có trách nhiệm thông báo cho Nhà trường và
                nhân viên y tế của Nhà trường biết trước khi con/em mình tham
                gia Chương trình Trại hè. /{" "}
                <span style={{ color: "blue" }}>
                  {" "}
                  If a life-threatening health condition exists, it is the
                  responsibility of the FAMILY to notify the School and the
                  School nurse before the student is beginning the Summer Camp.{" "}
                </span>{" "}
              </i>
            </Form.Text>
          </Form.Group>
          <hr />
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <p>
              Học sinh có đang dùng thuốc hoặc đang điều trị mà có thể ảnh hưởng
              đến việc tham gia các hoạt động của Chương trình Trại hè không?
              (Ví dụ: đang dùng thuốc hen suyễn){" "}
              <i style={{ color: "blue" }}>
                Is the student currently taking any medication or receiving
                treatment that would impact his/her participation in the Summer
                Camp activities? (Example: asthma inhaler)
              </i>
            </p>
            <p>
              Nếu có, vui lòng ghi rõ tình trạng và phương pháp điều trị: /{" "}
              <i style={{ color: "blue" }}>If yes, please explain</i>{" "}
            </p>
            <InputGroup className="mb-3">
              <InputGroup.Checkbox
                checked={checkedSecondQuestion}
                onChange={() => {
                  setCheckedSecondQuestion(!checkedSecondQuestion);
                }}
              />
              <Form.Control
                name="secondHealthQuestion"
                disabled={!checkedSecondQuestion}
                ref={refSecondQuestion}
                required
              />
            </InputGroup>
          </Form.Group>
          <hr />
        </section>
      </>
    );
  };
  /*------*/

  /*Api calls */

  if (showAlert === "fail") {
    return (
      <center>
        <Alert
          variant="danger"
          onClose={() => setShowAlert("")}
          dismissible
          style={{ width: "42rem" }}
        >
          <Alert.Heading>
            Oh snap! You got an error! Please try again or contact admission officer
          </Alert.Heading>
        </Alert>
      </center>
    );
  } else if (showAlert === "success") {
    return (
      <center>
        <Alert
          variant="success"
          onClose={() => setShowAlert("")}
          dismissible
          style={{ width: "42rem" }}
        >
          <Alert.Heading>Thank you for your confirmation</Alert.Heading>
        </Alert>
      </center>
    );
  }

  /*------*/

  return (
    <div>
      {/* Navbar - Image - Login Button - Get/ Verify/ Resend OTP */}
      <NavbarHeader />
      <div className="content-wrapper">
        <div className="container">
          <section className="content">
            <figure className="text-center">
              <Image fluid src={Banner} />
            </figure>

            <h2 className="text-center text-danger mb-1 p-1">
              Welcome Parents &#128515;{" "}
            </h2>
            {!isLogin && (
              <Container>
                <Row className="justify-content-md-center">
                  <Col md="8">
                    <InputGroup className="mb-3">
                      <InputGroup.Text>@</InputGroup.Text>
                      <Form.Control
                        type="email"
                        ref={refLogin}
                        placeholder="email"
                        onChange={handleValidateLogin}
                      />
                      <Button size="lg" variant="danger" onClick={handleGetOtp} disabled={validateLogin} >
                        Log In
                      </Button>
                    </InputGroup>
                  </Col>
                </Row>
              </Container>
            )}
          </section>

          {isGettingOTP && (
            <div>
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
                />
                <div className="box m-3 p-3">
                  {otp.length === 6 ? (
                    <Button onClick={handleLogin}>Verify OTP Code</Button>
                  ) : (
                    <ResendOTP
                      renderButton={renderButton}
                      renderTime={renderTime}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <hr />

        {/* Student Profile - Data Table and confirm*/}

        <section>
          {isLogin && !isGettingOTP && (
            <div ref={dataTable}>
              <div className="container">
                
                <h3 className="text-center">Students Profiles</h3>
                <DataTable
                  columns={columns}
                  data={studentTable}
                  expandableRows
                  expandableRowsComponent={expandableRowsComponent}
                  responsive
                  highlightOnHover
                  /* selectableRows
                    onSelectedRowsChange={handleSelectRow} */
                />
              </div>
              <center>
                <Form.Check
                  size="lg"
                  type="checkbox"
                  onChange={() => {
                    if (readyToConfirm) {
                      setReadyToConfirm(false);
                    } else {
                      setReadyToConfirm(true);
                    }
                  }}
                  inline
                />{" "}
                I confirm I have read the <a className="text-danger" style={{fontSize:18}} href={Handbook}><strong>handbook file</strong></a> carefully and take
                responsibilities if anything happens
                <Button
                  className="ms-3"
                  size="md"
                  variant="success"
                  disabled={!readyToConfirm}
                  onClick={handleSubmit}
                >
                  Confirm
                </Button>
              </center>
            </div>
          )}
        </section>
      </div>
      <div
        className="container-fluid bg-danger text-center text-white m-0 py-1 d-flex flex-column justify-content-center"
        style={{
          position: "absolute",
          bottom: "0",
          width: "100%",
          height: "4rem",
        }}
      >
        <p className="m-0">&copy;Vietnam Australian School 2023</p>
      </div>
    </div>
  );
};

export default Home;
