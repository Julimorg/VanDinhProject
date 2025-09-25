import React from 'react';
import styled from 'styled-components';

interface TicketInstructionBoxProps {
  title: string;
  steps: string[];
}

const Box = styled.div`
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  width: 100%;
`;

const Title = styled.h4`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const StepList = styled.ol`
  padding-left: 1rem;
  list-style-type: decimal;
`;

const StepItem = styled.li`
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
`;

const InstructionBox: React.FC<TicketInstructionBoxProps> = ({ title, steps }) => {
  return (
    <Box>
      <Title>{title}</Title>
      <StepList>
        {steps.map((step, index) => (
          <StepItem key={index}>{step}</StepItem>
        ))}
      </StepList>
    </Box>
  );
};

export default InstructionBox;
