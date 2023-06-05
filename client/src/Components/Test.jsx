import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

function TooltipPositionedExample() {
  return (
    <>
     
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip id='bottom'>
              Tooltip on <strong>hihi</strong>.
            </Tooltip>
          }
        >
          <button>Tooltip on me</button> 
        </OverlayTrigger>
      
    </>
  );
}

export default TooltipPositionedExample;