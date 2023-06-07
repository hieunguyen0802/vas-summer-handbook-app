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
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";

export default function TextFields() {
  const [checkedFirstQuestion, setCheckedFirstQuestion] = useState(false);
  const [checkedSecondQuestion, setCheckedSecondQuestion] = useState(false);
  const refFirstQuestion = useRef(null);
  const refSecondQuestion = useRef(null);
  const [readyToConfirm, setReadyToConfirm] = useState(false);
  const [studentTable, setStudentTable] = useState();
  const dataTable = useRef(null);
  const [isGettingOTP, setGettingOTP] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [otp, setOtp] = useState("");
  const refLogin = useRef("");
  const [showAlert, setShowAlert] = useState("");
  const [validateLogin, setValidateLogin] = useState(true);
  const [isConfirm, setIsConfirm] = useState("");
  const [confirmTime, setConfirmTime] = useState("");
  const [firstHealthQuestion, setFirstHealthQuestion] = useState("");
  const [secondHealthQuestion, setSecondHealthQuestion] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (row) => {
    console.log(row);
    setShow(true);
  }
  const handleClick = async () => {
    const params = "thuyduong032201@gmail.com";
    await fetch("/getTestTable?email=" + params, { method: "GET" })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setStudentTable(result);
      })
      .catch((err) => console.log(err));
  };

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
      cell: row => (
        <Button size="sm" variant="outline-secondary" onClick={()=>handleShow(row)}>
          view more
        </Button>
      ),
    },
  ];

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header>
          <Modal.Title>
            Thông Tin Về Sức Khỏe Để Tham Gia Chương Trình Trại Hè VAS 2023 /{" "}
            <i style={{ color: "blue" }}>
              Health Information for VAS Summer Camp 2023 Participation
            </i>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="m-3">
            <Form.Group
              className="mb-2"
              controlId="firstQuestionHealthControlInput"
            >
              <p>
                Học sinh có tiền sửa bệnh tật/ dị ứng nào mà có thể nguy hiểm
                tới sức khỏe không ? (Ví dụ: dị ứng nghiêm trọng với thuốc, nọc
                của ong hoặc thức ăn, động kinh, tiểu đường, bệnh tim) /{" "}
                <i style={{ color: "blue" }}>
                  Does the student have any potentially life-threatening*
                  conditions/allergies? (examples: severe allergy to a
                  medication, bee sting or food, seizures, diabetes, heart
                  condition)
                </i>
              </p>
              <p>
                Nếu có, vui lòng ghi rõ tình trạng và phương pháp điều trị. Nếu không, vui lòng để trống /{" "}
                <i style={{ color: "blue" }}>
                  If yes, please clearly explain condition and treatment. If no, please leave blank
                </i>
              </p>

              <InputGroup className="mb-3">
                  <Form.Control
                    name="firstHealthQuestion"
                    defaultValue={firstHealthQuestion}
                  />
              </InputGroup>
              <hr />
              <Form.Text>
                <i>
                  * Trong trường hợp học sinh có bệnh tật có thể gây nguy hiểm
                  đến sức khỏe, GIA ĐÌNH có trách nhiệm thông báo cho Nhà trường
                  và nhân viên y tế của Nhà trường biết trước khi con/em mình
                  tham gia Chương trình Trại hè. /{" "}
                  <span style={{ color: "blue" }}>
                    {" "}
                    If a life-threatening health condition exists, it is the
                    responsibility of the FAMILY to notify the School and the
                    School nurse before the student is beginning the Summer
                    Camp.{" "}
                  </span>{" "}
                </i>
              </Form.Text>
            </Form.Group>
            <hr />
            <Form.Group
              className="mb-2"
              controlId="secondQuestionHealthControlInput"
            >
              <p>
                Học sinh có đang dùng thuốc hoặc đang điều trị mà có thể ảnh
                hưởng đến việc tham gia các hoạt động của Chương trình Trại hè
                không? (Ví dụ: đang dùng thuốc hen suyễn){" "}
                <i style={{ color: "blue" }}>
                  Is the student currently taking any medication or receiving
                  treatment that would impact his/her participation in the
                  Summer Camp activities? (Example: asthma inhaler)
                </i>
              </p>
              <p>
                Nếu có, vui lòng ghi rõ tình trạng và phương pháp điều trị. Nếu không, vui lòng để trống /{" "}
                <i style={{ color: "blue" }}>If yes, please explain. If no, please leave blank</i>{" "}
              </p>
              <InputGroup className="mb-3">
                  <Form.Control
                    name="secondHealthQuestion"
                    defaultValue={secondHealthQuestion}
                  />
                
              </InputGroup>
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <div>
        <div className="container">
          <Button onClick={handleClick}>click</Button>
          <h3 className="text-center">Students Profiles</h3>
          <DataTable
            columns={columns}
            data={studentTable}
            responsive
            highlightOnHover
          />
        </div>
      </div>
    </>
  );
}
