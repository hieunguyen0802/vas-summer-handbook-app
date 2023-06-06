import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useRef } from 'react';

function TooltipPositionedExample() {
  const ref = useRef(null)
    const handleMe=() => {
    const params = sessionStorage.getItem("student");
    const obj = JSON.parse(params)
    console.log(obj)
    console.log(ref)
    console.log(ref.current.value)
    if (ref.current.value != null){
      console.log("empty")
    }
  }
  return (
    <>
    <Button onClick={handleMe}>clich</Button>
    <Form.Control
                name="secondHealthQuestion"
                disabled
                ref={ref}
                required
              />
   
    </>
  );

};
export default TooltipPositionedExample;
