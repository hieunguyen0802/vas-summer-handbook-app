import React from "react";
import Form from "react-bootstrap/Form";

export default function TextFields() {
  const [values, setValues] = React.useState({
    name: ""
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const error = values.name !== "a";

  return (

    <form>
      <p>hihi</p>
        <Form.Control
        id="standard-name"
        label="Name"
        value={values.name}
        onChange={handleChange("name")}
        margin="normal"
        helperText={error ? "Name needs to be 'a'" : "Perfect!"}
        error={error}
      />
    </form>
  );
}
