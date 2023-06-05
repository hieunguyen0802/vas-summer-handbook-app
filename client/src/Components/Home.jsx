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
import { useState, useRef, useEffect } from "react";
import DataTable from "react-data-table-component";

import OTPInput, { ResendOTP } from "otp-input-react";

const Home = () => {
  /*All states */
  const [studentTable, setStudentTable] = useState();
  const dataTable = useRef(null);
  const [isGettingOTP, setGettingOTP] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [otp, setOtp] = useState("");





  /*------*/

  /*Button control */
  const renderButton = (buttonProps) => {
    return (
      <Button {...buttonProps} onClick={handleResendOtp}>
        {buttonProps.remainingTime !== 0
          ? `Please wait for ${buttonProps.remainingTime} sec`
          : "Resend"}
      </Button>
    );
  };
  const renderTime = () => React.Fragment;


  const handleGetOtp = () => {
    setGettingOTP(true);
  };

  const handleResendOtp = () => {
    console.log("Resending OTP");
  };

  const handleLogin = () => {
    setGettingOTP(false);
    setIsLogin(true);
    sessionStorage.setItem("isLogin", true);
    sessionStorage.setItem("loginTime", Date.now());
  };

  /*------*/

  
  /*Data table */
  const handleChange = ({ selectedRows }) => {
    console.log("Selected Rows: ", selectedRows);
  };
  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Id",
      selector: (row) => row.userId,
    },
    {
      name: "Year",
      selector: (row) => row.id,
    },
  ];

  const expandableRowsComponent = () => {
    return (
      <>
        <Form className="m-3 p-3">
          <h5 className="text-center">
            Thông Tin Về Sức Khỏe Để Tham Gia Chương Trình Trại Hè VAS 2023 /{" "}
            <i style={{ color: "blue" }}>
              Health Information for VAS Summer Camp 2023 Participation
            </i>
          </h5>
          <hr />
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
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
              <InputGroup.Checkbox />
              <Form.Control />
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
              <InputGroup.Checkbox aria-label="Checkbox for following text input" />
              <Form.Control aria-label="Text input with checkbox" />
            </InputGroup>
          </Form.Group>
          <hr />
        </Form>
      </>
    );
  };
  /*------*/

  /*Api calls */
  const getApiData = async () => {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos/"
    ).then((response) => response.json());

    // update the state
    setStudentTable(response.slice(0, 3));
  };

  useEffect(() => {
    getApiData();
  }, []);
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
                      <Form.Control placeholder="email" />
                      <Button size="lg" variant="danger" onClick={handleGetOtp}>
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
          <form>
            {isLogin && !isGettingOTP && (
              <div ref={dataTable}>
                <div className="container">
                  <h3 className="text-center">Students Profiles</h3>
                  <DataTable
                    columns={columns}
                    data={studentTable}
                    expandableRows
                    expandableRowsComponent={expandableRowsComponent}
                    selectableRows
                    responsive
                    highlightOnHover
                    onSelectedRowsChange={handleChange}
                  />
                </div>
                <center>
                  <Button variant="success">Confirm</Button>
                </center>
              </div>
            )}
          </form>
        </section>
      </div>
    </div>
  );
};

export default Home;
