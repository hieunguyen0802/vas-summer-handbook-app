import React from "react";
import Table from "react-bootstrap/Table";
import { useState, useRef, useEffect } from "react";

const StudentDataTable = () => {
    const [studentTable, setStudentTable] = useState();
    const dataTable = useRef(null);

    const getApiData = async () => {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/todos/"
        ).then((response) => response.json());
    
        // update the state
        setStudentTable(response);
      };
    
      useEffect(() => {
        getApiData();
      }, []);

  return (
    <div className="container">
      <h3 className="text-center">Students Profiles</h3>
      <div className="data-table" ref={dataTable}>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Id</th>
              <th>User Id</th>
              <th>Title</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {studentTable ? (
              studentTable.filter(u => u.userId===1).map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.userId}</td>
                  <td>{item.title}</td>
                  <td>{item.completed}</td>
                </tr>
              ))
            ):""}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default StudentDataTable;
