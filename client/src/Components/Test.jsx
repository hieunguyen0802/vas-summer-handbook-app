import DataTable from "react-data-table-component";
import { useState,useEffect } from "react";
import Alert from 'react-bootstrap/Alert';

function TooltipPositionedExample() {

  const [studentTable, setStudentTable] = useState();
  const [showAlert, setShowAlert] = useState('');
  
  const getApiData = async () => {
    const params = "vinguyen199@gmail.com"
    await fetch("/getTestTable?email="+params)
      .then((res) => res.json())
      .then(
        (result) => {          
          console.log(result);
          setShowAlert("success");
          setStudentTable(result);
        },
        (error) => {
          setShowAlert("fail");
          console.log(error)     
        }
      );
      
    }
    useEffect(() => {
      getApiData();
    }, []);
    
 
  if(showAlert==="fail") {
    return (
      <Alert variant="danger" onClose={() => setShowAlert('')} dismissible >
        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
      </Alert>
    );
  } else if (showAlert ==="success") {
    return (
      <center>
      <Alert variant="success" onClose={() => setShowAlert('')} dismissible style={{ width: "42rem" }}>
        <Alert.Heading>Thank you</Alert.Heading>
      </Alert>
      </center>
    );
  }

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
      selector: (row) => row.gender ==="M" ? "Male" : "Female",
      maxWidth:"0px"
    },
    {
      name: "DOB",
      selector: (row) => row.dob.split("T")[0],
      center: true
    },
    {
      name: "Grade",
      selector: (row) => row.grade,
      center: true
    }, 
    {
      name: "Campus",
      selector: (row) => row.campus,
      center: true,
      grow:2
    },
    {
      name: "Parent Name",
      selector: (row) => row.parentGuardianName,
      center: true,
      grow:2
    },
  ];


  return (
    <>
    Table
      <DataTable columns={columns} data={studentTable} />
    </>
  );

};
export default TooltipPositionedExample;
